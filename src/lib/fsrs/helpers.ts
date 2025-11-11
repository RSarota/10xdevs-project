import { createEmptyCard, FSRS, Rating, type Card, type RecordLogItem } from "ts-fsrs";

import type { SessionFlashcardDTO } from "@/types";

const fsrsInstance = new FSRS({});

const DEFAULT_LEARNING_STEPS = 0;

export function getFsrsInstance(): FSRS {
  return fsrsInstance;
}

export function createInitialCard(now = new Date()): Card {
  const card = createEmptyCard(now);
  return {
    ...card,
    learning_steps: card.learning_steps ?? DEFAULT_LEARNING_STEPS,
  };
}

export function mapSessionFlashcardToCard(record: SessionFlashcardDTO): Card {
  return {
    due: new Date(record.next_review_at),
    stability: record.stability,
    difficulty: record.difficulty,
    elapsed_days: record.elapsed_days,
    scheduled_days: record.scheduled_days,
    learning_steps: DEFAULT_LEARNING_STEPS,
    reps: record.review_count,
    lapses: record.lapses,
    state: record.state as Card["state"],
    last_review: record.last_review ? new Date(record.last_review) : undefined,
  };
}

export function mapFsrsResultToUpdatePayload(result: RecordLogItem) {
  const { card, log } = result;
  const reviewDate =
    log.review instanceof Date
      ? log.review
      : log.review
        ? new Date(log.review as unknown as string | number | Date)
        : new Date();

  return {
    next_review_at: card.due.toISOString(),
    stability: card.stability,
    difficulty: card.difficulty,
    review_count: card.reps,
    lapses: card.lapses,
    state: card.state,
    last_review: reviewDate.toISOString(),
    elapsed_days: log.elapsed_days ?? card.elapsed_days,
    scheduled_days: log.scheduled_days ?? card.scheduled_days,
  };
}

export function convertUserRatingToFsrs(rating: number): Rating {
  if (rating <= 1) {
    return Rating.Again;
  }

  if (rating === 2) {
    return Rating.Hard;
  }

  if (rating >= 5) {
    return Rating.Easy;
  }

  return Rating.Good;
}
