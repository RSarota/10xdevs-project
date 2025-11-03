import { z } from "zod";

/**
 * Schema walidacji dla pojedynczej fiszki
 *
 * Wymagania:
 * - front: 1-200 znaków (wymagane, trimmed)
 * - back: 1-500 znaków (wymagane, trimmed)
 * - source: 'manual' | 'ai-full' | 'ai-edited'
 * - generation_id: wymagane dla AI ('ai-full', 'ai-edited'), zabronione dla 'manual'
 */
export const FlashcardInputSchema = z
  .object({
    front: z
      .string({ required_error: "Pole 'front' jest wymagane" })
      .min(1, "Pole 'front' nie może być puste")
      .max(200, "Pole 'front' może mieć maksymalnie 200 znaków")
      .trim()
      .refine((val) => val.length > 0, {
        message: "Pole 'front' nie może zawierać tylko białych znaków",
      }),
    back: z
      .string({ required_error: "Pole 'back' jest wymagane" })
      .min(1, "Pole 'back' nie może być puste")
      .max(500, "Pole 'back' może mieć maksymalnie 500 znaków")
      .trim()
      .refine((val) => val.length > 0, {
        message: "Pole 'back' nie może zawierać tylko białych znaków",
      }),
    source: z.enum(["manual", "ai-full", "ai-edited"], {
      required_error: "Pole 'source' jest wymagane",
      invalid_type_error: "Pole 'source' musi być jedną z wartości: 'manual', 'ai-full', 'ai-edited'",
    }),
    generation_id: z.number().int().positive().optional(),
  })
  .refine(
    (data) => {
      // Manual flashcards NIE MOGĄ mieć generation_id
      if (data.source === "manual") {
        return data.generation_id === undefined;
      }
      // AI flashcards (ai-full, ai-edited) MUSZĄ mieć generation_id
      return data.generation_id !== undefined;
    },
    {
      message: "Fiszki manualne nie mogą mieć 'generation_id', fiszki AI wymagają 'generation_id'",
      path: ["generation_id"],
    }
  );

/**
 * Schema walidacji dla bulk create (wiele fiszek jednocześnie)
 *
 * Wymagania:
 * - flashcards: tablica od 1 do 100 elementów
 * - każdy element spełnia wymagania FlashcardInputSchema
 */
export const BulkFlashcardsSchema = z.object({
  flashcards: z
    .array(FlashcardInputSchema, {
      required_error: "Pole 'flashcards' jest wymagane",
      invalid_type_error: "Pole 'flashcards' musi być tablicą",
    })
    .min(1, "Tablica 'flashcards' musi zawierać przynajmniej jeden element")
    .max(100, "Tablica 'flashcards' może zawierać maksymalnie 100 elementów"),
});

/**
 * Union schema - wykrywa automatycznie czy to single czy bulk create
 */
export const CreateFlashcardSchema = z.union([FlashcardInputSchema, BulkFlashcardsSchema]);

/**
 * Type guards do rozróżniania single vs bulk
 */
export type FlashcardInput = z.infer<typeof FlashcardInputSchema>;
export type BulkFlashcardsInput = z.infer<typeof BulkFlashcardsSchema>;
export type CreateFlashcardInput = z.infer<typeof CreateFlashcardSchema>;

export function isBulkInput(input: CreateFlashcardInput): input is BulkFlashcardsInput {
  return "flashcards" in input;
}

/**
 * Schema walidacji dla aktualizacji fiszki
 * Przynajmniej jedno pole (front lub back) musi być podane
 */
export const UpdateFlashcardSchema = z
  .object({
    front: z
      .string()
      .min(1, "Pole 'front' nie może być puste")
      .max(200, "Pole 'front' może mieć maksymalnie 200 znaków")
      .trim()
      .optional(),
    back: z
      .string()
      .min(1, "Pole 'back' nie może być puste")
      .max(500, "Pole 'back' może mieć maksymalnie 500 znaków")
      .trim()
      .optional(),
  })
  .refine((data) => data.front !== undefined || data.back !== undefined, {
    message: "Przynajmniej jedno pole (front lub back) musi być podane",
  });

export type UpdateFlashcardInput = z.infer<typeof UpdateFlashcardSchema>;

/**
 * Schema walidacji dla bulk delete
 * Tablica ID fiszek (minimum 1, maksimum 100)
 */
export const BulkDeleteFlashcardsSchema = z.object({
  flashcard_ids: z
    .array(z.number().int().positive(), {
      required_error: "Pole 'flashcard_ids' jest wymagane",
      invalid_type_error: "Pole 'flashcard_ids' musi być tablicą liczb",
    })
    .min(1, "Tablica 'flashcard_ids' musi zawierać przynajmniej jeden element")
    .max(100, "Tablica 'flashcard_ids' może zawierać maksymalnie 100 elementów"),
});

export type BulkDeleteFlashcardsInput = z.infer<typeof BulkDeleteFlashcardsSchema>;
