import { z } from "zod";

/**
 * Schema walidacji dla query parameters GET /api/generation-errors
 *
 * Wymagania:
 * - page: >= 1 (domyślnie 1)
 * - limit: 1-50 (domyślnie 20)
 * - error_code: opcjonalny string (niepusty)
 */
export const GetGenerationErrorsQuerySchema = z.object({
  page: z
    .string()
    .regex(/^\d+$/)
    .transform((val) => Math.max(1, parseInt(val, 10)))
    .default("1")
    .describe("Numer strony (domyślnie 1)"),
  limit: z
    .string()
    .regex(/^\d+$/)
    .transform((val) => Math.min(50, Math.max(1, parseInt(val, 10))))
    .default("20")
    .describe("Ilość rekordów na stronę (domyślnie 20, maksymalnie 50)"),
  error_code: z
    .string()
    .min(1, "Pole 'error_code' nie może być puste")
    .optional()
    .describe("Filtracja według kodu błędu (opcjonalne)"),
});

export type GetGenerationErrorsQueryInput = z.infer<typeof GetGenerationErrorsQuerySchema>;
