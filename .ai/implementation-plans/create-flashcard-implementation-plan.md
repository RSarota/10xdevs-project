# API Endpoint Implementation Plan: Create Flashcard (Single or Bulk)

## 1. Przegląd punktu końcowego
Endpoint POST /api/flashcards umożliwia utworzenie jednej lub wielu fiszek (ręcznych lub wygenerowanych przez AI). Endpoint automatycznie wykrywa czy jest to operacja pojedyncza czy masowa, waliduje dane wejściowe i aktualizuje statystyki generacji, jeśli fiszki pochodzą z AI.

## 2. Szczegóły żądania
- **Metoda HTTP:** POST
- **Struktura URL:** `/api/flashcards`
- **Parametry:** 
  - **Wymagane:** Brak parametrów URL
  - **Opcjonalne:** Brak
- **Nagłówki:** 
  - `Authorization: Bearer {token}` (w developmencie: używamy DEFAULT_USER_ID)
  - `Content-Type: application/json`

### Wariant A: Pojedyncza fiszka
```json
{
  "front": "string (required, max 200 chars)",
  "back": "string (required, max 500 chars)",
  "source": "string (required: 'manual' | 'ai-full' | 'ai-edited')",
  "generation_id": "number (optional, required when source is 'ai-full' or 'ai-edited')"
}
```

### Wariant B: Wiele fiszek (bulk)
```json
{
  "flashcards": [
    {
      "front": "string (required, max 200 chars)",
      "back": "string (required, max 500 chars)",
      "source": "string (required: 'manual' | 'ai-full' | 'ai-edited')",
      "generation_id": "number (optional, required when source is 'ai-full' or 'ai-edited')"
    }
  ]
}
```
**Uwaga:** Maksymalnie 100 fiszek w jednym żądaniu bulk.

## 3. Wykorzystywane typy
- **CreateFlashcardCommand:** Model Command dla tworzenia fiszki (zdefiniowany w `src/types.ts`)
- **FlashcardDTO:** Reprezentuje rekord z tabeli `flashcards`
- **FlashcardSource:** Typ określający pochodzenie fiszki (alias dla FlashcardType)
- **GenerationDTO:** Używany do weryfikacji istnienia generation_id

## 4. Szczegóły odpowiedzi

### Pojedyncza fiszka - 201 Created:
```json
{
  "id": "number",
  "user_id": "uuid",
  "generation_id": "number | null",
  "type": "manual | ai-full | ai-edited",
  "front": "string",
  "back": "string",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### Wiele fiszek (bulk) - 201 Created:
```json
{
  "count": "number",
  "flashcards": [
    {
      "id": "number",
      "user_id": "uuid",
      "generation_id": "number | null",
      "type": "manual | ai-full | ai-edited",
      "front": "string",
      "back": "string",
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
  ]
}
```
**Uwaga:** Kolejność zwróconych fiszek odpowiada kolejności w żądaniu.

### Kody błędów:
- **400 Bad Request:** Błędy walidacji (niepoprawne dane, pusta tablica, przekroczony limit 100 fiszek)
- **401 Unauthorized:** Brak lub nieprawidłowy token
- **404 Not Found:** Generation ID nie istnieje lub nie należy do użytkownika
- **500 Internal Server Error:** Błąd serwera

## 5. Przepływ danych
1. Klient wysyła żądanie POST z fiszką/fiszkami
2. Serwer weryfikuje token i identyfikuje użytkownika (w developmencie: DEFAULT_USER_ID)
3. **Wykrycie typu operacji:**
   - Jeśli request zawiera pole `flashcards` → tryb BULK
   - W przeciwnym razie → tryb SINGLE
4. Request body jest walidowany przy użyciu Zod
5. **Walidacja biznesowa (dla każdej fiszki):**
   - Limity: `front` ≤ 200 znaków, `back` ≤ 500 znaków
   - Jeśli `source === 'manual'`: `generation_id` musi być null/undefined
   - Jeśli `source === 'ai-full'` lub `'ai-edited'`: `generation_id` jest wymagane
   - W trybie bulk: maksymalnie 100 fiszek

### Dla operacji SINGLE:
6. Logika delegowana do `flashcardsService.createOne(userId, command)`
7. **Dla fiszek AI:**
   - Weryfikacja czy generation_id istnieje i należy do użytkownika
   - INSERT fiszki do bazy
   - UPDATE statystyk w `generations` (inkrementacja countera)
8. **Dla fiszek manual:**
   - INSERT fiszki bez aktualizacji statystyk
9. Zwrócenie utworzonej fiszki (201)

### Dla operacji BULK:
6. Logika delegowana do `flashcardsService.createMany(userId, commands)`
7. **W transakcji bazy danych:**
   - Walidacja wszystkich generation_id (jeśli AI)
   - Bulk INSERT wszystkich fiszek
   - Grupowanie fiszek per generation_id
   - Bulk UPDATE statystyk w `generations` dla każdego generation_id
8. Zwrócenie tablicy utworzonych fiszek w tej samej kolejności (201)

## 6. Względy bezpieczeństwa
- **Uwierzytelnienie:** Wymagane sprawdzenie tokena w nagłówku `Authorization` (w produkcji)
- **Autoryzacja:** Weryfikacja, że generation_id (jeśli podany) należy do uwierzytelnionego użytkownika
- **Walidacja danych wejściowych:**
  - Sanitizacja tekstu (front, back) - zapobieganie XSS
  - Sprawdzanie limitów znaków
  - Weryfikacja wartości enum dla `source`
- **RLS:** W produkcji Row Level Security zapewni dodatkową warstwę bezpieczeństwa
- **SQL Injection:** Wykorzystanie prepared statements przez Supabase SDK

## 7. Obsługa błędów
- **400 Bad Request:**
  - Brak wymaganych pól (front, back, source)
  - `source` nie jest jednym z dozwolonych wartości
  - `source === 'manual'` ale `generation_id` jest podany
  - `source === 'ai-full' | 'ai-edited'` ale brak `generation_id`
  - Limity znaków przekroczone: front > 200 lub back > 500
  - Pole front lub back zawiera tylko białe znaki
  - **Bulk:** Pusta tablica `flashcards`
  - **Bulk:** Więcej niż 100 fiszek w jednym żądaniu
- **404 Not Found:** 
  - `generation_id` nie istnieje
  - `generation_id` nie należy do użytkownika
- **401 Unauthorized:** Brak lub nieprawidłowy token (w produkcji)
- **500 Internal Server Error:** 
  - Błąd bazy danych
  - Błąd transakcji (bulk)
  - Błąd logiki biznesowej

## 8. Rozważania dotyczące wydajności
- **Transakcje:** Użycie transakcji bazy danych dla operacji z fiszkami AI (insert + update statistics) aby zapewnić spójność i atomowość
- **Bulk INSERT:** W trybie bulk jedno zapytanie INSERT dla wielu fiszek zamiast N oddzielnych zapytań
- **Bulk UPDATE:** Grupowanie aktualizacji statystyk per generation_id
- **Indeksy:** Wykorzystanie indeksów na `generation_id` i `user_id` w tabeli `generations`
- **Walidacja:** Minimalizacja zapytań do bazy - walidacja wszystkich generation_id jednocześnie w ramach transakcji
- **Limit 100 fiszek:** Zapobiega przeciążeniu i timeout przy zbyt dużych operacjach bulk
- **Optymistyczna walidacja:** Najpierw walidacja danych w pamięci, potem zapytania do bazy

## 9. Etapy wdrożenia

### Krok 1: Walidacja Zod
```typescript
// src/lib/schemas/flashcard.schema.ts
import { z } from 'zod';

// Base schema dla pojedynczej fiszki
const FlashcardInputSchema = z.object({
  front: z.string().min(1).max(200).trim(),
  back: z.string().min(1).max(500).trim(),
  source: z.enum(['manual', 'ai-full', 'ai-edited']),
  generation_id: z.number().int().positive().optional()
})
  .refine(data => {
    if (data.source === 'manual') return !data.generation_id;
    return !!data.generation_id;
  }, "Manual flashcards cannot have generation_id, AI flashcards require it");

// Schema dla bulk
const BulkFlashcardsSchema = z.object({
  flashcards: z.array(FlashcardInputSchema).min(1).max(100)
});

// Union schema
export const CreateFlashcardSchema = z.union([
  FlashcardInputSchema,
  BulkFlashcardsSchema
]);
```

### Krok 2: Routing w endpoint
```typescript
// src/pages/api/flashcards.ts - POST handler
const body = await request.json();
const validated = CreateFlashcardSchema.parse(body);

if ('flashcards' in validated) {
  // Bulk path
  return await flashcardsService.createMany(userId, validated.flashcards);
} else {
  // Single path
  return await flashcardsService.createOne(userId, validated);
}
```

### Krok 3: Implementacja Service Layer
**Single:**
- Metoda `createOne(userId, command)` w `flashcardsService`
- Walidacja generation_id (helper: `validateGenerationOwnership`)
- INSERT fiszki
- UPDATE statystyk (jeśli AI)
- Zwrócenie `FlashcardDTO`

**Bulk:**
- Metoda `createMany(userId, commands)` w `flashcardsService`
- W transakcji:
  - Walidacja wszystkich generation_id
  - Bulk INSERT fiszek (jedno zapytanie)
  - Grupowanie per generation_id
  - Bulk UPDATE statystyk per generation
- Zwrócenie tablicy `FlashcardDTO[]` w tej samej kolejności

### Krok 4: Testowanie
**Single:**
- ✅ Fiszka manual (201)
- ✅ Fiszka manual z generation_id (400)
- ✅ Fiszka AI bez generation_id (400)
- ✅ Fiszka AI z nieistniejącym generation_id (404)
- ✅ Fiszka AI z generation_id innego użytkownika (404)
- ✅ Przekroczenie limitów: front > 200 lub back > 500 (400)
- ✅ Weryfikacja inkrementacji statystyk dla ai-full i ai-edited

**Bulk:**
- ✅ Bulk manual flashcards (201)
- ✅ Bulk AI flashcards (201, weryfikacja statystyk)
- ✅ Bulk mix manual + AI (201)
- ✅ Pusta tablica (400)
- ✅ > 100 fiszek (400)
- ✅ Atomowość transakcji - rollback przy błędzie
- ✅ Kolejność zachowana w response

### Krok 5: Dokumentacja
- Zaktualizować DEV-NOTES.md (usunąć bulk-accept endpoint)


