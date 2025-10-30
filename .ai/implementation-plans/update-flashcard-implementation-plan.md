# API Endpoint Implementation Plan: Update Flashcard

## 1. Przegląd punktu końcowego
Endpoint PATCH /api/flashcards/{id} umożliwia częściową aktualizację istniejącej fiszki. Użytkownik może zaktualizować pole `front` i/lub `back`. Pole `updated_at` jest automatycznie aktualizowane.

## 2. Szczegóły żądania
- **Metoda HTTP:** PATCH
- **Struktura URL:** `/api/flashcards/{id}`
- **Parametry:** 
  - **Wymagane:** 
    - `id` (path parameter) – identyfikator fiszki (number)
  - **Opcjonalne:** Brak
- **Nagłówki:** 
  - `Authorization: Bearer {token}` (w developmencie: używamy DEFAULT_USER_ID)
  - `Content-Type: application/json`
- **Request Body:**
```json
{
  "front": "string (optional, max 200 chars for manual, TEXT for AI)",
  "back": "string (optional, max 500 chars for manual, TEXT for AI)"
}
```

## 3. Wykorzystywane typy
- **UpdateFlashcardCommand:** Model Command dla aktualizacji fiszki (zdefiniowany w `src/types.ts`)
- **FlashcardDTO:** Reprezentuje rekord z tabeli `flashcards`

## 4. Szczegóły odpowiedzi
- **200 OK:**
```json
{
  "id": "number",
  "user_id": "uuid",
  "generation_id": "number | null",
  "type": "ai-full | ai-edited | manual",
  "front": "string",
  "back": "string",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```
- **400 Bad Request:** Błędy walidacji (limity znaków, brak pól do aktualizacji)
- **401 Unauthorized:** Brak lub nieprawidłowy token
- **404 Not Found:** Fiszka nie istnieje lub nie należy do użytkownika
- **500 Internal Server Error:** Błąd serwera

## 5. Przepływ danych
1. Klient wysyła żądanie PATCH do `/api/flashcards/{id}` z danymi do aktualizacji
2. Serwer weryfikuje token i identyfikuje użytkownika (w developmencie: DEFAULT_USER_ID)
3. Parametr `id` jest walidowany przy użyciu Zod (musi być liczbą dodatnią)
4. Request body jest walidowany przy użyciu Zod zgodnie z `UpdateFlashcardCommand`
5. **Walidacja biznesowa:**
   - Sprawdzenie, czy przynajmniej jedno pole (front lub back) jest podane
   - Sprawdzenie, że pola nie są puste ani nie zawierają tylko białych znaków
6. Logika delegowana do `flashcardsService.updateFlashcard(userId, flashcardId, command)`
7. Serwis:
   - Pobiera istniejącą fiszkę i weryfikuje ownership
   - Sprawdza limity znaków na podstawie typu fiszki (manual vs AI)
   - Wykonuje UPDATE z automatyczną aktualizacją `updated_at`
8. Zwraca zaktualizowaną fiszkę z kodem 200

## 6. Względy bezpieczeństwa
- **Uwierzytelnienie:** Wymagane sprawdzenie tokena w nagłówku `Authorization` (w produkcji)
- **Autoryzacja:** Weryfikacja, że fiszka należy do uwierzytelnionego użytkownika
- **Walidacja danych wejściowych:**
  - Sanitizacja tekstu (front, back) - zapobieganie XSS
  - Sprawdzanie limitów znaków na podstawie typu fiszki
  - Zapobieganie nadpisaniu pól systemowych (id, user_id, type, generation_id, created_at)
- **RLS:** W produkcji Row Level Security zapewni dodatkową warstwę bezpieczeństwa
- **Niezmienność metadanych:** Nie pozwalamy na zmianę type, generation_id, user_id

## 7. Obsługa błędów
- **400 Bad Request:**
  - Nieprawidłowy format `id` (tekst, liczba ujemna)
  - Brak pól do aktualizacji (ani front, ani back)
  - Puste wartości lub tylko białe znaki
  - Przekroczenie limitów znaków:
    - Manual flashcards: front > 200 lub back > 500 znaków
    - AI flashcards: zależnie od założeń (TEXT bez limitu lub określony limit)
- **404 Not Found:** 
  - Fiszka o podanym `id` nie istnieje
  - Fiszka nie należy do użytkownika
- **401 Unauthorized:** Brak lub nieprawidłowy token (w produkcji)
- **500 Internal Server Error:** Błąd bazy danych lub logiki biznesowej

## 8. Rozważania dotyczące wydajności
- **Optymalizacja zapytań:** Jedno zapytanie SELECT (weryfikacja ownership i pobranie typu), jedno UPDATE
- **Indeksy:** Wykorzystanie PRIMARY KEY na `id` i indeksu na `user_id`
- **Walidacja w pamięci:** Najpierw walidacja w pamięci, potem zapytania do bazy
- **Updated_at:** Automatyczna aktualizacja przez trigger bazodanowy lub explicit SET updated_at = NOW()

## 9. Etapy wdrożenia
1. **Utworzenie pliku endpointa:**
   - Utworzyć plik w `src/pages/api/flashcards/[id].ts` (rozszerzenie istniejącego pliku z GET)
2. **Utworzenie schematu walidacji Zod:**
   - Schema waliduje `UpdateFlashcardCommand`
   - Walidacja: przynajmniej jedno pole (front lub back) musi być podane
   - Walidacja: pola nie mogą być puste ani zawierać tylko białych znaków
   - Walidacja parametru `id` (pozytywna liczba całkowita)
3. **Implementacja logiki biznesowej:**
   - Dodać metodę `updateFlashcard(userId: string, flashcardId: number, command: UpdateFlashcardCommand)` w `flashcardsService`
   - Metoda zwraca `Promise<FlashcardDTO>`
4. **Implementacja sprawdzenia ownership i typu:**
   - Pobrać istniejącą fiszkę: SELECT * FROM flashcards WHERE id = ? AND user_id = ?
   - Jeśli nie znaleziono, zwrócić 404
   - Sprawdzić typ fiszki i zastosować odpowiednie limity znaków
5. **Wykonanie UPDATE:**
   - UPDATE flashcards SET front = ?, back = ?, updated_at = NOW() WHERE id = ? AND user_id = ?
   - Zwrócić zaktualizowany rekord
6. **Obsługa błędów:**
   - Implementacja try-catch z odpowiednimi kodami statusu
   - Logowanie błędów
   - Zwracanie user-friendly error messages
8. **Dokumentacja:**
   - Zaktualizować DEV-NOTES.md

