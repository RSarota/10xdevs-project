# API Endpoint Implementation Plan: Get User Statistics

## 1. Przegląd punktu końcowego

Endpoint GET /api/users/me/statistics umożliwia pobranie kompleksowych statystyk dla uwierzytelnionego użytkownika, obejmujących fiszki i sesje generowania AI.

## 2. Szczegóły żądania

- **Metoda HTTP:** GET
- **Struktura URL:** `/api/users/me/statistics`
- **Parametry:**
  - **Wymagane:** Brak
  - **Opcjonalne:** Brak
- **Nagłówki:**
  - `Authorization: Bearer {token}` (w developmencie: używamy DEFAULT_USER_ID)

## 3. Wykorzystywane typy

- **UserStatisticsDTO:** Reprezentuje statystyki użytkownika (zdefiniowany w `src/types.ts`)
- **FlashcardType:** Enum dla typów fiszek
- Brak modeli Command

## 4. Szczegóły odpowiedzi

- **200 OK:**

```json
{
  "flashcards": {
    "total": "number",
    "by_type": {
      "manual": "number",
      "ai-full": "number",
      "ai-edited": "number"
    }
  },
  "generations": {
    "total_sessions": "number",
    "total_generated": "number",
    "total_accepted": "number",
    "acceptance_rate": "number (percentage)",
    "edit_rate": "number (percentage)"
  }
}
```

- **401 Unauthorized:** Brak lub nieprawidłowy token
- **500 Internal Server Error:** Błąd serwera

## 5. Przepływ danych

1. Klient wysyła żądanie GET do `/api/users/me/statistics`
2. Serwer weryfikuje token i identyfikuje użytkownika (w developmencie: DEFAULT_USER_ID)
3. Logika delegowana do `statisticsService.getUserStatistics(userId)`
4. Serwis wykonuje zapytania agregujące:
   - **Flashcards stats:** `SELECT COUNT(*) as total, type, COUNT(*) as count FROM flashcards WHERE user_id = ? GROUP BY type`
   - **Generation stats:** `SELECT COUNT(*) as total_sessions, SUM(generated_count), SUM(accepted_unedited_count), SUM(accepted_edited_count) FROM generations WHERE user_id = ?`
5. Obliczenia:
   - `total_accepted = accepted_unedited_count + accepted_edited_count`
   - `acceptance_rate = (total_accepted / total_generated) * 100` (lub 0 jeśli total_generated = 0)
   - `edit_rate = (accepted_edited_count / total_accepted) * 100` (lub 0 jeśli total_accepted = 0)
6. Zwraca obiekt `UserStatisticsDTO` z kodem 200

## 6. Względy bezpieczeństwa

- **Uwierzytelnienie:** Wymagane sprawdzenie tokena w nagłówku `Authorization` (w produkcji)
- **Autoryzacja:** Statystyki tylko dla uwierzytelnionego użytkownika (filtracja po user_id)
- **RLS:** W produkcji Row Level Security zapewni dodatkową warstwę bezpieczeństwa

## 7. Obsługa błędów

- **401 Unauthorized:** Brak lub nieprawidłowy token (w produkcji)
- **500 Internal Server Error:** Błąd bazy danych lub logiki biznesowej

Jeśli użytkownik nie ma żadnych danych, zwracane są zera we wszystkich polach (200).

## 8. Rozważania dotyczące wydajności

- **Agregacje:** Wykorzystanie funkcji agregujących SQL (COUNT, SUM, GROUP BY)
- **Indeksy:** Wykorzystanie indeksów na `user_id` i `type`
- **Caching:** Rozważyć cache'owanie statystyk (np. 5 minut) dla często odpytujących użytkowników
- **Liczba zapytań:** 2 zapytania (flashcards, generations) - można zoptymalizować używając CTE lub window functions

## 9. Etapy wdrożenia

1. **Utworzenie pliku endpointa:**
   - Utworzyć plik w `src/pages/api/users/me/statistics.ts`
2. **Autoryzacja:**
   - Sprawdzanie tokena (lub użycie DEFAULT_USER_ID w developmencie)
3. **Implementacja logiki biznesowej:**
   - Utworzyć `src/lib/services/statistics.service.ts`
   - Metoda `getUserStatistics(userId)` zwraca `Promise<UserStatisticsDTO>`
4. **Zapytania do bazy danych:**
   - Query 1 (flashcards): Agregacja z GROUP BY type
   - Query 2 (generations): Agregacja SUM dla wszystkich liczników
5. **Obliczenia wskaźników:**
   - Implementacja bezpiecznych obliczeń (unikanie dzielenia przez 0)
   - Zaokrąglanie acceptance_rate i edit_rate do 2 miejsc po przecinku
6. **Formatowanie odpowiedzi:**
   - Mapowanie wyników zapytań na strukturę `UserStatisticsDTO`
   - Uzupełnianie zerami dla brakujących typów fiszek
7. **Obsługa błędów:**
   - Try-catch z odpowiednimi kodami statusu
   - Logowanie błędów
8. **Dokumentacja:**
   - Zaktualizować DEV-NOTES.md
