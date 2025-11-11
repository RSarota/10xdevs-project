-- Migration: Create study sessions and session flashcards tables for spaced repetition
-- Purpose: Introduce spaced repetition data model supporting FSRS algorithm
-- Created: 2025-11-11

-- ============================================================================
-- TABLES
-- ============================================================================

create table study_sessions (
  id bigserial primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  flashcards_count integer not null default 0,
  average_rating numeric(3, 2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint check_flashcards_count_positive check (flashcards_count >= 0),
  constraint check_average_rating_range check (
    average_rating is null
    or (average_rating >= 1.0 and average_rating <= 5.0)
  ),
  constraint check_completed_after_started check (
    completed_at is null or completed_at >= started_at
  )
);

comment on table study_sessions is 'User study sessions for spaced repetition learning';
comment on column study_sessions.user_id is 'Reference to the user who started the session';
comment on column study_sessions.flashcards_count is 'Total number of flashcards reviewed in this session';
comment on column study_sessions.average_rating is 'Average rating of flashcards in this session (1-5 scale)';

create table session_flashcards (
  id bigserial primary key,
  study_session_id bigint not null references study_sessions (id) on delete cascade,
  flashcard_id bigint not null references flashcards (id) on delete cascade,
  next_review_at timestamptz not null,
  last_rating integer,
  review_count integer not null default 0,
  stability numeric(10, 6) not null,
  difficulty numeric(10, 6) not null,
  lapses integer not null default 0,
  state integer not null default 0,
  last_review timestamptz,
  elapsed_days integer not null default 0,
  scheduled_days integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint check_last_rating_range check (
    last_rating is null or (last_rating >= 1 and last_rating <= 5)
  ),
  constraint check_review_count_positive check (review_count >= 0),
  constraint check_stability_positive check (stability > 0),
  constraint check_difficulty_range check (difficulty >= 0 and difficulty <= 1),
  constraint check_lapses_positive check (lapses >= 0),
  constraint check_state_range check (state >= 0 and state <= 3),
  constraint check_elapsed_days_positive check (elapsed_days >= 0),
  constraint check_scheduled_days_positive check (scheduled_days >= 0),
  constraint unique_session_flashcard unique (study_session_id, flashcard_id)
);

comment on table session_flashcards is 'Association between flashcards and study sessions with spaced repetition data using FSRS algorithm';
comment on column session_flashcards.next_review_at is 'Calculated next review date based on FSRS algorithm';
comment on column session_flashcards.last_rating is 'Last user rating for this flashcard (1-5 scale)';
comment on column session_flashcards.stability is 'Stability value used in FSRS algorithm (from ts-fsrs library)';
comment on column session_flashcards.difficulty is 'Difficulty value used in FSRS algorithm (from ts-fsrs library)';
comment on column session_flashcards.review_count is 'Number of reviews (reps in FSRS)';
comment on column session_flashcards.lapses is 'Number of lapses (errors) in FSRS';
comment on column session_flashcards.state is 'Card state in FSRS: 0=New, 1=Learning, 2=Review, 3=Relearning';

-- ============================================================================
-- INDEXES
-- ============================================================================

create index idx_study_sessions_user_id on study_sessions (user_id);
comment on index idx_study_sessions_user_id is 'Fast filtering of study sessions by user';

create index idx_study_sessions_started_at on study_sessions (started_at);
comment on index idx_study_sessions_started_at is 'Fast sorting and filtering by session start date';

create index idx_study_sessions_completed_at on study_sessions (completed_at);
comment on index idx_study_sessions_completed_at is 'Fast sorting and filtering by session completion date';

create index idx_session_flashcards_study_session_id on session_flashcards (study_session_id);
comment on index idx_session_flashcards_study_session_id is 'Fast lookup of flashcards by study session';

create index idx_session_flashcards_flashcard_id on session_flashcards (flashcard_id);
comment on index idx_session_flashcards_flashcard_id is 'Fast lookup of sessions for a specific flashcard';

create index idx_session_flashcards_next_review_at on session_flashcards (next_review_at);
comment on index idx_session_flashcards_next_review_at is 'Fast lookup of flashcards due for review';

create index idx_session_flashcards_flashcard_due on session_flashcards (flashcard_id, next_review_at);
comment on index idx_session_flashcards_flashcard_due is 'Optimized query for user flashcards due for review';

-- ============================================================================
-- TRIGGERS
-- ============================================================================

create trigger update_study_sessions_updated_at
  before update on study_sessions
  for each row
  execute function update_updated_at_column();

create trigger update_session_flashcards_updated_at
  before update on session_flashcards
  for each row
  execute function update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

alter table study_sessions enable row level security;
alter table session_flashcards enable row level security;

create policy study_sessions_select_authenticated
  on study_sessions
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy study_sessions_insert_authenticated
  on study_sessions
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy study_sessions_update_authenticated
  on study_sessions
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy study_sessions_delete_authenticated
  on study_sessions
  for delete
  to authenticated
  using (auth.uid() = user_id);

create policy session_flashcards_select_authenticated
  on session_flashcards
  for select
  to authenticated
  using (
    auth.uid() = (
      select user_id from study_sessions where id = session_flashcards.study_session_id
    )
  );

create policy session_flashcards_insert_authenticated
  on session_flashcards
  for insert
  to authenticated
  with check (
    auth.uid() = (
      select user_id from study_sessions where id = session_flashcards.study_session_id
    )
  );

create policy session_flashcards_update_authenticated
  on session_flashcards
  for update
  to authenticated
  using (
    auth.uid() = (
      select user_id from study_sessions where id = session_flashcards.study_session_id
    )
  )
  with check (
    auth.uid() = (
      select user_id from study_sessions where id = session_flashcards.study_session_id
    )
  );

create policy session_flashcards_delete_authenticated
  on session_flashcards
  for delete
  to authenticated
  using (
    auth.uid() = (
      select user_id from study_sessions where id = session_flashcards.study_session_id
    )
  );

