# API Endpoint Implementation Plan: Spaced Repetition

## 1. Przegląd punktów końcowych

Plan implementacji endpointów API dla systemu spaced repetition. Obejmuje trzy główne endpointy: rozpoczęcie sesji nauki, aktualizację oceny fiszki oraz pobranie historii sesji nauki.

## 2. Endpoint: POST /api/study/start

### 2.1. Szczegóły żądania

- **Metoda HTTP:** POST
- **Struktura URL:** `/api/study/start`
- **Parametry:** Brak parametrów URL
- **Nagłówki:**
  - `Authorization: Bearer {token}` (w developmencie: używamy DEFAULT_USER_ID)
  - `Content-Type: application/json`

**Request Body:**

```json
{
  "userId": "uuid (optional, inferred from token in production)"
}
```

**Uwaga:** W produkcji `userId` jest wyciągany z tokena JWT. W developmencie można przekazać opcjonalnie.

### 2.2. Wykorzystywane typy

- **CreateStudySessionCommand:** Model Command dla tworzenia sesji nauki
- **StudySessionDTO:** Reprezentuje rekord z tabeli `study_sessions`
- **FlashcardDTO:** Reprezentuje fiszki wybrane do sesji
- **StartStudySessionResponse:** Odpowiedź zawierająca sesję i fiszki

### 2.3. Szczegóły odpowiedzi

**201 Created:**

```json
{
  "studySession": {
    "id": 1,
    "user_id": "uuid",
    "started_at": "2025-11-12T10:00:00Z",
    "completed_at": null,
    "flashcards_count": 10,
    "average_rating": 0,
    "created_at": "2025-11-12T10:00:00Z",
    "updated_at": "2025-11-12T10:00:00Z"
  },
  "flashcards": [
    {
      "id": 1,
      "user_id": "uuid",
      "generation_id": null,
      "type": "manual",
      "front": "string",
      "back": "string",
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
  ]
}
```

**Kody błędów:**

- **400 Bad Request:** Błędy walidacji (niepoprawne dane)
- **401 Unauthorized:** Brak lub nieprawidłowy token
- **500 Internal Server Error:** Błąd serwera

### 2.4. Przepływ danych

1. Klient wysyła żądanie POST z opcjonalnym `userId`
2. Serwer weryfikuje token i identyfikuje użytkownika (w developmencie: DEFAULT_USER_ID lub z body)
3. **Wybór fiszek do sesji:**
   - Pobranie fiszek użytkownika, które wymagają powtórki (`next_review_at <= NOW()`)
   - Jeśli brak fiszek do powtórki, pobranie nowych fiszek (nigdy nie powtarzanych)
   - Limit: maksymalnie 20 fiszek na sesję
4. **Utworzenie sesji:**
   - INSERT do `study_sessions` z `started_at = NOW()`, `flashcards_count = liczba wybranych fiszek`
   - INSERT do `session_flashcards` dla każdej wybranej fiszki:
     - Dla nowych fiszek (brak rekordu w `session_flashcards`):
       - Utworzenie nowej karty przez `createEmptyCard()` z ts-fsrs
       - `next_review_at = card.due`
       - `stability = card.stability`
       - `difficulty = card.difficulty`
       - `review_count = card.reps` (0)
       - `lapses = card.lapses` (0)
       - `state = card.state` (New)
     - Dla fiszek wymagających powtórki:
       - Pobranie istniejących wartości z `session_flashcards`
       - Użycie wartości z bazy danych (nie resetowanie)
5. Zwrócenie utworzonej sesji i listy fiszek (201)

### 2.5. Logika biznesowa

- Algorytm wyboru fiszek:
  1. Priorytet: fiszki z `next_review_at <= NOW()` (sortowane rosnąco)
  2. Jeśli brak: nowe fiszki (brak rekordów w `session_flashcards`)
  3. Limit 20 fiszek na sesję dla optymalnego czasu trwania
- Domyślne wartości dla nowych fiszek (tworzone przez `createEmptyCard()` z ts-fsrs):
  - `stability`: wartość początkowa z FSRS (zwykle ~0.4)
  - `difficulty`: wartość początkowa z FSRS (zwykle ~0.3)
  - `review_count = 0` (reps w FSRS)
  - `lapses = 0`
  - `state = New` (stan nowej karty)
  - `next_review_at`: obliczona przez FSRS data następnej powtórki

## 3. Endpoint: PUT /api/study/update

### 3.1. Szczegóły żądania

- **Metoda HTTP:** PUT
- **Struktura URL:** `/api/study/update`
- **Parametry:** Brak parametrów URL
- **Nagłówki:**
  - `Authorization: Bearer {token}`
  - `Content-Type: application/json`

**Request Body:**

```json
{
  "studySessionId": 1,
  "flashcardId": 10,
  "lastRating": 4
}
```

**Walidacja:**

- `studySessionId`: wymagane, integer > 0
- `flashcardId`: wymagane, integer > 0
- `lastRating`: wymagane, integer 1-5

### 3.2. Wykorzystywane typy

- **UpdateSessionFlashcardCommand:** Model Command dla aktualizacji oceny fiszki
- **SessionFlashcardDTO:** Reprezentuje rekord z tabeli `session_flashcards`
- **StudySessionDTO:** Reprezentuje rekord z tabeli `study_sessions`

### 3.3. Szczegóły odpowiedzi

**200 OK:**

```json
{
  "message": "Session flashcard updated successfully",
  "sessionFlashcard": {
    "id": 1,
    "study_session_id": 1,
    "flashcard_id": 10,
    "next_review_at": "2025-11-15T10:00:00Z",
    "last_rating": 4,
    "review_count": 1,
    "ease_factor": 2.5,
    "interval_days": 2,
    "created_at": "timestamp",
    "updated_at": "timestamp"
  }
}
```

**Kody błędów:**

- **400 Bad Request:** Błędy walidacji (niepoprawne dane, rating poza zakresem)
- **401 Unauthorized:** Brak lub nieprawidłowy token
- **404 Not Found:** Sesja lub fiszka nie istnieje lub nie należy do użytkownika
- **500 Internal Server Error:** Błąd serwera

### 3.4. Przepływ danych

1. Klient wysyła żądanie PUT z danymi aktualizacji
2. Serwer weryfikuje token i identyfikuje użytkownika
3. **Walidacja:**
   - Weryfikacja istnienia sesji i przynależności do użytkownika
   - Weryfikacja istnienia fiszki i przynależności do użytkownika
   - Weryfikacja powiązania `session_flashcards` (sesja + fiszka)
4. **Obliczenie nowych wartości (użycie ts-fsrs):**
   - Pobranie aktualnych wartości z `session_flashcards`: `stability`, `difficulty`, `reps`, `lapses`, `state`, `last_review`, `due`
   - Konwersja oceny użytkownika (1-5) do `Rating` enum FSRS
   - Wywołanie `fsrs.repeat(currentCard, new Date(), fsrsRating)` z biblioteki ts-fsrs
   - Biblioteka zwraca nowy obiekt karty z:
     - `due`: nowa data następnej powtórki
     - `stability`: nowa stabilność
     - `difficulty`: nowa trudność
     - `reps`: zaktualizowana liczba powtórek
     - `lapses`: zaktualizowana liczba błędów
     - `state`: nowy stan karty
5. **Aktualizacja w transakcji:**
   - UPDATE `session_flashcards` z nowymi wartościami z FSRS:
     - `next_review_at = card.due`
     - `stability = card.stability`
     - `difficulty = card.difficulty`
     - `review_count = card.reps`
     - `lapses = card.lapses`
     - `state = card.state`
     - `last_review = NOW()`
   - Aktualizacja `average_rating` w `study_sessions` (przeliczenie średniej dla wszystkich fiszek w sesji)
6. Zwrócenie zaktualizowanego rekordu (200)

### 3.5. Logika biznesowa - Integracja z ts-fsrs

**Biblioteka open source:** `ts-fsrs` (Free Spaced Repetition Scheduler)

**Instalacja:**

```bash
npm install ts-fsrs
```

**Implementacja z wykorzystaniem ts-fsrs:**

```typescript
import { createEmptyCard, FSRS, Rating } from "ts-fsrs";

// Inicjalizacja FSRS
const fsrs = new FSRS();

// Funkcja aktualizacji fiszki po ocenie
function updateFlashcardWithFSRS(
  currentCard: {
    due: Date;
    stability: number;
    difficulty: number;
    elapsed_days: number;
    scheduled_days: number;
    reps: number;
    lapses: number;
    state: number;
    last_review?: Date;
  },
  rating: number // 1-5 (konwersja do Rating enum FSRS)
): {
  card: ReturnType<typeof fsrs.repeat>;
  nextReviewAt: Date;
} {
  // Konwersja oceny użytkownika (1-5) do Rating enum FSRS
  // FSRS używa: Again=1, Hard=2, Good=3, Easy=4
  const fsrsRating = convertUserRatingToFSRS(rating);

  // Obliczenie nowych wartości przez FSRS
  const result = fsrs.repeat(currentCard, new Date(), fsrsRating);

  return {
    card: result,
    nextReviewAt: result.card.due,
  };
}

// Funkcja konwersji oceny użytkownika do Rating FSRS
function convertUserRatingToFSRS(rating: number): Rating {
  // Mapowanie: 1=Again, 2=Hard, 3=Good, 4=Good, 5=Easy
  if (rating === 1) return Rating.Again;
  if (rating === 2) return Rating.Hard;
  if (rating === 3 || rating === 4) return Rating.Good;
  if (rating === 5) return Rating.Easy;
  return Rating.Good; // domyślnie
}

// Funkcja tworzenia nowej karty dla nowej fiszki
function createNewFlashcardCard(): ReturnType<typeof createEmptyCard> {
  return createEmptyCard();
}
```

**Struktura danych FSRS:**

- `due`: Data następnej powtórki
- `stability`: Stabilność (zastępuje ease_factor)
- `difficulty`: Trudność fiszki
- `elapsed_days`: Liczba dni od ostatniej powtórki
- `scheduled_days`: Zaplanowany interwał
- `reps`: Liczba powtórek (zastępuje review_count)
- `lapses`: Liczba błędów
- `state`: Stan karty (New, Learning, Review, Relearning)
- `last_review`: Data ostatniej powtórki

## 4. Endpoint: GET /api/study/history

### 4.1. Szczegóły żądania

- **Metoda HTTP:** GET
- **Struktura URL:** `/api/study/history`
- **Parametry zapytania:**
  - `page` (optional, default: 1): Numer strony
  - `limit` (optional, default: 20, max: 100): Liczba sesji na stronę
  - `sort_by` (optional, default: `started_at`): Pole sortowania (`started_at`, `completed_at`)
  - `sort_order` (optional, default: `desc`): Kolejność sortowania (`asc`, `desc`)
- **Nagłówki:**
  - `Authorization: Bearer {token}`

### 4.2. Wykorzystywane typy

- **StudySessionDTO:** Reprezentuje rekord z tabeli `study_sessions`
- **GetStudyHistoryResponse:** Odpowiedź zawierająca listę sesji i paginację

### 4.3. Szczegóły odpowiedzi

**200 OK:**

```json
{
  "studySessions": [
    {
      "id": 1,
      "user_id": "uuid",
      "started_at": "2025-11-12T10:00:00Z",
      "completed_at": "2025-11-12T10:30:00Z",
      "flashcards_count": 10,
      "average_rating": 4.2,
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "total_pages": 3
  }
}
```

**Kody błędów:**

- **400 Bad Request:** Nieprawidłowe parametry zapytania
- **401 Unauthorized:** Brak lub nieprawidłowy token
- **500 Internal Server Error:** Błąd serwera

### 4.4. Przepływ danych

1. Klient wysyła żądanie GET z opcjonalnymi parametrami paginacji
2. Serwer weryfikuje token i identyfikuje użytkownika
3. **Pobranie sesji:**
   - SELECT z `study_sessions` WHERE `user_id = userId`
   - Sortowanie według `sort_by` i `sort_order`
   - Paginacja: LIMIT i OFFSET
4. **Obliczenie paginacji:**
   - COUNT całkowitej liczby sesji użytkownika
   - Obliczenie `total_pages = ceil(total / limit)`
5. Zwrócenie listy sesji i informacji o paginacji (200)

## 5. Względy bezpieczeństwa

- **Uwierzytelnienie:** Wymagane sprawdzenie tokena w nagłówku `Authorization` (w produkcji)
- **Autoryzacja:** Weryfikacja, że sesje i fiszki należą do uwierzytelnionego użytkownika
- **Walidacja danych wejściowych:**
  - Sanitizacja wartości numerycznych (rating, IDs)
  - Sprawdzanie zakresów wartości (rating 1-5)
  - Weryfikacja istnienia i przynależności zasobów
- **RLS:** W produkcji Row Level Security zapewni dodatkową warstwę bezpieczeństwa
- **SQL Injection:** Wykorzystanie prepared statements przez Supabase SDK

## 6. Obsługa błędów

### 6.1. POST /api/study/start

- **400 Bad Request:**
  - Nieprawidłowy format `userId` (jeśli podany)
- **401 Unauthorized:** Brak lub nieprawidłowy token (w produkcji)
- **500 Internal Server Error:**
  - Błąd bazy danych
  - Błąd logiki biznesowej

### 6.2. PUT /api/study/update

- **400 Bad Request:**
  - Brak wymaganych pól (`studySessionId`, `flashcardId`, `lastRating`)
  - `lastRating` poza zakresem 1-5
  - Nieprawidłowe wartości numeryczne
- **404 Not Found:**
  - `studySessionId` nie istnieje
  - `studySessionId` nie należy do użytkownika
  - `flashcardId` nie istnieje
  - `flashcardId` nie należy do użytkownika
  - Brak powiązania `session_flashcards` dla danej pary (sesja, fiszka)
- **401 Unauthorized:** Brak lub nieprawidłowy token (w produkcji)
- **500 Internal Server Error:**
  - Błąd bazy danych
  - Błąd transakcji
  - Błąd algorytmu SM-2

### 6.3. GET /api/study/history

- **400 Bad Request:**
  - `page` < 1
  - `limit` < 1 lub > 100
  - Nieprawidłowe wartości `sort_by` lub `sort_order`
- **401 Unauthorized:** Brak lub nieprawidłowy token (w produkcji)
- **500 Internal Server Error:**
  - Błąd bazy danych
  - Błąd paginacji

## 7. Rozważania dotyczące wydajności

- **Indeksy:** Wykorzystanie indeksów na `user_id`, `next_review_at`, `started_at` dla optymalizacji zapytań
- **Transakcje:** Użycie transakcji bazy danych dla operacji aktualizacji (update session_flashcards + update study_sessions) aby zapewnić spójność
- **Paginacja:** Ograniczenie maksymalnej liczby sesji na stronę (100) zapobiega przeciążeniu
- **Optymalizacja zapytań:** Wykorzystanie JOIN zamiast wielu zapytań dla pobierania danych sesji i fiszek
- **Caching:** Rozważenie cache'owania historii sesji dla użytkowników (opcjonalnie, dla bardzo aktywnych użytkowników)

## 8. Etapy wdrożenia

### Krok 1: Walidacja Zod

```typescript
// src/lib/schemas/study.schema.ts
import { z } from "zod";

const StartStudySessionSchema = z.object({
  userId: z.string().uuid().optional(),
});

const UpdateSessionFlashcardSchema = z.object({
  studySessionId: z.number().int().positive(),
  flashcardId: z.number().int().positive(),
  lastRating: z.number().int().min(1).max(5),
});

const GetStudyHistorySchema = z.object({
  page: z.number().int().positive().default(1).optional(),
  limit: z.number().int().positive().max(100).default(20).optional(),
  sort_by: z.enum(["started_at", "completed_at"]).default("started_at").optional(),
  sort_order: z.enum(["asc", "desc"]).default("desc").optional(),
});
```

### Krok 2: Implementacja Service Layer

**StudyService:**

- Metoda `startSession(userId)` w `studyService`
  - Wybór fiszek do sesji (algorytm priorytetyzacji)
  - Dla nowych fiszek: utworzenie kart przez `createEmptyCard()` z ts-fsrs
  - INSERT sesji i powiązań w transakcji
  - Zwrócenie `StartStudySessionResponse`

- Metoda `updateSessionFlashcard(userId, command)` w `studyService`
  - Walidacja sesji i fiszki
  - Pobranie aktualnej karty z bazy danych
  - Konwersja oceny użytkownika do `Rating` enum FSRS
  - Wywołanie `fsrs.repeat(currentCard, new Date(), fsrsRating)` z ts-fsrs
  - UPDATE w transakcji (session_flashcards + study_sessions) z wartościami z FSRS
  - Zwrócenie zaktualizowanego rekordu

- Metoda `getHistory(userId, queryParams)` w `studyService`
  - SELECT z paginacją
  - Zwrócenie `GetStudyHistoryResponse`

**FSRS Integration:**

- Import biblioteki: `import { createEmptyCard, FSRS, Rating } from 'ts-fsrs'`
- Inicjalizacja: `const fsrs = new FSRS()` (można skonfigurować parametry)
- Funkcja `convertUserRatingToFSRS(rating: number): Rating` w `src/lib/fsrs/helpers.ts`
  - Konwersja oceny użytkownika (1-5) do Rating enum FSRS
- Funkcja `mapCardToDatabase(card: Card): SessionFlashcardData` w `src/lib/fsrs/helpers.ts`
  - Mapowanie obiektu karty FSRS na strukturę bazy danych

### Krok 3: Routing w endpointach

```typescript
// src/pages/api/study/start.ts - POST handler
// src/pages/api/study/update.ts - PUT handler
// src/pages/api/study/history.ts - GET handler
```

### Krok 4: Testowanie

**POST /api/study/start:**

- ✅ Utworzenie sesji z nowymi fiszkami (201)
- ✅ Utworzenie sesji z fiszkami wymagającymi powtórki (201)
- ✅ Weryfikacja limitu 20 fiszek na sesję
- ✅ Weryfikacja domyślnych wartości dla nowych fiszek

**PUT /api/study/update:**

- ✅ Aktualizacja oceny fiszki (200)
- ✅ Weryfikacja obliczeń FSRS dla różnych ocen
- ✅ Weryfikacja aktualizacji average_rating w sesji
- ✅ Nieistniejąca sesja (404)
- ✅ Nieistniejąca fiszka (404)
- ✅ Rating poza zakresem (400)

**GET /api/study/history:**

- ✅ Pobranie historii z paginacją (200)
- ✅ Weryfikacja sortowania
- ✅ Pusta historia (200, pusta tablica)
- ✅ Nieprawidłowe parametry paginacji (400)

### Krok 5: Dokumentacja

- Zaktualizować DEV-NOTES.md z informacjami o nowych endpointach
- Dodać przykłady użycia API
