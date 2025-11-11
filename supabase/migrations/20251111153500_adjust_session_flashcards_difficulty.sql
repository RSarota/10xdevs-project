-- Migration: Relax difficulty constraint for session_flashcards
-- Created: 2025-11-11

begin;

alter table session_flashcards
  drop constraint if exists check_difficulty_range;

alter table session_flashcards
  add constraint check_difficulty_range
    check (difficulty >= 0 and difficulty <= 10);

commit;

