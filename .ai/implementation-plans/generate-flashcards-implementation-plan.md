# API Endpoint Implementation Plan: Generate Flashcards

## 1. Przegląd punktu końcowego

Endpoint POST /api/generations umożliwia wygenerowanie propozycji fiszek z tekstu źródłowego przy użyciu AI. Endpoint tworzy rekord w tabeli `generations`, wywołuje Azure OpenAI API przez Azure API Management, i zwraca propozycje (nie zapisuje ich jeszcze jako fiszki).

## 2. Szczegóły żądania

- **Metoda HTTP:** POST
- **Struktura URL:** `/api/generations`
- **Parametry:**
  - **Wymagane:** Brak parametrów URL
  - **Opcjonalne:** Brak
- **Nagłówki:**
  - `Authorization: Bearer {token}` (w developmencie: używamy DEFAULT_USER_ID)
  - `Content-Type: application/json`
- **Request Body:**

```json
{
  "source_text": "string (required, min 1000 chars, max 10000 chars)"
}
```

## 3. Wykorzystywane typy

- **GenerateFlashcardsCommand:** Model Command dla generowania fiszek (zdefiniowany w `src/types.ts`)
- **GenerationDTO:** Reprezentuje rekord z tabeli `generations`
- **GenerationErrorDTO:** Dla logowania błędów w tabeli `generation_error_logs`

## 4. Szczegóły odpowiedzi

- **201 Created:**

```json
{
  "generation_id": "number",
  "proposals": [
    {
      "front": "string",
      "back": "string"
    }
  ],
  "source_text_hash": "string",
  "source_text_length": "number",
  "generation_duration": "number (milliseconds)",
  "created_at": "timestamp"
}
```

**Uwaga:** Propozycje są zwracane w kolejności wygenerowanej przez AI. Klient może śledzić je lokalnie (np. po indeksie w tablicy).

- **400 Bad Request:** Tekst źródłowy poza zakresem 1000-10000 znaków
- **401 Unauthorized:** Brak lub nieprawidłowy token
- **429 Too Many Requests:** Przekroczony rate limit
- **503 Service Unavailable:** AI service tymczasowo niedostępny
- **500 Internal Server Error:** Błąd serwera

## 5. Przepływ danych

1. Klient wysyła żądanie POST z `source_text`
2. Serwer weryfikuje token i identyfikuje użytkownika (w developmencie: DEFAULT_USER_ID)
3. Request body jest walidowany przy użyciu Zod zgodnie z `GenerateFlashcardsCommand`
4. **Walidacja biznesowa:**
   - `source_text` ma długość 1000-10000 znaków
   - `source_text` nie składa się tylko z białych znaków
5. Obliczenie metadanych:
   - `source_text_hash` = SHA-256 hash tekstu źródłowego
   - `source_text_length` = długość w znakach
   - Rozpoczęcie pomiaru czasu (dla `generation_duration`)
6. **Wywołanie AI API:**
   - Wysłanie żądania do Azure OpenAI Service przez Azure API Management
   - Nagłówek: `x-api-key: {API_KEY}` (z zmiennej środowiskowej)
   - Timeout: 30 sekund
   - Parsowanie odpowiedzi JSON
7. **W przypadku sukcesu:**
   - Zatrzymanie pomiaru czasu
   - Utworzenie rekordu w tabeli `generations` z:
     - `user_id`
     - `generated_count` = liczba propozycji
     - `source_text_hash`, `source_text_length`, `generation_duration`
     - `accepted_unedited_count` = 0, `accepted_edited_count` = 0
   - Zwrócenie odpowiedzi 201 z propozycjami
8. **W przypadku błędu:**
   - Logowanie błędu do tabeli `generation_error_logs`
   - Zwrócenie odpowiedniego kodu błędu (429, 503, 500)

## 6. Względy bezpieczeństwa

- **Uwierzytelnienie:** Wymagane sprawdzenie tokena w nagłówku `Authorization` (w produkcji)
- **Walidacja danych wejściowych:**
  - Ścisła walidacja długości tekstu (1000-10000 znaków)
  - Sanitizacja tekstu źródłowego przed wysłaniem do AI
  - Zapobieganie prompt injection
- **Rate Limiting:**
  - Azure API Management zapewnia rate limiting
  - Opcjonalnie: dodatkowy rate limiting na poziomie aplikacji (np. max 10 generacji/godzinę per user)
- **API Key Security:**
  - Klucz API przechowywany w zmiennych środowiskowych
  - Nigdy nie expose'ować klucza w odpowiedziach
- **Error Messages:** Nie ujawniać szczegółów błędów AI API klientowi

## 7. Obsługa błędów

- **400 Bad Request:**
  - `source_text` poniżej 1000 znaków
  - `source_text` powyżej 10000 znaków
  - `source_text` składa się tylko z białych znaków
  - Brak pola `source_text`
- **401 Unauthorized:** Brak lub nieprawidłowy token (w produkcji)
- **429 Too Many Requests:**
  - Przekroczony rate limit Azure API Management
  - Przekroczony rate limit aplikacji (jeśli zaimplementowany)
- **503 Service Unavailable:**
  - Azure OpenAI Service niedostępny
  - Timeout połączenia (> 30s)
- **500 Internal Server Error:**
  - Nieprawidłowa odpowiedź z AI (błąd parsowania)
  - Błąd zapisu do bazy danych
  - Inne nieoczekiwane błędy

**Logowanie błędów:**

- Wszystkie błędy związane z AI API logowane do `generation_error_logs`:
  - `error_code`: np. "API_TIMEOUT", "INVALID_RESPONSE", "RATE_LIMIT_EXCEEDED"
  - `error_message`: szczegółowy komunikat
  - `source_text_hash`, `source_text_length`

## 8. Rozważania dotyczące wydajności

- **Timeout:** Ustawienie odpowiedniego timeoutu (30s) dla wywołania AI API
- **Async Processing:** Operacja jest synchroniczna, ale można rozważyć async/background processing w przyszłości
- **Caching (opcjonalnie):** Cache wyników dla identycznych `source_text_hash` (oszczędność kosztów AI)
- **Indeksy:** Indeks na `source_text_hash` w tabeli `generations` dla szybkiego wyszukiwania duplikatów
- **Retry Logic:** Opcjonalne retry z exponential backoff dla przejściowych błędów (503)

## 9. Etapy wdrożenia

1. **Utworzenie pliku endpointa:**
   - Utworzyć plik w `src/pages/api/generations.ts` (obsłuży GET i POST)
2. **Utworzenie schematu walidacji Zod:**
   - Schema waliduje `GenerateFlashcardsCommand`
   - Walidacja: `source_text` jest string, min 1000, max 10000 znaków
   - Custom walidacja: tekst nie składa się tylko z białych znaków
3. **Implementacja funkcji pomocniczych:**
   - `calculateHash(text: string): string` - SHA-256 hash tekstu źródłowego
4. **Utworzenie serwisu AI:**
   - Utworzyć `src/lib/services/ai.service.ts`
   - Metoda `generateFlashcards(sourceText: string): Promise<Proposal[]>`
   - Konfiguracja Azure OpenAI API client
   - Obsługa timeoutów i błędów
5. **Implementacja logiki biznesowej:**
   - Utworzyć `src/lib/services/generations.service.ts`
   - Metoda `createGeneration(userId, command): Promise<GenerationResponse>`
   - Wywołanie AI service
   - Zapis do bazy `generations`
   - Zwrócenie propozycji wraz z generation_id
6. **Implementacja logowania błędów:**
   - Metoda `logGenerationError(userId, hash, length, errorCode, errorMessage)` w `generationsService`
   - INSERT do tabeli `generation_error_logs`
7. **Konfiguracja zmiennych środowiskowych:**
   - Dodać do `.env`:
     - `AZURE_OPENAI_API_KEY`
     - `AZURE_OPENAI_ENDPOINT`
     - `AZURE_API_MANAGEMENT_KEY` (x-api-key)
8. **Obsługa błędów:**
   - Try-catch wokół wywołania AI
   - Logowanie wszystkich błędów
   - Mapowanie błędów AI na odpowiednie kody statusu HTTP
9. **Dokumentacja:**
   - Zaktualizować DEV-NOTES.md
   - Dodać komentarze o konfiguracji Azure API
   - Dokumentować format odpowiedzi AI API
