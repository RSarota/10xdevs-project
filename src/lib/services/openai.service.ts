import { z } from "zod";

/**
 * Propozycja fiszki wygenerowana przez AI
 */
export interface FlashcardProposal {
  front: string;
  back: string;
}

/**
 * Interfejs dla sparsowanej odpowiedzi z API
 */
export interface ParsedResponse {
  flashcards: {
    front: string;
    back: string;
  }[];
}

/**
 * Interfejs dla surowej odpowiedzi z Azure OpenAI API
 */
interface AzureOpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    finish_reason: string;
    message: {
      role: string;
      content: string | null;
      function_call?: {
        name: string;
        arguments: string;
      };
    };
  }[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Konfiguracja serwisu Azure OpenAI
 */
export interface OpenAIServiceConfiguration {
  apiKey: string;
  endpoint: string;
  systemMessage: string;
}

/**
 * Błąd serwisu Azure OpenAI
 */
export class OpenAIServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number
  ) {
    super(message);
    this.name = "OpenAIServiceError";
  }
}

/**
 * Alias dla kompatybilności wstecznej
 * @deprecated Użyj OpenAIServiceError zamiast tego
 */
export const AIServiceError = OpenAIServiceError;

/**
 * Schema walidacji dla odpowiedzi z funkcji generate_flashcards
 */
const FlashcardSchema = z.object({
  front: z.string().min(1).max(200),
  back: z.string().min(1).max(500),
});

const GenerateFlashcardsResponseSchema = z.object({
  flashcards: z.array(FlashcardSchema).min(1),
});

// Pobranie zmiennych środowiskowych na poziomie modułu (tak jak w supabase.client.ts)
const openAiApiKey = import.meta.env.OPENAI_API_KEY;
const openAiEndpoint = import.meta.env.OPENAI_URL;

// Walidacja zmiennych środowiskowych na poziomie modułu
if (!openAiApiKey || typeof openAiApiKey !== "string" || openAiApiKey.trim().length === 0) {
  throw new Error(
    `Brak klucza API (OPENAI_API_KEY) w zmiennych środowiskowych. Upewnij się, że zmienna jest zdefiniowana w pliku .env.local`
  );
}

if (!openAiEndpoint || typeof openAiEndpoint !== "string" || openAiEndpoint.trim().length === 0) {
  throw new Error(
    `Brak endpointu (OPENAI_URL) w zmiennych środowiskowych. Upewnij się, że zmienna jest zdefiniowana w pliku .env.local`
  );
}

// Walidacja formatu endpointu (wymuszanie HTTPS)
if (!openAiEndpoint.startsWith("https://")) {
  throw new Error("Endpoint (OPENAI_URL) musi używać protokołu HTTPS");
}

/**
 * Serwis do komunikacji z Azure OpenAI API
 *
 * Umożliwia:
 * - Wysyłanie zapytań do modelu Azure OpenAI
 * - Parsowanie ustrukturyzowanych odpowiedzi (function calling)
 * - Obsługę błędów autoryzacji, sieci i formatu odpowiedzi
 */
export class OpenAIService {
  public readonly configuration: OpenAIServiceConfiguration;

  private readonly _apiKey: string;
  private readonly _endpoint: string;

  /**
   * Konstruktor serwisu Azure OpenAI
   *
   * Używa zmiennych środowiskowych załadowanych na poziomie modułu:
   * - OPENAI_API_KEY: Klucz API do autoryzacji
   * - OPENAI_URL: Pełny URL endpointu API Azure OpenAI
   *   (np. https://{resource}.openai.azure.com/openai/deployments/{model}/chat/completions?api-version=2024-02-15-preview)
   */
  constructor() {
    this._apiKey = openAiApiKey.trim();
    // OPENAI_URL powinien zawierać pełny URL endpointu API
    // np. https://{resource}.openai.azure.com/openai/deployments/{model}/chat/completions?api-version=2024-02-15-preview
    this._endpoint = openAiEndpoint.trim();

    // Domyślny komunikat systemowy dla generowania fiszek
    const defaultSystemMessage =
      "You are an expert flashcard generator for language learners. Always respond with concise, clear definitions and examples. Your goal is to create front and back for a flashcard where front can have up to 200 characters and back up to 500 characters. Expected response should be in polish.";

    // Publiczna konfiguracja
    this.configuration = {
      apiKey: this._apiKey,
      endpoint: this._endpoint,
      systemMessage: defaultSystemMessage,
    };
  }

  /**
   * Wysyła zapytanie do modelu Azure OpenAI
   *
   * @param message - Komunikat użytkownika
   * @param context - Opcjonalny kontekst rozmowy (dla przyszłej implementacji historii)
   * @returns Promise z surową odpowiedzią z API
   * @throws {OpenAIServiceError} W przypadku błędu autoryzacji, sieci lub formatu
   */
  public async sendRequest(message: string, context?: unknown): Promise<AzureOpenAIResponse> {
    // Walidacja danych wejściowych
    if (!message || typeof message !== "string" || message.trim().length === 0) {
      throw new OpenAIServiceError("Komunikat użytkownika nie może być pusty", "INVALID_INPUT", 400);
    }

    // Sanityzacja danych wejściowych (podstawowa ochrona przed injection)
    const sanitizedMessage = message.trim().slice(0, 10000); // Limit długości

    try {
      // Budowanie payloadu
      const payload = this._buildPayload(sanitizedMessage, context);

      // Wysyłanie żądania HTTP - używamy pełnego URL ze zmiennych środowiskowych
      const response = await fetch(this._endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": this._apiKey,
        },
        body: JSON.stringify(payload),
      });

      // Obsługa błędów HTTP
      if (!response.ok) {
        this._handleError(response, "HTTP_ERROR");

        // Próba wyciągnięcia szczegółów błędu z odpowiedzi
        let errorMessage = `Błąd HTTP: ${response.status} ${response.statusText}`;
        try {
          const errorData = await response.json();
          if (errorData?.error?.message) {
            errorMessage = errorData.error.message;
          }
        } catch {
          // Ignoruj błędy parsowania JSON
        }

        throw new OpenAIServiceError(errorMessage, "HTTP_ERROR", response.status);
      }

      // Parsowanie odpowiedzi
      const data = await response.json();

      // Walidacja struktury odpowiedzi
      if (!data || typeof data !== "object" || !Array.isArray(data.choices)) {
        throw new OpenAIServiceError("Nieprawidłowa struktura odpowiedzi z API", "INVALID_RESPONSE_FORMAT", 500);
      }

      return data as AzureOpenAIResponse;
    } catch (error) {
      // Obsługa błędów sieciowych i innych
      if (error instanceof OpenAIServiceError) {
        throw error;
      }

      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new OpenAIServiceError("Błąd połączenia z Azure OpenAI API", "NETWORK_ERROR", 503);
      }

      this._handleError(error, "UNKNOWN_ERROR");
      throw new OpenAIServiceError(
        `Nieoczekiwany błąd: ${error instanceof Error ? error.message : "Unknown error"}`,
        "UNKNOWN_ERROR",
        500
      );
    }
  }

  /**
   * Przetwarza surową odpowiedź z API, parsując ustrukturyzowane dane
   *
   * @param rawResponse - Surowe dane z API
   * @returns Sparsowana odpowiedź z walidacją
   * @throws {OpenAIServiceError} Jeśli odpowiedź nie pasuje do schematu { front, back }
   */
  public parseResponse(rawResponse: AzureOpenAIResponse): ParsedResponse {
    if (!rawResponse || !rawResponse.choices || rawResponse.choices.length === 0) {
      throw new OpenAIServiceError("Brak danych w odpowiedzi z API", "EMPTY_RESPONSE", 500);
    }

    const firstChoice = rawResponse.choices[0];

    // Sprawdzenie czy odpowiedź zawiera function_call
    if (!firstChoice.message.function_call) {
      throw new OpenAIServiceError("Odpowiedź z API nie zawiera function_call", "MISSING_FUNCTION_CALL", 500);
    }

    const functionCall = firstChoice.message.function_call;

    // Parsowanie arguments jako JSON
    let parsedArguments: unknown;
    try {
      parsedArguments = JSON.parse(functionCall.arguments);
    } catch {
      throw new OpenAIServiceError("Nie można sparsować arguments z function_call", "INVALID_JSON", 500);
    }

    // Walidacja przy użyciu Zod schema
    const validationResult = GenerateFlashcardsResponseSchema.safeParse(parsedArguments);

    if (!validationResult.success) {
      const errorMessages = validationResult.error.issues.map((issue) => issue.message).join(", ");
      throw new OpenAIServiceError(`Błąd walidacji odpowiedzi: ${errorMessages}`, "VALIDATION_ERROR", 500);
    }

    return validationResult.data;
  }

  /**
   * Prywatna metoda do budowania payloadu żądania
   *
   * @param message - Komunikat użytkownika (tekst źródłowy do generowania fiszek)
   * @param _context - Opcjonalny kontekst rozmowy (nieużywany w obecnej implementacji)
   * @returns Payload gotowy do wysłania w żądaniu
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _buildPayload(message: string, _context?: unknown): object {
    // Budowanie komunikatu użytkownika z instrukcją generowania
    const userMessage = `Create flashcards from the following text. Generate multiple flashcards that cover key concepts, definitions, and important information:\n\n${message}`;

    const messages = [
      {
        role: "system" as const,
        content: this.configuration.systemMessage,
      },
      {
        role: "user" as const,
        content: userMessage,
      },
    ];

    return {
      messages,
      functions: [
        {
          name: "generate_flashcards",
          description: "Generates flashcards with front and back text",
          parameters: {
            type: "object",
            properties: {
              flashcards: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    front: {
                      type: "string",
                      description: "Text for the front of the flashcard (max 200 characters)",
                    },
                    back: {
                      type: "string",
                      description: "Text for the back of the flashcard (max 500 characters)",
                    },
                  },
                  required: ["front", "back"],
                },
              },
            },
            required: ["flashcards"],
          },
        },
      ],
      function_call: { name: "generate_flashcards" },
    };
  }

  /**
   * Prywatna metoda do obsługi błędów
   *
   * @param error - Błąd do obsłużenia
   * @param errorType - Typ błędu dla klasyfikacji
   */
  private _handleError(error: unknown, errorType: string): void {
    // Logowanie błędów (bez wrażliwych danych)
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorDetails = {
      type: errorType,
      message: errorMessage,
      timestamp: new Date().toISOString(),
    };

    // W produkcji można użyć dedykowanego systemu logowania
    console.error("[OpenAIService Error]", errorDetails);

    // Obsługa błędów autoryzacji
    if (errorType === "HTTP_ERROR" && error instanceof Response) {
      if (error.status === 401 || error.status === 403) {
        console.error("[OpenAIService] Błąd autoryzacji - sprawdź klucz API");
      }
    }

    // Obsługa błędów sieciowych
    if (errorType === "NETWORK_ERROR") {
      console.error("[OpenAIService] Błąd sieci - sprawdź połączenie z Azure OpenAI");
    }
  }
}

/**
 * Generuje fiszki przy użyciu Azure OpenAI API
 *
 * Pomocnicza funkcja, która tworzy instancję OpenAIService i generuje fiszki.
 * Mapuje błędy OpenAIServiceError na odpowiednie kody dla kompatybilności.
 *
 * @param sourceText - Tekst źródłowy do wygenerowania fiszek (1000-10000 znaków)
 * @returns Tablica propozycji fiszek wygenerowanych przez AI
 * @throws {OpenAIServiceError} W przypadku błędu API, sieci lub walidacji
 */
export async function generateFlashcards(sourceText: string): Promise<FlashcardProposal[]> {
  try {
    // Utworzenie instancji serwisu (zmienne środowiskowe są już załadowane na poziomie modułu)
    const openAIService = new OpenAIService();

    // Wysłanie zapytania do Azure OpenAI
    const rawResponse = await openAIService.sendRequest(sourceText);

    // Parsowanie odpowiedzi
    const parsedResponse = openAIService.parseResponse(rawResponse);

    // Mapowanie odpowiedzi na format FlashcardProposal
    return parsedResponse.flashcards.map((flashcard) => ({
      front: flashcard.front,
      back: flashcard.back,
    }));
  } catch (error) {
    // Mapowanie błędów na odpowiednie kody dla kompatybilności
    if (error instanceof OpenAIServiceError) {
      // Mapowanie kodów błędów na odpowiednie kody HTTP
      let statusCode = error.statusCode;
      let code = error.code;

      // Mapowanie specyficznych błędów
      if (error.statusCode === 401 || error.statusCode === 403) {
        code = "AUTHENTICATION_ERROR";
      } else if (error.statusCode === 429) {
        code = "RATE_LIMIT_EXCEEDED";
      } else if (error.statusCode === 503 || error.code === "NETWORK_ERROR") {
        code = "SERVICE_UNAVAILABLE";
        statusCode = 503;
      }

      // Rzucamy nowy błąd z zmapowanym kodem
      throw new OpenAIServiceError(error.message, code, statusCode);
    }

    // Obsługa innych błędów
    if (error instanceof Error) {
      throw new OpenAIServiceError(error.message, "UNKNOWN_ERROR", 500);
    }

    throw new OpenAIServiceError("Nieoczekiwany błąd podczas generowania fiszek", "UNKNOWN_ERROR", 500);
  }
}
