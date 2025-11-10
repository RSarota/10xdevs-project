# Plan Implementacji Testów Jednostkowych - 10x-cards

## 1. Wprowadzenie

Dokument ten zawiera szczegółowy plan implementacji testów jednostkowych dla kluczowych funkcjonalności systemu 10x-cards. Plan jest oparty na analizie kodu źródłowego i zgodny z głównym planem testów (`.ai/test-plan.mdc`).

## 2. Zakres Testów Jednostkowych

### 2.1. Obszary Testowania

Testy jednostkowe obejmują:

- **Serwisy** (`src/lib/services/`) - logika biznesowa i integracja z bazą danych
- **Schematy walidacji** (`src/lib/schemas/`) - walidacja danych wejściowych (Zod)
- **Narzędzia** (`src/lib/utils/`) - funkcje pomocnicze
- **Hooks React** (`src/hooks/`) - logika biznesowa w komponentach
- **Komponenty UI** (`src/components/`) - formularze i komponenty interaktywne

### 2.2. Narzędzia

- **Vitest** - główny framework testowy
- **React Testing Library** - testowanie komponentów React
- **@testing-library/user-event** - symulacja interakcji użytkownika
- **MSW (Mock Service Worker)** - mockowanie wywołań API (dla testów integracyjnych)

## 3. Priorytetyzacja Testów

### Priorytet 1 (Krytyczne) - Implementacja w pierwszej kolejności

#### 3.1. Serwisy - Zarządzanie Fiszkami

**Plik:** `src/lib/services/flashcards.service.test.ts`

**Funkcjonalności do przetestowania:**

1. **`getFlashcards()`**
   - ✅ Pobieranie fiszek z paginacją
   - ✅ Filtrowanie po typie (`manual`, `ai-full`, `ai-edited`)
   - ✅ Filtrowanie po `generation_id`
   - ✅ Sortowanie (`created_at`, `updated_at`, `asc`, `desc`)
   - ✅ Poprawne obliczanie offsetu dla paginacji
   - ✅ Zwracanie poprawnej liczby total
   - ✅ Obsługa błędów bazy danych
   - ✅ Weryfikacja filtrowania po `user_id` (ownership)

2. **`getFlashcardById()`**
   - ✅ Pobieranie pojedynczej fiszki po ID
   - ✅ Weryfikacja ownership (fiszka należy do użytkownika)
   - ✅ Zwracanie `null` gdy fiszka nie istnieje
   - ✅ Zwracanie `null` gdy fiszka należy do innego użytkownika
   - ✅ Obsługa błędów bazy danych

3. **`createOne()`**
   - ✅ Tworzenie fiszki manual (bez `generation_id`)
   - ✅ Tworzenie fiszki AI (`ai-full`) z walidacją `generation_id`
   - ✅ Tworzenie fiszki AI (`ai-edited`) z walidacją `generation_id`
   - ✅ Weryfikacja ownership `generation_id` (należy do użytkownika)
   - ✅ Aktualizacja statystyk generacji (`accepted_unedited_count` dla `ai-full`)
   - ✅ Aktualizacja statystyk generacji (`accepted_edited_count` dla `ai-edited`)
   - ✅ Rzucanie błędu gdy `generation_id` nie istnieje
   - ✅ Rzucanie błędu gdy `generation_id` należy do innego użytkownika
   - ✅ Obsługa błędów insertu do bazy danych

4. **`createMany()`**
   - ✅ Tworzenie wielu fiszek jednocześnie (bulk insert)
   - ✅ Walidacja wszystkich `generation_id` przed insertem
   - ✅ Grupowanie fiszek per `generation_id` dla statystyk
   - ✅ Bulk update statystyk per generation
   - ✅ Deduplikacja `generation_id` przed walidacją
   - ✅ Rzucanie błędu gdy którykolwiek `generation_id` jest nieprawidłowy
   - ✅ Zwracanie fiszek w tej samej kolejności co input
   - ✅ Obsługa błędów insertu

5. **`updateFlashcard()`**
   - ✅ Aktualizacja `front`
   - ✅ Aktualizacja `back`
   - ✅ Aktualizacja obu pól jednocześnie
   - ✅ Weryfikacja ownership przed aktualizacją
   - ✅ Walidacja danych wejściowych (schemat Zod)
   - ✅ Rzucanie błędu gdy fiszka nie istnieje
   - ✅ Rzucanie błędu gdy fiszka należy do innego użytkownika
   - ✅ Obsługa błędów update

6. **`deleteFlashcard()`**
   - ✅ Usuwanie fiszki z weryfikacją ownership
   - ✅ Zwracanie informacji o sukcesie (`success: true, deletedId`)
   - ✅ Zwracanie `success: false` gdy nic nie zostało usunięte
   - ✅ Obsługa błędów delete

7. **`bulkDeleteFlashcards()`**
   - ✅ Usuwanie wielu fiszek jednocześnie
   - ✅ Deduplikacja ID przed usunięciem
   - ✅ Weryfikacja ownership (usuwa tylko fiszki użytkownika)
   - ✅ Zwracanie liczby usuniętych fiszek
   - ✅ Zwracanie 0 gdy brak fiszek do usunięcia
   - ✅ Obsługa błędów delete

8. **`getAllFlashcardIds()`**
   - ✅ Pobieranie wszystkich ID fiszek użytkownika
   - ✅ Zwracanie pustej tablicy gdy brak fiszek
   - ✅ Obsługa błędów

9. **`validateGenerationOwnership()` (prywatna funkcja)**
   - ✅ Weryfikacja że `generation_id` istnieje
   - ✅ Weryfikacja że `generation_id` należy do użytkownika
   - ✅ Rzucanie błędu gdy nie istnieje lub nie należy do użytkownika

#### 3.2. Serwisy - Generowanie AI

**Plik:** `src/lib/services/openai.service.test.ts`

**Funkcjonalności do przetestowania:**

1. **Klasa `OpenAIService` - Konstruktor**
   - ✅ Walidacja zmiennych środowiskowych (`OPENAI_API_KEY` - wymagane, niepuste)
   - ✅ Walidacja zmiennych środowiskowych (`OPENAI_URL` - wymagane, niepuste)
   - ✅ Walidacja formatu endpointu (musi używać HTTPS)
   - ✅ Inicjalizacja konfiguracji z domyślnym systemMessage
   - ✅ Rzucanie błędu gdy brak klucza API
   - ✅ Rzucanie błędu gdy brak endpointu
   - ✅ Rzucanie błędu gdy endpoint nie używa HTTPS

2. **`sendRequest()`**
   - ✅ Walidacja pustego komunikatu (rzuca błąd)
   - ✅ Sanityzacja danych wejściowych (trim, limit długości do 10000)
   - ✅ Budowanie poprawnego payloadu
   - ✅ Wysyłanie żądania z poprawnymi headers (`api-key`)
   - ✅ Obsługa błędów HTTP 401 (autoryzacja)
   - ✅ Obsługa błędów HTTP 403 (forbidden)
   - ✅ Obsługa błędów HTTP 429 (rate limit)
   - ✅ Obsługa błędów HTTP 503 (service unavailable)
   - ✅ Obsługa błędów sieciowych (network error)
   - ✅ Walidacja struktury odpowiedzi (musi zawierać `choices` array)
   - ✅ Parsowanie odpowiedzi JSON
   - ✅ Obsługa błędów parsowania JSON

3. **`parseResponse()`**
   - ✅ Walidacja obecności `function_call` w odpowiedzi
   - ✅ Parsowanie JSON z `function_call.arguments`
   - ✅ Walidacja schematem Zod (musi zawierać `flashcards` array)
   - ✅ Walidacja każdej fiszki (front: 1-200 znaków, back: 1-500 znaków)
   - ✅ Rzucanie błędu gdy brak `function_call`
   - ✅ Rzucanie błędu gdy nieprawidłowy JSON w `arguments`
   - ✅ Rzucanie błędu gdy odpowiedź nie pasuje do schematu
   - ✅ Rzucanie błędu gdy pusta odpowiedź

4. **`_buildPayload()` (prywatna metoda)**
   - ✅ Budowanie payloadu z funkcją `generate_flashcards`
   - ✅ Formatowanie komunikatu użytkownika z instrukcją
   - ✅ Dodawanie systemMessage do payloadu
   - ✅ Ustawienie `function_call: { name: "generate_flashcards" }`

5. **`_handleError()` (prywatna metoda)**
   - ✅ Logowanie błędów (bez wrażliwych danych)
   - ✅ Klasyfikacja typów błędów
   - ✅ Obsługa błędów autoryzacji (401, 403)
   - ✅ Obsługa błędów sieciowych

6. **Funkcja `generateFlashcards()`**
   - ✅ Tworzenie instancji `OpenAIService`
   - ✅ Wywołanie `sendRequest()`
   - ✅ Wywołanie `parseResponse()`
   - ✅ Mapowanie odpowiedzi na `FlashcardProposal[]`
   - ✅ Mapowanie błędów na odpowiednie kody HTTP
   - ✅ Mapowanie 401/403 na `AUTHENTICATION_ERROR`
   - ✅ Mapowanie 429 na `RATE_LIMIT_EXCEEDED`
   - ✅ Mapowanie 503/network na `SERVICE_UNAVAILABLE`
   - ✅ Obsługa nieoczekiwanych błędów

#### 3.3. Serwisy - Generacje

**Plik:** `src/lib/services/generations.service.test.ts`

**Funkcjonalności do przetestowania:**

1. **`createGeneration()`**
   - ✅ Obliczanie hash tekstu źródłowego (SHA-256)
   - ✅ Obliczanie długości tekstu źródłowego
   - ✅ Pomiar czasu generowania (start/end)
   - ✅ Wywołanie `generateFlashcards()` z AI service
   - ✅ Zapis do bazy danych z metadanymi (`generated_count`, `source_text_hash`, `source_text_length`, `generation_duration`)
   - ✅ Inicjalizacja statystyk (`accepted_unedited_count: 0`, `accepted_edited_count: 0`)
   - ✅ Zwracanie propozycji z metadanymi (`generation_id`, `proposals`, `source_text_hash`, `source_text_length`, `generation_duration`, `created_at`)
   - ✅ Obsługa błędów zapisu do bazy danych
   - ✅ Obsługa błędów AI service

2. **`getGenerations()`**
   - ✅ Paginacja (obliczanie offsetu)
   - ✅ Sortowanie po `created_at` (asc/desc)
   - ✅ Filtrowanie po `user_id` (ownership)
   - ✅ Obliczanie `total_pages`
   - ✅ Zwracanie poprawnej struktury odpowiedzi z paginacją
   - ✅ Obsługa błędów bazy danych

3. **`getGenerationById()`**
   - ✅ Pobieranie generacji po ID
   - ✅ Weryfikacja ownership (generacja należy do użytkownika)
   - ✅ Pobieranie powiązanych fiszek (tylko `ai-full` i `ai-edited`)
   - ✅ Sortowanie fiszek po `created_at` (ascending)
   - ✅ Zwracanie `null` gdy generacja nie istnieje
   - ✅ Zwracanie `null` gdy generacja należy do innego użytkownika
   - ✅ Obsługa błędów bazy danych

4. **`logGenerationError()`**
   - ✅ Zapis błędu do `generation_error_logs`
   - ✅ Zapis wszystkich wymaganych pól (`user_id`, `source_text_hash`, `source_text_length`, `error_code`, `error_message`)
   - ✅ Nie przerywanie głównego przepływu przy błędzie logowania
   - ✅ Logowanie błędów do console (fallback)

#### 3.4. Serwisy - Statystyki

**Plik:** `src/lib/services/statistics.service.test.ts`

**Funkcjonalności do przetestowania:**

1. **`getUserStatistics()`**
   - ✅ Zliczanie fiszek według typu (`manual`, `ai-full`, `ai-edited`)
   - ✅ Obliczanie całkowitej liczby fiszek
   - ✅ Agregacja statystyk generacji (SUM `generated_count`, `accepted_unedited_count`, `accepted_edited_count`)
   - ✅ Obliczanie `total_sessions` (COUNT generacji)
   - ✅ Obliczanie `total_generated` (SUM `generated_count`)
   - ✅ Obliczanie `total_accepted` (SUM `accepted_unedited_count + accepted_edited_count`)
   - ✅ Obliczanie `acceptance_rate` (zabezpieczenie przed dzieleniem przez 0)
   - ✅ Obliczanie `edit_rate` (zabezpieczenie przed dzieleniem przez 0)
   - ✅ Zaokrąglanie do 2 miejsc po przecinku (Math.round(\* 100) / 100)
   - ✅ Zwracanie poprawnej struktury `UserStatisticsDTO`
   - ✅ Obsługa pustych danych (0 fiszek, 0 generacji)
   - ✅ Obsługa błędów bazy danych

### Priorytet 2 (Ważne) - Implementacja w drugiej kolejności

#### 3.5. Serwisy - Logi Błędów

**Plik:** `src/lib/services/generation-errors.service.test.ts`

**Funkcjonalności do przetestowania:**

1. **`getErrors()`**
   - ✅ Paginacja (obliczanie offsetu)
   - ✅ Filtrowanie po `error_code` (opcjonalne)
   - ✅ Sortowanie po `created_at DESC` (najnowsze najpierw)
   - ✅ Filtrowanie po `user_id` (ownership)
   - ✅ Obliczanie `total_pages`
   - ✅ Zwracanie poprawnej struktury odpowiedzi z paginacją
   - ✅ Obsługa błędów bazy danych

#### 3.6. Schematy Walidacji - Flashcard

**Plik:** `src/lib/schemas/flashcard.schema.test.ts`

**Funkcjonalności do przetestowania:**

1. **`FlashcardInputSchema`**
   - ✅ Walidacja `front` - wymagane pole
   - ✅ Walidacja `front` - minimum 1 znak
   - ✅ Walidacja `front` - maksimum 200 znaków
   - ✅ Walidacja `front` - trim białych znaków
   - ✅ Walidacja `front` - nie może składać się tylko z białych znaków
   - ✅ Walidacja `back` - wymagane pole
   - ✅ Walidacja `back` - minimum 1 znak
   - ✅ Walidacja `back` - maksimum 500 znaków
   - ✅ Walidacja `back` - trim białych znaków
   - ✅ Walidacja `back` - nie może składać się tylko z białych znaków
   - ✅ Walidacja `source` - wymagane pole
   - ✅ Walidacja `source` - enum (`manual`, `ai-full`, `ai-edited`)
   - ✅ Walidacja `generation_id` - opcjonalne pole
   - ✅ Walidacja `generation_id` - musi być liczbą całkowitą dodatnią
   - ✅ Refine: `manual` NIE MOŻE mieć `generation_id`
   - ✅ Refine: `ai-full` MUSI mieć `generation_id`
   - ✅ Refine: `ai-edited` MUSI mieć `generation_id`
   - ✅ Komunikaty błędów walidacji

2. **`BulkFlashcardsSchema`**
   - ✅ Walidacja `flashcards` - wymagane pole
   - ✅ Walidacja `flashcards` - musi być tablicą
   - ✅ Walidacja `flashcards` - minimum 1 element
   - ✅ Walidacja `flashcards` - maksimum 100 elementów
   - ✅ Każdy element musi spełniać `FlashcardInputSchema`

3. **`CreateFlashcardSchema` (union)**
   - ✅ Akceptuje pojedynczy `FlashcardInput`
   - ✅ Akceptuje `BulkFlashcardsInput`
   - ✅ Type guard `isBulkInput()` - poprawnie rozpoznaje bulk vs single

4. **`UpdateFlashcardSchema`**
   - ✅ `front` - opcjonalne pole
   - ✅ `back` - opcjonalne pole
   - ✅ Walidacja `front` - jeśli podane, 1-200 znaków, trim
   - ✅ Walidacja `back` - jeśli podane, 1-500 znaków, trim
   - ✅ Refine: przynajmniej jedno pole (`front` lub `back`) musi być podane
   - ✅ Komunikaty błędów walidacji

5. **`BulkDeleteFlashcardsSchema`**
   - ✅ Walidacja `flashcard_ids` - wymagane pole
   - ✅ Walidacja `flashcard_ids` - musi być tablicą liczb
   - ✅ Walidacja `flashcard_ids` - minimum 1 element
   - ✅ Walidacja `flashcard_ids` - maksimum 100 elementów
   - ✅ Każdy element musi być liczbą całkowitą dodatnią

#### 3.7. Schematy Walidacji - Generation

**Plik:** `src/lib/schemas/generation.schema.test.ts`

**Funkcjonalności do przetestowania:**

1. **`GenerateFlashcardsSchema`**
   - ✅ Walidacja `source_text` - wymagane pole
   - ✅ Walidacja `source_text` - minimum 1000 znaków
   - ✅ Walidacja `source_text` - maksimum 10000 znaków
   - ✅ Walidacja `source_text` - trim białych znaków
   - ✅ Refine: po trim musi mieć minimum 1000 znaków
   - ✅ Refine: nie może składać się tylko z białych znaków
   - ✅ Komunikaty błędów walidacji

2. **`GetGenerationsQuerySchema`**
   - ✅ Walidacja `page` - domyślnie "1"
   - ✅ Walidacja `page` - musi być liczbą (string z regex)
   - ✅ Transform: `Math.max(1, parseInt(val))` - minimum 1
   - ✅ Walidacja `limit` - domyślnie "20"
   - ✅ Walidacja `limit` - musi być liczbą (string z regex)
   - ✅ Transform: `Math.min(50, Math.max(1, parseInt(val)))` - zakres 1-50
   - ✅ Walidacja `sort_order` - domyślnie "desc"
   - ✅ Walidacja `sort_order` - enum ("asc", "desc")

#### 3.8. Narzędzia - Hash

**Plik:** `src/lib/utils/hash.test.ts`

**Funkcjonalności do przetestowania:**

1. **`calculateHash()`**
   - ✅ Obliczanie SHA-256 hash dla tekstu
   - ✅ Zwracanie hash w formacie hex
   - ✅ Różne hash dla różnych tekstów
   - ✅ Identyczny hash dla tego samego tekstu
   - ✅ Obsługa różnych długości tekstu (krótki, średni, długi)
   - ✅ Obsługa tekstu z polskimi znakami
   - ✅ Obsługa tekstu ze znakami specjalnymi
   - ✅ Obsługa pustego stringa (jeśli dozwolone)

### Priorytet 3 (Wspierające) - Implementacja w trzeciej kolejności

#### 3.9. Hooks React - useFlashcards

**Plik:** `src/hooks/useFlashcards.test.ts`

**Funkcjonalności do przetestowania:**

1. **Zarządzanie stanem**
   - ✅ Inicjalizacja stanu (items: [], loading: true, error: null)
   - ✅ Aktualizacja stanu po pobraniu danych
   - ✅ Aktualizacja stanu loading podczas fetch
   - ✅ Aktualizacja stanu error przy błędzie

2. **`buildQueryString()`**
   - ✅ Budowanie query params z wszystkich filtrów
   - ✅ Pomijanie opcjonalnych filtrów (type, generation_id) gdy undefined
   - ✅ Poprawne formatowanie parametrów

3. **`fetchFlashcards()`**
   - ✅ Wywołanie API z poprawnym query string
   - ✅ Parsowanie odpowiedzi JSON
   - ✅ Aktualizacja items i totalPages
   - ✅ Obsługa błędu (ustawienie error)
   - ✅ Redirect do `/auth/login` przy 401
   - ✅ Obsługa innych kodów błędów HTTP

4. **`deleteFlashcard()`**
   - ✅ Wywołanie DELETE API
   - ✅ Odświeżanie listy po usunięciu
   - ✅ Obsługa błędów (401 redirect, inne błędy)

5. **`updateFlashcard()`**
   - ✅ Wywołanie PATCH API
   - ✅ Odświeżanie listy po aktualizacji
   - ✅ Obsługa błędów (401 redirect, 404, inne błędy)

6. **`fetchPage()`**
   - ✅ Aktualizacja filtru `page`
   - ✅ Wywołanie `fetchFlashcards` z nową stroną

7. **`refetch()`**
   - ✅ Ponowne pobranie danych z aktualnymi filtrami

8. **`useEffect`**
   - ✅ Automatyczne pobieranie przy zmianie filtrów
   - ✅ Unikanie nieskończonych pętli

#### 3.10. Hooks React - useAddFlashcard

**Plik:** `src/hooks/useAddFlashcard.test.ts`

**Funkcjonalności do przetestowania:**

1. **Zarządzanie stanem**
   - ✅ Inicjalizacja `loading: false`

2. **`submit()`**
   - ✅ Trim danych wejściowych (`front`, `back`)
   - ✅ Formatowanie command dla bulk API (`flashcards: [command]`)
   - ✅ Wywołanie POST `/api/flashcards`
   - ✅ Ustawienie `loading: true` podczas requestu
   - ✅ Ustawienie `loading: false` po zakończeniu
   - ✅ Redirect do `/auth/login` przy 401
   - ✅ Obsługa błędów (ustawienie error message)

#### 3.11. Hooks React - useDashboard

**Plik:** `src/hooks/useDashboard.test.ts`

**Funkcjonalności do przetestowania:**

1. **Pobieranie statystyk**
   - ✅ Wywołanie GET `/api/users/me/statistics`
   - ✅ Parsowanie odpowiedzi
   - ✅ Formatowanie danych dla UI
   - ✅ Obsługa błędów

2. **Pobieranie historii generacji**
   - ✅ Wywołanie GET `/api/generations`
   - ✅ Parsowanie odpowiedzi
   - ✅ Formatowanie danych dla UI
   - ✅ Obsługa błędów

#### 3.12. Hooks React - useProfile

**Plik:** `src/hooks/useProfile.test.ts`

**Funkcjonalności do przetestowania:**

1. **Pobieranie danych profilu**
   - ✅ Wywołanie GET `/api/users/me`
   - ✅ Parsowanie odpowiedzi
   - ✅ Obsługa błędów

2. **Aktualizacja profilu**
   - ✅ Wywołanie PATCH `/api/users/me`
   - ✅ Aktualizacja stanu po sukcesie
   - ✅ Obsługa błędów

3. **Usuwanie konta**
   - ✅ Wywołanie DELETE `/api/users/me`
   - ✅ Redirect po usunięciu
   - ✅ Obsługa błędów

#### 3.13. Hooks React - useAdmin

**Plik:** `src/hooks/useAdmin.test.ts`

**Funkcjonalności do przetestowania:**

1. **Pobieranie logów błędów**
   - ✅ Wywołanie GET `/api/generation-errors`
   - ✅ Parsowanie odpowiedzi z paginacją
   - ✅ Filtrowanie po `error_code`
   - ✅ Obsługa błędów

2. **Pobieranie listy użytkowników**
   - ✅ Wywołanie GET `/api/users`
   - ✅ Parsowanie odpowiedzi z paginacją
   - ✅ Filtrowanie i sortowanie
   - ✅ Obsługa błędów

3. **Zmiana roli użytkownika**
   - ✅ Wywołanie PATCH `/api/users/{id}`
   - ✅ Aktualizacja stanu po sukcesie
   - ✅ Obsługa błędów

## 4. Struktura Plików Testowych

```
src/
├── lib/
│   ├── services/
│   │   ├── flashcards.service.test.ts
│   │   ├── openai.service.test.ts
│   │   ├── generations.service.test.ts
│   │   ├── statistics.service.test.ts
│   │   └── generation-errors.service.test.ts
│   ├── schemas/
│   │   ├── flashcard.schema.test.ts
│   │   └── generation.schema.test.ts
│   └── utils/
│       └── hash.test.ts
├── hooks/
│   ├── useFlashcards.test.ts
│   ├── useAddFlashcard.test.ts
│   ├── useDashboard.test.ts
│   ├── useProfile.test.ts
│   └── useAdmin.test.ts
└── components/
    └── [komponenty do testowania w przyszłości]
```

## 5. Strategia Mockowania

### 5.1. Mockowanie Supabase Client

Dla testów serwisów używamy mocków Supabase Client:

```typescript
const mockSupabase = {
  from: vi.fn().mockReturnValue({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
    single: vi.fn(),
  }),
} as unknown as SupabaseClient;
```

### 5.2. Mockowanie Fetch API

Dla testów hooks używamy MSW (Mock Service Worker) lub `vi.spyOn(global, 'fetch')`.

### 5.3. Mockowanie Zmiennych Środowiskowych

Dla testów `openai.service.ts` używamy `vi.stubEnv()`:

```typescript
vi.stubEnv("OPENAI_API_KEY", "test-key");
vi.stubEnv("OPENAI_URL", "https://test-endpoint.com");
```

## 6. Wzorce Testowania

### 6.1. Struktura Testu

Każdy test powinien mieć strukturę:

- **Arrange** - przygotowanie danych i mocków
- **Act** - wykonanie testowanej funkcji
- **Assert** - weryfikacja wyników

### 6.2. Nazewnictwo Testów

Format: `should [oczekiwane zachowanie] when [warunki]`

Przykłady:

- `should return flashcards with pagination when valid params provided`
- `should throw error when generation_id does not belong to user`
- `should update statistics when creating ai-full flashcard`

### 6.3. Pokrycie Testami

Cel: **≥80% pokrycia kodu** dla serwisów i schematów walidacji.

## 7. Harmonogram Implementacji

### Faza 1: Priorytet 1 (Tydzień 1-2)

- [ ] `flashcards.service.test.ts` - wszystkie funkcje
- [ ] `openai.service.test.ts` - wszystkie funkcje
- [ ] `generations.service.test.ts` - wszystkie funkcje
- [ ] `statistics.service.test.ts` - wszystkie funkcje

### Faza 2: Priorytet 2 (Tydzień 2-3)

- [ ] `generation-errors.service.test.ts`
- [ ] `flashcard.schema.test.ts` - wszystkie schematy
- [ ] `generation.schema.test.ts` - wszystkie schematy
- [ ] `hash.test.ts`

### Faza 3: Priorytet 3 (Tydzień 3-4)

- [ ] `useFlashcards.test.ts`
- [ ] `useAddFlashcard.test.ts`
- [ ] `useDashboard.test.ts`
- [ ] `useProfile.test.ts`
- [ ] `useAdmin.test.ts`

## 8. Kryteria Akceptacji

### 8.1. Funkcjonalne

- ✅ Wszystkie testy z Priorytetu 1 przechodzą
- ✅ Wszystkie testy z Priorytetu 2 przechodzą
- ✅ Pokrycie kodu ≥80% dla serwisów i schematów
- ✅ Brak false positives (testy nie przechodzą gdy powinny)

### 8.2. Jakościowe

- ✅ Testy są czytelne i łatwe do zrozumienia
- ✅ Testy są niezależne (nie zależą od kolejności wykonania)
- ✅ Testy są szybkie (wykonanie <5 sekund dla całej suity)
- ✅ Mocki są poprawnie skonfigurowane
- ✅ Edge cases są pokryte testami

### 8.3. Techniczne

- ✅ Wszystkie testy używają Vitest
- ✅ Testy komponentów używają React Testing Library
- ✅ Mocki używają `vi.fn()` i `vi.mock()`
- ✅ Testy są uruchamiane w CI/CD

## 9. Uwagi Implementacyjne

### 9.1. Testowanie Asynchronicznych Funkcji

Używamy `async/await` w testach:

```typescript
it("should fetch flashcards", async () => {
  const result = await getFlashcards(mockSupabase, userId, params);
  expect(result.flashcards).toHaveLength(2);
});
```

### 9.2. Testowanie Błędów

Używamy `rejects.toThrow()`:

```typescript
it("should throw error when flashcard not found", async () => {
  await expect(getFlashcardById(mockSupabase, userId, 999)).rejects.toThrow("Fiszka nie istnieje");
});
```

### 9.3. Testowanie Weryfikacji Ownership

Wszystkie testy muszą weryfikować, że funkcje sprawdzają ownership:

- Fiszki należą do użytkownika
- Generacje należą do użytkownika
- Logi błędów należą do użytkownika

### 9.4. Testowanie Edge Cases

Szczególna uwaga na:

- Puste tablice
- Null/undefined values
- Dzielenie przez zero w statystykach
- Maksymalne wartości (200 znaków front, 500 znaków back)
- Minimalne wartości (1 znak)

## 10. Przykładowe Testy

### 10.1. Przykład Testu Serwisu

```typescript
describe("getFlashcards", () => {
  it("should fetch flashcards with pagination", async () => {
    // Arrange
    const mockData = [
      { id: 1, front: "Q1", back: "A1", user_id: "user-123" },
      { id: 2, front: "Q2", back: "A2", user_id: "user-123" },
    ];
    const mockQuery = {
      eq: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      range: vi.fn().mockResolvedValue({
        data: mockData,
        error: null,
        count: 2,
      }),
    };
    vi.mocked(mockSupabase.from).mockReturnValue(mockQuery as any);

    // Act
    const result = await getFlashcards(mockSupabase, "user-123", {
      page: 1,
      limit: 10,
      sort_by: "created_at",
      sort_order: "desc",
    });

    // Assert
    expect(result.flashcards).toEqual(mockData);
    expect(result.total).toBe(2);
    expect(mockQuery.eq).toHaveBeenCalledWith("user_id", "user-123");
    expect(mockQuery.range).toHaveBeenCalledWith(0, 9);
  });
});
```

### 10.2. Przykład Testu Schematu

```typescript
describe("FlashcardInputSchema", () => {
  it("should validate front length (max 200 chars)", () => {
    const longFront = "a".repeat(201);
    const result = FlashcardInputSchema.safeParse({
      front: longFront,
      back: "Answer",
      source: "manual",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("200 znaków");
    }
  });
});
```

## 11. Następne Kroki

Po zaimplementowaniu testów jednostkowych:

1. Uruchomienie testów w CI/CD
2. Monitorowanie pokrycia kodu
3. Dodanie testów integracyjnych (API endpoints)
4. Dodanie testów E2E (Playwright)

---

**Wersja dokumentu:** 1.0  
**Data utworzenia:** 2025-01-XX  
**Ostatnia aktualizacja:** 2025-01-XX  
**Autor:** Zespół 10x-cards
