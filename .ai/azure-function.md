### Przykładowa Azure Function v4 (TypeScript) — generowanie fiszek

Poniżej znajdziesz pełną, skondensowaną implementację Azure Function v4 w TypeScript, która:

- przyjmuje POST z promptem z frontendu,
- weryfikuje autoryzację klienta (nagłówek `Authorization: Bearer <supabase-jwt>` lub inne),
- pobiera serwisowy sekret do Azure OpenAI z Azure Key Vault przy użyciu Managed Identity,
- wywołuje Azure OpenAI (REST) i zwraca sformatowaną odpowiedź,
- loguje jedynie metadane i przybliżony koszt, bez zapisywania pełnych promptów (anonimizacja opcjonalna),
- zawiera podstawowe ograniczenie szybkości per-user (prosty licznik w pamięci jako przykład dla MVP).

Kod i opis zakłada Node 18 / Azure Functions v4 i użycie Managed Identity do Key Vault.

---

### Pliki i zależności (krótko)

package.json (ważne zależności)

```json
{
  "name": "flashcards-func",
  "version": "1.0.0",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "start": "func start"
  },
  "dependencies": {
    "@azure/identity": "^2.0.0",
    "@azure/keyvault-secrets": "^4.4.0",
    "axios": "^1.4.0"
  },
  "devDependencies": {
    "@types/node": "^18.0.0",
    "typescript": "^5.0.0"
  }
}
```

tsconfig.json (minimalny)

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "outDir": "dist",
    "esModuleInterop": true,
    "strict": true
  },
  "include": ["src/**/*"]
}
```

host.json (funkcja HTTP, przykładowo)

```json
{
  "version": "2.0",
  "extensions": {
    "http": {
      "routePrefix": ""
    }
  }
}
```

---

### Implementacja funkcji (src/index.ts)

```ts
import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { DefaultAzureCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";
import axios from "axios";

/**
 * Prosty in-memory rate limiter per-user na potrzeby MVP.
 * W produkcji zastąpić persistentnym licznikiem (Redis/DB).
 */
const rateWindowMs = 60_000;
const maxRequestsPerWindow = 10;
const userRequests = new Map<string, { count: number; windowStart: number }>();

// Konfiguracja (zmienne środowiskowe w funkcji)
const KEY_VAULT_NAME = process.env["KEY_VAULT_NAME"] || "";
const OPENAI_SECRET_NAME = process.env["OPENAI_SECRET_NAME"] || "OPENAI_API_KEY";
const OPENAI_ENDPOINT = process.env["OPENAI_ENDPOINT"] || ""; // np. https://{your-resource-name}.openai.azure.com
const OPENAI_DEPLOYMENT = process.env["OPENAI_DEPLOYMENT"] || ""; // nazwa deploymentu/modelu w Azure OpenAI
const SUPABASE_AUDIENCE = process.env["SUPABASE_AUDIENCE"] || ""; // opcjonalnie do weryfikacji JWT issuer/audience

if (!KEY_VAULT_NAME || !OPENAI_ENDPOINT || !OPENAI_DEPLOYMENT) {
  throw new Error("Missing required environment variables: KEY_VAULT_NAME, OPENAI_ENDPOINT, OPENAI_DEPLOYMENT");
}

const keyVaultUrl = `https://${KEY_VAULT_NAME}.vault.azure.net`;
const credential = new DefaultAzureCredential();
const secretClient = new SecretClient(keyVaultUrl, credential);

async function getOpenAiKey(): Promise<string> {
  const secret = await secretClient.getSecret(OPENAI_SECRET_NAME);
  return secret.value || "";
}

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const entry = userRequests.get(userId);
  if (!entry || now - entry.windowStart > rateWindowMs) {
    userRequests.set(userId, { count: 1, windowStart: now });
    return true;
  }
  if (entry.count >= maxRequestsPerWindow) {
    return false;
  }
  entry.count += 1;
  return true;
}

async function callAzureOpenAi(apiKey: string, prompt: string) {
  const url = `${OPENAI_ENDPOINT}/openai/deployments/${OPENAI_DEPLOYMENT}/chat/completions?api-version=2023-10-01`;
  const payload = {
    messages: [
      { role: "system", content: "You are a flashcard generator. From user text produce short Q/A flashcards." },
      { role: "user", content: prompt },
    ],
    max_tokens: 800,
    temperature: 0.2,
  };

  const resp = await axios.post(url, payload, {
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    timeout: 30_000,
  });

  return resp.data;
}

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  context.log.info("Generate flashcards request received");

  // 1) Autoryzacja: oczekujemy, że frontend przekaże token Supabase w Authorization header
  const auth = req.headers["authorization"] || "";
  const userId = req.headers["x-user-id"] || ""; // prosty pattern; w production weryfikuj token JWT i pobierz userId
  if (!auth) {
    context.res = { status: 401, body: { error: "Missing Authorization header" } };
    return;
  }

  // Tu: w MVP wystarczy podstawowa weryfikacja tokena (przykład pomijany).
  // Produkcyjnie: zweryfikuj JWT od Supabase (signature, expiry, audience).

  // 2) Payload validation
  const prompt = req.body && req.body.prompt ? String(req.body.prompt).trim() : "";
  if (!prompt) {
    context.res = { status: 400, body: { error: "Missing prompt in body" } };
    return;
  }

  // 3) Rate limiting (per-user)
  const effectiveUserId = userId || "anonymous";
  if (!checkRateLimit(effectiveUserId)) {
    context.res = { status: 429, body: { error: "Rate limit exceeded" } };
    return;
  }

  try {
    // 4) Pobranie sekretu z Key Vault
    const openAiKey = await getOpenAiKey();

    // 5) Opcjonalna anonimizacja / sanitacja promptu (tu prosty przykład)
    const sanitizedPrompt = prompt.replace(/\b(\d{12,16})\b/g, "[REDACTED]"); // prosta maska kart

    // 6) Wywołanie Azure OpenAI
    const apiResponse = await callAzureOpenAi(openAiKey, sanitizedPrompt);

    // 7) Logowanie metadanych (nie zapisujemy pełnego promptu)
    context.log.info({
      event: "flashcard_generation",
      userId: effectiveUserId,
      model: OPENAI_DEPLOYMENT,
      responseTokensEstimate: apiResponse.usage?.total_tokens ?? null,
    });

    // 8) Formatowanie odpowiedzi (dostosuj do swojej logiki)
    const answer = apiResponse.choices?.[0]?.message?.content ?? "";
    context.res = {
      status: 200,
      body: {
        flashcards: answer,
        meta: {
          model: OPENAI_DEPLOYMENT,
          tokens: apiResponse.usage?.total_tokens ?? null,
        },
      },
    };
  } catch (err: any) {
    context.log.error("Error calling OpenAI or Key Vault", err?.message ?? err);
    context.res = { status: 502, body: { error: "AI service error" } };
  }
};

export default httpTrigger;
```

---

### Konfiguracja i zmienne środowiskowe do ustawienia w Function App

- KEY_VAULT_NAME = <nazwa-keyvault>
- OPENAI_SECRET_NAME = OPENAI_API_KEY (domyślnie)
- OPENAI_ENDPOINT = https://{twoj-openai-resource}.openai.azure.com
- OPENAI_DEPLOYMENT = {nazwa-deploymnetu-modelu}
- (opcjonalnie) SUPABASE_AUDIENCE — do weryfikacji tokenów

Dodatkowo w Azure Portal:

- Włącz Managed Identity (system-assigned) dla Function App.
- W Key Vault -> Access policies / Access control (IAM) nadaj Managed Identity rolę "Key Vault Secrets User" (tylko odczyt sekretów).

---

### Uwagi operacyjne i bezpieczeństwo

- W produkcji: zamiast prostego in-memory rate-limitera użyj Redis lub DB (Supabase) do trwałego zliczania i egzekwowania limitów per-user.
- Zawsze weryfikuj JWT od Supabase serwerowo (sprawdzanie podpisu i expiry).
- Rotacja kluczy: zmień sekret w Key Vault i upewnij się, że Function App odczyta nową wartość bez restartu (DefaultAzureCredential obsługuje odświeżenie).
- Loguj jedynie metadane i anonimizowane fragmenty promptów; stosuj politykę retencji logów.
- Dla wywołań kosztotwórczych rozważ asynchroniczny model (job queue) z limitem jednoczesnych wywołań.

---

### Krótkie wskazówki do wdrożenia

1. Wdróż funkcję jako Azure Function v4 (Node 18).
2. Ustaw zmienne środowiskowe w Configuration.
3. Włącz Managed Identity i daj dostęp do Key Vault.
4. Skonfiguruj APIM aby forwardował żądania i walidował `x-api-key` jeśli używasz APIM.
5. Przetestuj flow z frontendem: frontend -> APIM (opcjonalnie) -> Function -> Azure OpenAI -> Function -> frontend.

Powodzenia w implementacji MVP — jeżeli chcesz, mogę przygotować wersję tej funkcji z weryfikacją JWT Supabase i przykładowym kodem testowym curl/postman.
