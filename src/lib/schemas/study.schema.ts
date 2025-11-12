import { z } from "zod";

export const StartStudySessionSchema = z.object({});

export const UpdateSessionFlashcardSchema = z.object({
  studySessionId: z.number().int().positive(),
  flashcardId: z.number().int().positive(),
  lastRating: z.number().int().min(1).max(5),
});

export const GetStudyHistorySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  sort_by: z.enum(["started_at", "completed_at"]).optional(),
  sort_order: z.enum(["asc", "desc"]).optional(),
});

export const CompleteStudySessionSchema = z.object({
  studySessionId: z.number().int().positive(),
  completedAt: z.string().datetime().optional(),
});
