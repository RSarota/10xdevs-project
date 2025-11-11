# Database Layer Implementation Plan: Spaced Repetition

## 1. Przegląd

Plan implementacji warstwy bazy danych dla systemu spaced repetition. Obejmuje tworzenie nowych tabel, typów, indeksów, triggerów oraz polityk RLS dla sesji nauki i powiązań fiszek z sesjami.

## 2. Nowe tabele

### 2.1. Tabela: study_sessions

**Cel:** Przechowywanie metadanych sesji nauki użytkownika.

**Kolumny:**

- `id` – PRIMARY KEY, typ: BIGSERIAL
- `user_id` – FOREIGN KEY odwołujący się do `auth.users(id)`, typ: UUID, NOT NULL
- `started_at` – timestamp rozpoczęcia sesji, typ: TIMESTAMPTZ, NOT NULL, domyślnie NOW()
- `completed_at` – timestamp zakończenia sesji, typ: TIMESTAMPTZ, NULLABLE
- `flashcards_count` – liczba fiszek w sesji, typ: INTEGER, NOT NULL, domyślnie 0
- `average_rating` – średnia ocena sesji (skala 1-5), typ: DECIMAL(3,2), NULLABLE
- `created_at` – timestamp utworzenia rekordu, typ: TIMESTAMPTZ, NOT NULL, domyślnie NOW()
- `updated_at` – timestamp ostatniej modyfikacji, typ: TIMESTAMPTZ, NOT NULL, domyślnie NOW()

**Ograniczenia:**

- `check_flashcards_count_positive`: `flashcards_count >= 0`
- `check_average_rating_range`: `average_rating IS NULL OR (average_rating >= 1.0 AND average_rating <= 5.0)`
- `check_completed_after_started`: `completed_at IS NULL OR completed_at >= started_at`

**Komentarze:**

- `comment on table study_sessions is 'User study sessions for spaced repetition learning'`
- `comment on column study_sessions.user_id is 'Reference to the user who started the session'`
- `comment on column study_sessions.flashcards_count is 'Total number of flashcards reviewed in this session'`
- `comment on column study_sessions.average_rating is 'Average rating of flashcards in this session (1-5 scale)'`

### 2.2. Tabela: session_flashcards

**Cel:** Powiązanie fiszek z sesjami nauki, przechowywanie daty kolejnej powtórki i ostatniej oceny.

**Kolumny:**

- `id` – PRIMARY KEY, typ: BIGSERIAL
- `study_session_id` – FOREIGN KEY odwołujący się do `study_sessions(id)`, typ: BIGINT, NOT NULL
- `flashcard_id` – FOREIGN KEY odwołujący się do `flashcards(id)`, typ: BIGINT, NOT NULL
- `next_review_at` – data kolejnej powtórki (obliczona przez algorytm FSRS), typ: TIMESTAMPTZ, NOT NULL
- `last_rating` – ostatnia ocena fiszki (skala 1-5), typ: INTEGER, NULLABLE
- `review_count` – liczba powtórek fiszki (reps w FSRS), typ: INTEGER, NOT NULL, domyślnie 0
- `stability` – stabilność fiszki (używana w algorytmie FSRS), typ: DECIMAL(10,6), NOT NULL
- `difficulty` – trudność fiszki (używana w algorytmie FSRS), typ: DECIMAL(10,6), NOT NULL
- `lapses` – liczba błędów (używana w algorytmie FSRS), typ: INTEGER, NOT NULL, domyślnie 0
- `state` – stan karty FSRS (New=0, Learning=1, Review=2, Relearning=3), typ: INTEGER, NOT NULL, domyślnie 0
- `last_review` – data ostatniej powtórki, typ: TIMESTAMPTZ, NULLABLE
- `elapsed_days` – liczba dni od ostatniej powtórki, typ: INTEGER, NOT NULL, domyślnie 0
- `scheduled_days` – zaplanowany interwał w dniach, typ: INTEGER, NOT NULL, domyślnie 0
- `created_at` – timestamp utworzenia rekordu, typ: TIMESTAMPTZ, NOT NULL, domyślnie NOW()
- `updated_at` – timestamp ostatniej modyfikacji, typ: TIMESTAMPTZ, NOT NULL, domyślnie NOW()

**Ograniczenia:**

- `check_last_rating_range`: `last_rating IS NULL OR (last_rating >= 1 AND last_rating <= 5)`
- `check_review_count_positive`: `review_count >= 0`
- `check_stability_positive`: `stability > 0`
- `check_difficulty_range`: `difficulty >= 0 AND difficulty <= 1`
- `check_lapses_positive`: `lapses >= 0`
- `check_state_range`: `state >= 0 AND state <= 3`
- `check_elapsed_days_positive`: `elapsed_days >= 0`
- `check_scheduled_days_positive`: `scheduled_days >= 0`
- `unique_session_flashcard`: UNIQUE(study_session_id, flashcard_id) – jedna fiszka może być w sesji tylko raz

**Komentarze:**

- `comment on table session_flashcards is 'Association between flashcards and study sessions with spaced repetition data using FSRS algorithm'`
- `comment on column session_flashcards.next_review_at is 'Calculated next review date based on FSRS algorithm'`
- `comment on column session_flashcards.last_rating is 'Last user rating for this flashcard (1-5 scale)'`
- `comment on column session_flashcards.stability is 'Stability value used in FSRS algorithm (from ts-fsrs library)'`
- `comment on column session_flashcards.difficulty is 'Difficulty value used in FSRS algorithm (from ts-fsrs library)'`
- `comment on column session_flashcards.review_count is 'Number of reviews (reps in FSRS)'`
- `comment on column session_flashcards.lapses is 'Number of lapses (errors) in FSRS'`
- `comment on column session_flashcards.state is 'Card state in FSRS: 0=New, 1=Learning, 2=Review, 3=Relearning'`

## 3. Relacje między tabelami

- `study_sessions.user_id` → `auth.users(id)` (ON DELETE CASCADE)
- `session_flashcards.study_session_id` → `study_sessions(id)` (ON DELETE CASCADE)
- `session_flashcards.flashcard_id` → `flashcards(id)` (ON DELETE CASCADE)

**Uwaga:** Kaskadowe usuwanie zapewnia, że usunięcie użytkownika, sesji lub fiszki automatycznie usuwa powiązane rekordy.

## 4. Indeksy

### Tabela study_sessions

- `idx_study_sessions_user_id` – indeks na `user_id` dla szybkiego filtrowania po użytkowniku
- `idx_study_sessions_started_at` – indeks na `started_at` dla sortowania i filtrowania po dacie
- `idx_study_sessions_completed_at` – indeks na `completed_at` dla zapytań dotyczących zakończonych sesji

**Komentarze:**

- `comment on index idx_study_sessions_user_id is 'Fast filtering of study sessions by user'`
- `comment on index idx_study_sessions_started_at is 'Fast sorting and filtering by session start date'`

### Tabela session_flashcards

- `idx_session_flashcards_study_session_id` – indeks na `study_session_id` dla szybkiego wyszukiwania fiszek w sesji
- `idx_session_flashcards_flashcard_id` – indeks na `flashcard_id` dla wyszukiwania historii powtórek fiszki
- `idx_session_flashcards_next_review_at` – indeks na `next_review_at` dla zapytań dotyczących fiszek wymagających powtórki
- `idx_session_flashcards_user_flashcard` – indeks złożony na `(flashcard_id, next_review_at)` dla optymalizacji zapytań o fiszki do powtórki dla użytkownika

**Komentarze:**

- `comment on index idx_session_flashcards_next_review_at is 'Fast lookup of flashcards due for review'`
- `comment on index idx_session_flashcards_user_flashcard is 'Optimized query for user flashcards due for review'`

## 5. Trigger functions

### 5.1. Automatyczna aktualizacja updated_at

Wykorzystanie istniejącej funkcji `update_updated_at_column()` dla obu nowych tabel:

```sql
create trigger update_study_sessions_updated_at
  before update on study_sessions
  for each row
  execute function update_updated_at_column();

create trigger update_session_flashcards_updated_at
  before update on session_flashcards
  for each row
  execute function update_updated_at_column();
```

## 6. Row Level Security (RLS)

### 6.1. Tabela study_sessions

**Włączenie RLS:**

```sql
alter table study_sessions enable row level security;
```

**Polityki:**

1. **study_sessions_select_authenticated**
   - Operacja: SELECT
   - Rola: authenticated
   - Warunek: `auth.uid() = user_id`
   - Cel: Użytkownicy mogą przeglądać tylko swoje sesje

2. **study_sessions_insert_authenticated**
   - Operacja: INSERT
   - Rola: authenticated
   - Warunek: `auth.uid() = user_id`
   - Cel: Użytkownicy mogą tworzyć tylko swoje sesje

3. **study_sessions_update_authenticated**
   - Operacja: UPDATE
   - Rola: authenticated
   - Warunek: `auth.uid() = user_id` (USING i WITH CHECK)
   - Cel: Użytkownicy mogą aktualizować tylko swoje sesje

4. **study_sessions_delete_authenticated**
   - Operacja: DELETE
   - Rola: authenticated
   - Warunek: `auth.uid() = user_id`
   - Cel: Użytkownicy mogą usuwać tylko swoje sesje

5. **study_sessions_anon_deny_all**
   - Operacje: SELECT, INSERT, UPDATE, DELETE
   - Rola: anon
   - Warunek: `false`
   - Cel: Brak dostępu dla anonimowych użytkowników

### 6.2. Tabela session_flashcards

**Włączenie RLS:**

```sql
alter table session_flashcards enable row level security;
```

**Polityki:**

1. **session_flashcards_select_authenticated**
   - Operacja: SELECT
   - Rola: authenticated
   - Warunek: `auth.uid() = (SELECT user_id FROM study_sessions WHERE id = study_session_id)`
   - Cel: Użytkownicy mogą przeglądać tylko powiązania z własnych sesji

2. **session_flashcards_insert_authenticated**
   - Operacja: INSERT
   - Rola: authenticated
   - Warunek: `auth.uid() = (SELECT user_id FROM study_sessions WHERE id = study_session_id)`
   - Cel: Użytkownicy mogą tworzyć powiązania tylko w swoich sesjach

3. **session_flashcards_update_authenticated**
   - Operacja: UPDATE
   - Rola: authenticated
   - Warunek: `auth.uid() = (SELECT user_id FROM study_sessions WHERE id = study_session_id)` (USING i WITH CHECK)
   - Cel: Użytkownicy mogą aktualizować tylko powiązania z własnych sesji

4. **session_flashcards_delete_authenticated**
   - Operacja: DELETE
   - Rola: authenticated
   - Warunek: `auth.uid() = (SELECT user_id FROM study_sessions WHERE id = study_session_id)`
   - Cel: Użytkownicy mogą usuwać tylko powiązania z własnych sesji

5. **session_flashcards_anon_deny_all**
   - Operacje: SELECT, INSERT, UPDATE, DELETE
   - Rola: anon
   - Warunek: `false`
   - Cel: Brak dostępu dla anonimowych użytkowników

## 7. Rozszerzenie typów TypeScript

### 7.1. Nowe typy w src/types.ts

```typescript
// Study Session DTO - odpowiada rekordowi w tabeli study_sessions
export type StudySessionDTO = Database["public"]["Tables"]["study_sessions"]["Row"];

// Session Flashcard DTO - odpowiada rekordowi w tabeli session_flashcards
export type SessionFlashcardDTO = Database["public"]["Tables"]["session_flashcards"]["Row"];

// Create Study Session Command
export interface CreateStudySessionCommand {
  userId: string; // UUID użytkownika
}

// Update Study Session Command
export interface UpdateStudySessionCommand {
  completedAt?: string; // ISO Date string
  flashcardsCount?: number;
  averageRating?: number; // 1-5
}

// Start Study Session Response
export interface StartStudySessionResponse {
  studySession: StudySessionDTO;
  flashcards: FlashcardDTO[]; // Fiszki wybrane do sesji
}

// Update Session Flashcard Command
export interface UpdateSessionFlashcardCommand {
  studySessionId: number;
  flashcardId: number;
  lastRating: number; // 1-5 (konwertowane do Rating enum FSRS)
  // Pozostałe pola są obliczane przez ts-fsrs i zapisywane automatycznie
}

// Get Study History Response
export interface GetStudyHistoryResponse {
  studySessions: StudySessionDTO[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
}

// Get Flashcards Due for Review Response
export interface GetFlashcardsDueResponse {
  flashcards: (FlashcardDTO & {
    nextReviewAt: string;
    lastRating: number | null;
    reviewCount: number;
    stability: number;
    difficulty: number;
    lapses: number;
    state: number;
  })[];
}
```

## 8. Migracja SQL

### 8.1. Nazwa pliku migracji

`supabase/migrations/YYYYMMDDHHMMSS_create_spaced_repetition_schema.sql`

### 8.2. Struktura migracji

1. Utworzenie tabeli `study_sessions` z wszystkimi kolumnami, ograniczeniami i komentarzami
2. Utworzenie tabeli `session_flashcards` z wszystkimi kolumnami, ograniczeniami i komentarzami
3. Utworzenie indeksów dla obu tabel
4. Utworzenie triggerów dla automatycznej aktualizacji `updated_at`
5. Włączenie RLS dla obu tabel
6. Utworzenie polityk RLS dla obu tabel

### 8.3. Uwagi dotyczące migracji

- Migracja powinna być idempotentna (użycie `IF NOT EXISTS` gdzie możliwe)
- Wszystkie operacje powinny być wykonywane w transakcji
- W przypadku błędów migracja powinna być wycofana (rollback)
- Po migracji należy zaktualizować typy TypeScript poprzez wygenerowanie `database.types.ts` z Supabase

## 9. Testowanie migracji

### 9.1. Testy jednostkowe struktury

- ✅ Weryfikacja utworzenia tabel z poprawnymi kolumnami
- ✅ Weryfikacja ograniczeń (constraints)
- ✅ Weryfikacja indeksów
- ✅ Weryfikacja triggerów
- ✅ Weryfikacja polityk RLS

### 9.2. Testy integracyjne

- ✅ Weryfikacja relacji między tabelami (foreign keys)
- ✅ Weryfikacja kaskadowego usuwania
- ✅ Weryfikacja działania RLS dla różnych ról użytkowników
- ✅ Weryfikacja automatycznej aktualizacji `updated_at`

## 10. Rozważania dotyczące wydajności

- **Indeksy złożone:** Indeks `(flashcard_id, next_review_at)` optymalizuje zapytania o fiszki wymagające powtórki
- **Partitioning:** W przyszłości można rozważyć partycjonowanie tabeli `session_flashcards` według daty `next_review_at` dla bardzo dużych zbiorów danych
- **Archivizacja:** Stare sesje (np. starsze niż 1 rok) można przenieść do archiwum w celu optymalizacji wydajności
