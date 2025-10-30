# API Endpoint Implementation Plan: Delete Flashcard

## 1. Przegląd punktu końcowego
Endpoint DELETE /api/flashcards/{id} umożliwia usunięcie pojedynczej fiszki. Operacja wymaga potwierdzenia ownership i jest nieodwracalna.

## 2. Szczegóły żądania
- **Metoda HTTP:** DELETE
- **Struktura URL:** `/api/flashcards/{id}`
- **Parametry:** 
  - **Wymagane:** 
    - `id` (path parameter) – identyfikator fiszki (number)
  - **Opcjonalne:** Brak
- **Nagłówki:** 
  - `Authorization: Bearer {token}` (w developmencie: używamy DEFAULT_USER_ID)

## 3. Wykorzystywane typy
- **FlashcardDTO:** Tylko do weryfikacji istnienia i ownership (opcjonalnie)
- Brak modeli Command

## 4. Szczegóły odpowiedzi
- **200 OK:**
```json
{
  "message": "Flashcard deleted successfully",
  "id": "number"
}
```
- **400 Bad Request:** Nieprawidłowy format `id`
- **401 Unauthorized:** Brak lub nieprawidłowy token
- **404 Not Found:** Fiszka nie istnieje lub nie należy do użytkownika
- **500 Internal Server Error:** Błąd serwera

## 5. Przepływ danych
1. Klient wysyła żądanie DELETE do `/api/flashcards/{id}`
2. Serwer weryfikuje token i identyfikuje użytkownika (w developmencie: DEFAULT_USER_ID)
3. Parametr `id` jest walidowany przy użyciu Zod (musi być liczbą dodatnią)
4. Logika delegowana do `flashcardsService.deleteFlashcard(userId, flashcardId)`
5. Serwis wykonuje DELETE z warunkiem ownership:
   - `DELETE FROM flashcards WHERE id = ? AND user_id = ?`
6. Sprawdzenie liczby usuniętych rekordów:
   - Jeśli 0 → zwrócić 404 (fiszka nie istnieje lub nie należy do użytkownika)
   - Jeśli 1 → zwrócić 200 z komunikatem sukcesu
7. Zwraca potwierdzenie usunięcia z kodem 200

## 6. Względy bezpieczeństwa
- **Uwierzytelnienie:** Wymagane sprawdzenie tokena w nagłówku `Authorization` (w produkcji)
- **Autoryzacja:** Weryfikacja ownership poprzez warunek `user_id` w DELETE
- **Nieodwracalność:** Operacja DELETE jest permanentna - należy upewnić się, że frontend wymaga potwierdzenia
- **RLS:** W produkcji Row Level Security zapewni dodatkową warstwę bezpieczeństwa
- **Soft delete (opcjonalnie):** W przyszłości można rozważyć soft delete (pole deleted_at) zamiast hard delete

## 7. Obsługa błędów
- **400 Bad Request:**
  - Nieprawidłowy format `id` (tekst, liczba ujemna, 0)
- **404 Not Found:** 
  - Fiszka o podanym `id` nie istnieje
  - Fiszka nie należy do użytkownika (nie ujawniamy różnicy ze względów bezpieczeństwa)
- **401 Unauthorized:** Brak lub nieprawidłowy token (w produkcji)
- **500 Internal Server Error:** Błąd bazy danych

## 8. Rozważania dotyczące wydajności
- **Pojedyncze zapytanie:** Jedna operacja DELETE z warunkiem złożonym
- **Indeksy:** Wykorzystanie PRIMARY KEY na `id` i indeksu na `user_id`
- **Kasowanie kaskadowe:** Sprawdzić, czy są relacje wymagające CASCADE (nie ma w obecnym schemacie)

## 9. Etapy wdrożenia
1. **Rozszerzenie pliku endpointa:**
   - Rozszerzyć plik `src/pages/api/flashcards/[id].ts` o metodę DELETE
2. **Walidacja parametru:**
   - Walidacja parametru `id` przy użyciu Zod (pozytywna liczba całkowita)
3. **Implementacja logiki biznesowej:**
   - Dodać metodę `deleteFlashcard(userId: string, flashcardId: number)` w `flashcardsService`
   - Metoda zwraca `Promise<{ success: boolean; deletedId?: number }>`
4. **Wykonanie DELETE:**
   - `DELETE FROM flashcards WHERE id = ? AND user_id = ?`
   - Sprawdzenie liczby usuniętych wierszy (count)
   - Jeśli count === 0, rzucić błąd NotFoundError
   - Jeśli count === 1, zwrócić sukces
5. **Obsługa błędów:**
   - Implementacja try-catch z odpowiednimi kodami statusu
   - Logowanie błędów
   - Zwracanie user-friendly error messages
6. **Rozważenie wpływu na statystyki:**
   - Pozostawić statystyki bez zmian (reprezentują historyczny snapshot)
8. **Dokumentacja:**
   - Zaktualizować DEV-NOTES.md
   - Dodać komentarz w kodzie o decyzji dot. statystyk

