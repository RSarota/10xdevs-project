# API Endpoint Implementation Plan: Get Single Flashcard

## 1. Przegląd punktu końcowego

Endpoint GET /api/flashcards/{id} umożliwia pobranie szczegółów pojedynczej fiszki na podstawie jej identyfikatora. Endpoint weryfikuje, czy fiszka należy do uwierzytelnionego użytkownika.

## 2. Szczegóły żądania

- **Metoda HTTP:** GET
- **Struktura URL:** `/api/flashcards/{id}`
- **Parametry:**
  - **Wymagane:**
    - `id` (path parameter) – identyfikator fiszki (number)
  - **Opcjonalne:** Brak
- **Nagłówki:**
  - `Authorization: Bearer {token}` (w developmencie: używamy DEFAULT_USER_ID)

## 3. Wykorzystywane typy

- **FlashcardDTO:** Reprezentuje rekord z tabeli `flashcards` (zdefiniowany w `src/types.ts`)
- Brak modeli Command, ponieważ endpoint jest typu GET

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

- **401 Unauthorized:** Brak lub nieprawidłowy token autoryzacyjny
- **404 Not Found:** Fiszka nie istnieje lub nie należy do użytkownika
- **500 Internal Server Error:** Błąd serwera

## 5. Przepływ danych

1. Klient wysyła żądanie GET do `/api/flashcards/{id}` wraz z nagłówkiem `Authorization`
2. Serwer weryfikuje token i identyfikuje użytkownika (w developmencie: DEFAULT_USER_ID)
3. Parametr `id` jest walidowany przy użyciu Zod (musi być liczbą dodatnią)
4. Logika biznesowa jest delegowana do serwisu `flashcardsService.getFlashcardById()`
5. Serwis pobiera fiszkę z bazy danych i sprawdza, czy należy do użytkownika
6. Jeśli fiszka istnieje i należy do użytkownika, zwracana jest odpowiedź 200 z danymi
7. Jeśli fiszka nie istnieje lub nie należy do użytkownika, zwracana jest odpowiedź 404

## 6. Względy bezpieczeństwa

- **Uwierzytelnienie:** Wymagane sprawdzenie tokena w nagłówku `Authorization` (w produkcji)
- **Autoryzacja:** Weryfikacja, że fiszka należy do uwierzytelnionego użytkownika
- **Walidacja:** Sprawdzenie, że `id` jest poprawną liczbą dodatnią
- **RLS:** W produkcji Row Level Security zapewni dodatkową warstwę bezpieczeństwa

## 7. Obsługa błędów

- **401 Unauthorized:** Brak lub nieprawidłowy token (w produkcji)
- **400 Bad Request:** Nieprawidłowy format `id` (np. tekst zamiast liczby, liczba ujemna)
- **404 Not Found:** Fiszka o podanym `id` nie istnieje lub nie należy do użytkownika
- **500 Internal Server Error:** Błąd w serwerze lub w logice biznesowej

## 8. Rozważania dotyczące wydajności

- Wykorzystanie indeksu PRIMARY KEY na `id` dla szybkiego wyszukiwania
- Pojedyncze zapytanie do bazy danych bez JOIN (prosta operacja)
- Brak paginacji (pojedynczy rekord)

## 9. Etapy wdrożenia

1. **Utworzenie pliku endpointa:**
   - Utworzyć plik w `src/pages/api/flashcards/[id].ts`
2. **Walidacja i autoryzacja:**
   - Skonfigurować sprawdzanie tokena (lub użycie DEFAULT_USER_ID w developmencie)
   - Walidacja parametru `id` przy użyciu Zod (pozytywna liczba całkowita)
3. **Implementacja logiki biznesowej:**
   - Dodać metodę `getFlashcardById(userId: string, flashcardId: number)` w `src/lib/services/flashcards.service.ts`
   - Metoda powinna zwracać `FlashcardDTO | null`
4. **Interakcja z bazą danych:**
   - Zbudować zapytanie SQL do pobrania rekordu z tabeli `flashcards` WHERE id = ? AND user_id = ?
   - Wykorzystać Supabase client z `context.locals`
5. **Obsługa błędów:**
   - Zaimplementować mechanizmy obsługi błędów i logowania
   - Zwracać odpowiednie kody statusu (400, 404, 500)
6. **Dokumentacja:**
   - Zaktualizować DEV-NOTES.md, zaznaczając endpoint jako zaimplementowany
