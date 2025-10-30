# API Endpoint Implementation Plan: Get Generation Error Logs

## 1. Przegląd punktu końcowego
Endpoint GET /api/generation-errors umożliwia pobranie logów błędów z nieudanych prób generowania fiszek. Endpoint przeznaczony głównie do celów administracyjnych i debugowania, ale w MVP dostępny dla użytkownika do przeglądania własnych błędów.

## 2. Szczegóły żądania
- **Metoda HTTP:** GET
- **Struktura URL:** `/api/generation-errors`
- **Parametry:** 
  - **Wymagane:** Brak parametrów obowiązkowych (poza tokenem autoryzacyjnym w nagłówkach)
  - **Opcjonalne:** 
    - `page` – numer strony (domyślnie 1)
    - `limit` – ilość rekordów na stronę (domyślnie 20, maksymalnie 50)
    - `error_code` – filtracja według kodu błędu (opcjonalne)
- **Nagłówki:** 
  - `Authorization: Bearer {token}` (w developmencie: używamy DEFAULT_USER_ID)

## 3. Wykorzystywane typy
- **GenerationErrorDTO:** Reprezentuje rekord z tabeli `generation_error_logs` (zdefiniowany w `src/types.ts`)
- Brak modeli Command, ponieważ endpoint jest typu GET

## 4. Szczegóły odpowiedzi
- **200 OK:**
```json
{
  "data": [
    {
      "id": "number",
      "user_id": "uuid",
      "source_text_hash": "string",
      "source_text_length": "number",
      "error_code": "string",
      "error_message": "string",
      "created_at": "timestamp"
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
1. Klient wysyła żądanie GET do `/api/generation-errors` wraz z nagłówkiem `Authorization`
2. Serwer weryfikuje token i identyfikuje użytkownika (w developmencie: DEFAULT_USER_ID)
3. Parametry zapytania są walidowane przy użyciu Zod
4. **Walidacja parametrów:**
   - `page` ≥ 1 (domyślnie 1)
   - `limit` ≥ 1 i ≤ 50 (domyślnie 20)
   - `error_code` jest niepustym stringiem (opcjonalnie)
5. Logika biznesowa jest delegowana do `generationErrorsService.getErrors(userId, params)`
6. Serwis:
   - Buduje zapytanie SQL z filtrem `user_id`, opcjonalnie `error_code`, paginacją i sortowaniem po `created_at DESC`
   - Pobiera rekordy z offsetem i limitem
   - Pobiera całkowitą liczbę rekordów dla użytkownika (z uwzględnieniem filtru error_code)
7. Zwraca listę błędów oraz metadane paginacji z kodem 200

## 6. Względy bezpieczeństwa
- **Uwierzytelnienie:** Wymagane sprawdzenie tokena w nagłówku `Authorization` (w produkcji)
- **Autoryzacja:** Upewnienie się, że użytkownik pobiera tylko swoje błędy (RLS lub filtracja po user_id)
- **Walidacja parametrów:** Sprawdzenie zakresów dla page, limit, poprawności error_code
- **RLS:** W produkcji Row Level Security zapewni dodatkową warstwę bezpieczeństwa
- **Exposure:** Nie ujawniamy szczegółów technicznych API AI klientowi (error_message może być zredagowany)

## 7. Obsługa błędów
- **400 Bad Request:**
  - Nieprawidłowe wartości `page` (< 1, nie-liczba)
  - Nieprawidłowe wartości `limit` (< 1, > 50, nie-liczba)
  - Nieprawidłowa wartość `error_code` (pusty string)
- **401 Unauthorized:** Brak lub nieprawidłowy token (w produkcji)
- **500 Internal Server Error:** Błąd w serwerze lub w logice biznesowej

W przypadku braku wyników zwrócenie 200 z pustą listą danych.

## 8. Rozważania dotyczące wydajności
- **Paginacja:** Implementacja paginacji zapobiega przeciążeniu przy dużych ilościach logów
- **Indeksy:** Wykorzystanie indeksów na `user_id`, `error_code` i `created_at` dla szybkiego filtrowania i sortowania
- **Liczba zapytań:** Dwa zapytania - jedno dla danych, jedno dla COUNT
- **Filtrowanie:** Opcjonalne filtrowanie po `error_code` dla analizy specyficznych problemów

## 9. Etapy wdrożenia
1. **Utworzenie pliku endpointa:**
   - Utworzyć plik w `src/pages/api/generation-errors.ts`
2. **Walidacja i autoryzacja:**
   - Skonfigurować sprawdzanie tokena (lub użycie DEFAULT_USER_ID w developmencie)
   - Walidacja parametrów zapytania przy użyciu Zod
3. **Utworzenie schematu walidacji Zod:**
   - Schema dla query parameters: `page`, `limit`, `error_code` (optional)
   - Default values: page = 1, limit = 20
   - Validacja: page ≥ 1, limit 1-50
   - Opcjonalnie: lista dozwolonych wartości error_code (enum)
4. **Implementacja logiki biznesowej:**
   - Utworzyć `src/lib/services/generation-errors.service.ts`
   - Dodać metodę `getErrors(userId, params)` 
   - Metoda zwraca `Promise<{ data: GenerationErrorDTO[], pagination: PaginationMeta }>`
5. **Interakcja z bazą danych:**
   - Obliczenie offsetu: `offset = (page - 1) * limit`
   - Budowa WHERE clause: `WHERE user_id = ?` + (opcjonalnie) `AND error_code = ?`
   - Query 1: `SELECT * FROM generation_error_logs WHERE {conditions} ORDER BY created_at DESC LIMIT ? OFFSET ?`
   - Query 2: `SELECT COUNT(*) FROM generation_error_logs WHERE {conditions}`
   - Obliczenie `total_pages = Math.ceil(total_items / limit)`
6. **Obsługa błędów:**
   - Implementacja try-catch z odpowiednimi kodami statusu
   - Logowanie błędów
   - Zwracanie user-friendly error messages
8. **Rozważenia przyszłościowe:**
   - W pełnej wersji produkcyjnej rozważyć role-based access (admin widzi wszystkie błędy)
   - Dodanie dodatkowych filtrów (data range, severity level)
   - Agregacje błędów (grupowanie po error_code)
9. **Dokumentacja:**
   - Zaktualizować DEV-NOTES.md
   - Dodać listę możliwych error_code w dokumentacji

