# API Endpoint Implementation Plan: Get Generation History

## 1. Przegląd punktu końcowego

Endpoint GET /api/generations umożliwia pobranie historii sesji generowania fiszek dla uwierzytelnionego użytkownika. Endpoint obsługuje paginację i sortowanie.

## 2. Szczegóły żądania

- **Metoda HTTP:** GET
- **Struktura URL:** `/api/generations`
- **Parametry:**
  - **Wymagane:** Brak parametrów obowiązkowych (poza tokenem autoryzacyjnym w nagłówkach)
  - **Opcjonalne:**
    - `page` – numer strony (domyślnie 1)
    - `limit` – ilość rekordów na stronę (domyślnie 20, maksymalnie 50)
    - `sort_order` – kolejność sortowania (`asc` lub `desc`; domyślnie `desc`)
- **Nagłówki:**
  - `Authorization: Bearer {token}` (w developmencie: używamy DEFAULT_USER_ID)

## 3. Wykorzystywane typy

- **GenerationDTO:** Reprezentuje rekord z tabeli `generations` (zdefiniowany w `src/types.ts`)
- Brak modeli Command, ponieważ endpoint jest typu GET

## 4. Szczegóły odpowiedzi

- **200 OK:**

```json
{
  "data": [
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
      "updated_at": "timestamp"
    }
  ],
  "pagination": {
    "page": "number",
    "limit": "number",
    "total_items": "number",
    "total_pages": "number"
  }
}
```

- **400 Bad Request:** Nieprawidłowe parametry zapytania
- **401 Unauthorized:** Brak lub nieprawidłowy token
- **500 Internal Server Error:** Błąd serwera

## 5. Przepływ danych

1. Klient wysyła żądanie GET do `/api/generations` wraz z nagłówkiem `Authorization`
2. Serwer weryfikuje token i identyfikuje użytkownika (w developmencie: DEFAULT_USER_ID)
3. Parametry zapytania są walidowane przy użyciu Zod
4. **Walidacja parametrów:**
   - `page` ≥ 1 (domyślnie 1)
   - `limit` ≥ 1 i ≤ 50 (domyślnie 20)
   - `sort_order` jest "asc" lub "desc" (domyślnie "desc")
5. Logika biznesowa jest delegowana do `generationsService.getGenerations(userId, params)`
6. Serwis:
   - Buduje zapytanie SQL z filtrem `user_id`, paginacją i sortowaniem po `created_at`
   - Pobiera rekordy z offsetem i limitem
   - Pobiera całkowitą liczbę rekordów dla użytkownika (dla paginacji)
7. Zwraca listę generacji oraz metadane paginacji z kodem 200

## 6. Względy bezpieczeństwa

- **Uwierzytelnienie:** Wymagane sprawdzenie tokena w nagłówku `Authorization` (w produkcji)
- **Autoryzacja:** Upewnienie się, że użytkownik pobiera tylko swoje dane (RLS lub filtracja po user_id)
- **Walidacja parametrów:** Sprawdzenie zakresów dla page, limit, sort_order
- **RLS:** W produkcji Row Level Security zapewni dodatkową warstwę bezpieczeństwa

## 7. Obsługa błędów

- **400 Bad Request:**
  - Nieprawidłowe wartości `page` (< 1, nie-liczba)
  - Nieprawidłowe wartości `limit` (< 1, > 50, nie-liczba)
  - Nieprawidłowa wartość `sort_order` (inna niż "asc" lub "desc")
- **401 Unauthorized:** Brak lub nieprawidłowy token (w produkcji)
- **500 Internal Server Error:** Błąd w serwerze lub w logice biznesowej

W przypadku braku wyników zwrócenie 200 z pustą listą danych.

## 8. Rozważania dotyczące wydajności

- **Paginacja:** Implementacja paginacji zapobiega przeciążeniu przy dużych ilościach danych
- **Indeksy:** Wykorzystanie indeksu na `user_id` i `created_at` dla szybkiego sortowania i filtrowania
- **Liczba zapytań:** Dwa zapytania - jedno dla danych, jedno dla COUNT (opcjonalnie: window functions)
- **Optymalizacja COUNT:** Rozważyć użycie window functions (COUNT() OVER()) zamiast oddzielnego zapytania

## 9. Etapy wdrożenia

1. **Rozszerzenie pliku endpointa:**
   - Rozszerzyć plik `src/pages/api/generations.ts` o metodę GET (plik już będzie istniał po POST)
2. **Walidacja i autoryzacja:**
   - Skonfigurować sprawdzanie tokena (lub użycie DEFAULT_USER_ID w developmencie)
   - Walidacja parametrów zapytania przy użyciu Zod
3. **Utworzenie schematu walidacji Zod:**
   - Schema dla query parameters: `page`, `limit`, `sort_order`
   - Default values: page = 1, limit = 20, sort_order = "desc"
   - Validacja: page ≥ 1, limit 1-50, sort_order in ["asc", "desc"]
4. **Implementacja logiki biznesowej:**
   - Dodać metodę `getGenerations(userId, params)` w `generationsService`
   - Metoda zwraca `Promise<{ data: GenerationDTO[], pagination: PaginationMeta }>`
5. **Interakcja z bazą danych:**
   - Obliczenie offsetu: `offset = (page - 1) * limit`
   - Query 1: `SELECT * FROM generations WHERE user_id = ? ORDER BY created_at {sort_order} LIMIT ? OFFSET ?`
   - Query 2: `SELECT COUNT(*) FROM generations WHERE user_id = ?`
   - Obliczenie `total_pages = Math.ceil(total_items / limit)`
6. **Obsługa błędów:**
   - Implementacja try-catch z odpowiednimi kodami statusu
   - Logowanie błędów
   - Zwracanie user-friendly error messages
7. **Dokumentacja:**
   - Zaktualizować DEV-NOTES.md
