-- Migration: Relax stability constraint for session_flashcards
-- Created: 2025-11-11

begin;

alter table session_flashcards
  drop constraint if exists check_stability_positive;

alter table session_flashcards
  add constraint check_stability_non_negative
    check (stability >= 0);

commit;

