# API Endpoint Implementation Plan: Bulk Delete Flashcards

## 1. Przegląd punktu końcowego
Endpoint POST /api/flashcards/bulk-delete umożliwia usunięcie wielu fiszek jednocześnie. Operacja jest zoptymalizowana pod kątem wydajności i zapewnia atomowość.

## 2. Szczegóły żądania
- **Metoda HTTP:** POST
- **Struktura URL:** `/api/flashcards/bulk-delete`
- **Parametry:** 
  - **Wymagane:** Brak parametrów URL
  - **Opcjonalne:** Brak
- **Nagłówki:** 
  - `Authorization: Bearer {token}` (w developmencie: używamy DEFAULT_USER_ID)
  - `Content-Type: application/json`
- **Request Body:**
```json
{
  "flashcard_ids": ["number[]"]
}
```

## 3. Wykorzystywane typy
- **BulkDeleteFlashcardsCommand:** Model Command dla bulk delete (zdefiniowany w `src/types.ts`)

## 4. Szczegóły odpowiedzi
- **200 OK:**
```json
{
  "message": "Flashcards deleted successfully",
  "deleted_count": "number"
}
```
- **400 Bad Request:** Błędy walidacji (pusta tablica, nieprawidłowe ID)
- **401 Unauthorized:** Brak lub nieprawidłowy token
- **500 Internal Server Error:** Błąd serwera

## 5. Przepływ danych
1. Klient wysyła żądanie POST do `/api/flashcards/bulk-delete` z tablicą ID fiszek
2. Serwer weryfikuje token i identyfikuje użytkownika (w developmencie: DEFAULT_USER_ID)
3. Request body jest walidowany przy użyciu Zod zgodnie z `BulkDeleteFlashcardsCommand`
4. **Walidacja biznesowa:**
   - Tablica `flashcard_ids` nie może być pusta
   - Wszystkie elementy muszą być pozytywnymi liczbami całkowitymi
   - Opcjonalnie: limit maksymalnej liczby ID w jednym żądaniu (np. 100)
5. Logika delegowana do `flashcardsService.bulkDeleteFlashcards(userId, flashcardIds)`
6. Serwis wykonuje DELETE z warunkiem IN i ownership:
   - `DELETE FROM flashcards WHERE id IN (?, ?, ...) AND user_id = ?`
7. Zwraca liczbę usuniętych rekordów z kodem 200

## 6. Względy bezpieczeństwa
- **Uwierzytelnienie:** Wymagane sprawdzenie tokena w nagłówku `Authorization` (w produkcji)
- **Autoryzacja:** Weryfikacja ownership poprzez warunek `user_id` w DELETE - nie pozwala na usunięcie fiszek innych użytkowników
- **Walidacja danych wejściowych:**
  - Sprawdzenie, że tablica nie jest pusta
  - Walidacja każdego ID (tylko pozytywne liczby całkowite)
  - Deduplikacja ID (opcjonalnie)
  - Limit maksymalnej liczby ID (zapobieganie DoS)
- **RLS:** W produkcji Row Level Security zapewni dodatkową warstwę bezpieczeństwa
- **Atomowość:** Cała operacja powinna być atomowa (wszystkie lub żadne)

## 7. Obsługa błędów
- **400 Bad Request:**
  - Pusta tablica `flashcard_ids`
  - Tablica zawiera nieprawidłowe wartości (tekst, liczby ujemne, 0)
  - Przekroczony limit maksymalnej liczby ID
  - Brak pola `flashcard_ids`
- **401 Unauthorized:** Brak lub nieprawidłowy token (w produkcji)
- **500 Internal Server Error:** Błąd bazy danych

**Uwaga:** Nie zwracamy 404, jeśli niektóre ID nie istnieją - zwracamy rzeczywistą liczbę usuniętych rekordów. To pozwala klientowi wiedzieć, ile fiszek faktycznie usunięto.

## 8. Rozważania dotyczące wydajności
- **Pojedyncze zapytanie:** Jedno zapytanie DELETE z IN zamiast N oddzielnych DELETE
- **Indeksy:** Wykorzystanie PRIMARY KEY na `id` i indeksu na `user_id`
- **Limit rozmiaru:** Wprowadzenie limitu (np. 100 ID) zapobiega przeciążeniu bazy
- **Deduplikacja:** Usunięcie duplikatów z tablicy przed zapytaniem (opcjonalnie)
- **Transakcje:** Operacja DELETE jest atomowa z natury
- **Statystyki:** Podobnie jak w single delete, nie aktualizujemy statystyk `generations`

## 9. Etapy wdrożenia
1. **Utworzenie pliku endpointa:**
   - Utworzyć plik w `src/pages/api/flashcards/bulk-delete.ts`
2. **Utworzenie schematu walidacji Zod:**
   - Schema waliduje `BulkDeleteFlashcardsCommand`
   - Walidacja: `flashcard_ids` jest tablicą
   - Walidacja: tablica nie jest pusta
   - Walidacja: wszystkie elementy są pozytywnymi liczbami całkowitymi
   - Walidacja: tablica nie przekracza maksymalnego limitu (np. 100)
3. **Implementacja deduplikacji (opcjonalnie):**
   - Przekonwertować tablicę do Set i z powrotem do Array
   - Usunąć duplikaty przed wysłaniem do serwisu
4. **Implementacja logiki biznesowej:**
   - Dodać metodę `bulkDeleteFlashcards(userId: string, flashcardIds: number[])` w `flashcardsService`
   - Metoda zwraca `Promise<{ deletedCount: number }>`
5. **Wykonanie DELETE:**
   - Użyć Supabase `.delete().in('id', flashcardIds).eq('user_id', userId)`
   - Lub surowe SQL: `DELETE FROM flashcards WHERE id IN (?, ?, ...) AND user_id = ?`
   - Pobrać liczbę usuniętych wierszy
6. **Obsługa błędów:**
   - Implementacja try-catch z odpowiednimi kodami statusu
   - Logowanie błędów
   - Zwracanie user-friendly error messages
7. **Testowanie:**
   - Test usunięcia wielu fiszek użytkownika (200, deleted_count poprawny)
   - Test z pustą tablicą (400)
   - Test z nieprawidłowymi ID (400)
   - Test z duplikatami ID (sprawdzić zachowanie)
   - Test z niektórymi istniejącymi i nieistniejącymi ID (200, deleted_count = liczba istniejących)
   - Test z ID fiszek innych użytkowników (200, deleted_count = 0)
   - Test przekroczenia limitu (400)
   - Weryfikacja, że tylko podane fiszki zostały usunięte
8. **Dokumentacja:**
   - Zaktualizować DEV-NOTES.md
   - Dodać komentarz o limicie i zachowaniu z nieistniejącymi ID

