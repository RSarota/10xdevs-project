# API Endpoint Implementation Plan: Get Single Generation

## 1. Przegląd punktu końcowego

Endpoint GET /api/generations/{id} umożliwia pobranie szczegółów pojedynczej sesji generowania wraz z listą zaakceptowanych fiszek powiązanych z tą sesją.

## 2. Szczegóły żądania

- **Metoda HTTP:** GET
- **Struktura URL:** `/api/generations/{id}`
- **Parametry:**
  - **Wymagane:**
    - `id` (path parameter) – identyfikator sesji generowania (number)
  - **Opcjonalne:** Brak
- **Nagłówki:**
  - `Authorization: Bearer {token}` (w developmencie: używamy DEFAULT_USER_ID)

## 3. Wykorzystywane typy

- **GenerationDTO:** Reprezentuje rekord z tabeli `generations` (zdefiniowany w `src/types.ts`)
- **FlashcardDTO:** Reprezentuje fiszki powiązane z generacją (uproszczona forma w odpowiedzi)

## 4. Szczegóły odpowiedzi

- **200 OK:**

```json
{
  "id": "number",
  "user_id": "uuid",
  "generated_count": "number",
  "accepted_unedited_count": "number",
  "accepted_edited_count": "number",
  "source_text_hash": "string",
  "source_text_length": "number",
  "generation_duration": "number",
  "created_at": "timestamp",
  "updated_at": "timestamp",
  "flashcards": [
    {
      "id": "number",
      "type": "ai-full | ai-edited",
      "front": "string",
      "back": "string",
      "created_at": "timestamp"
    }
  ]
}
```

- **400 Bad Request:** Nieprawidłowy format `id`
- **401 Unauthorized:** Brak lub nieprawidłowy token
- **404 Not Found:** Generation nie istnieje lub nie należy do użytkownika
- **500 Internal Server Error:** Błąd serwera

## 5. Przepływ danych

1. Klient wysyła żądanie GET do `/api/generations/{id}`
2. Serwer weryfikuje token i identyfikuje użytkownika (w developmencie: DEFAULT_USER_ID)
3. Parametr `id` jest walidowany przy użyciu Zod (pozytywna liczba całkowita)
4. Logika delegowana do `generationsService.getGenerationById(userId, generationId)`
5. Serwis:
   - Pobiera generation z bazy danych: `SELECT * FROM generations WHERE id = ? AND user_id = ?`
   - Jeśli nie znaleziono, zwrócić 404
   - Pobiera powiązane fiszki: `SELECT id, type, front, back, created_at FROM flashcards WHERE generation_id = ? ORDER BY created_at ASC`
6. Łączy dane generation z listą flashcards
7. Zwraca kompletny obiekt z kodem 200

## 6. Względy bezpieczeństwa

- **Uwierzytelnienie:** Wymagane sprawdzenie tokena w nagłówku `Authorization` (w produkcji)
- **Autoryzacja:** Weryfikacja, że generation należy do uwierzytelnionego użytkownika
- **Walidacja:** Sprawdzenie, że `id` jest poprawną liczbą dodatnią
- **RLS:** W produkcji Row Level Security zapewni dodatkową warstwę bezpieczeństwa
- **Data exposure:** Nie ujawniamy `user_id` fiszek w odpowiedzi (można usunąć z uproszczonej formy)

## 7. Obsługa błędów

- **400 Bad Request:**
  - Nieprawidłowy format `id` (tekst zamiast liczby, liczba ujemna)
- **404 Not Found:**
  - Generation o podanym `id` nie istnieje
  - Generation nie należy do użytkownika
- **401 Unauthorized:** Brak lub nieprawidłowy token (w produkcji)
- **500 Internal Server Error:** Błąd w serwerze lub w logice biznesowej

## 8. Rozważania dotyczące wydajności

- **Dwa zapytania:** Jedno dla generation, jedno dla flashcards
- **Opcjonalnie JOIN:** Można użyć LEFT JOIN, ale to może być mniej efektywne jeśli jest wiele fiszek
- **Indeksy:** Wykorzystanie PRIMARY KEY na `id`, indeksu na `user_id` i `generation_id`
- **Limit flashcards:** Rozważyć limit liczby zwracanych fiszek (np. 100) lub paginację w przyszłości
- **Sortowanie:** Fiszki sortowane po `created_at` ASC (chronologicznie)

## 9. Etapy wdrożenia

1. **Utworzenie pliku endpointa:**
   - Utworzyć plik w `src/pages/api/generations/[id].ts`
2. **Walidacja i autoryzacja:**
   - Skonfigurować sprawdzanie tokena (lub użycie DEFAULT_USER_ID w developmencie)
   - Walidacja parametru `id` przy użyciu Zod (pozytywna liczba całkowita)
3. **Implementacja logiki biznesowej:**
   - Dodać metodę `getGenerationById(userId, generationId)` w `generationsService`
   - Metoda zwraca `Promise<GenerationWithFlashcardsDTO | null>`
4. **Interakcja z bazą danych:**
   - Query 1: `SELECT * FROM generations WHERE id = ? AND user_id = ?`
   - Jeśli nie znaleziono, zwrócić null (404 w endpoincie)
   - Query 2: `SELECT id, type, front, back, created_at FROM flashcards WHERE generation_id = ? ORDER BY created_at ASC`
   - Połączyć wyniki: `{ ...generation, flashcards: [...] }`
5. **Obsługa błędów:**
   - Implementacja try-catch z odpowiednimi kodami statusu
   - Logowanie błędów
   - Zwracanie user-friendly error messages
6. **Opcjonalna optymalizacja:**
   - Rozważyć użycie window functions lub subquery w jednym zapytaniu
   - Przykład: `SELECT g.*, jsonb_agg(f.*) as flashcards FROM generations g LEFT JOIN flashcards f ON f.generation_id = g.id WHERE g.id = ? AND g.user_id = ? GROUP BY g.id`
7. **Dokumentacja:**
   - Zaktualizować DEV-NOTES.md
   - Dodać komentarz o sortowaniu fiszek
