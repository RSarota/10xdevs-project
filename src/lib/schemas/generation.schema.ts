import { z } from "zod";

/**
 * Schema walidacji dla GenerateFlashcardsCommand
 *
 * Wymagania:
 * - source_text: 1000-10000 znaków (wymagane, trimmed)
 * - Nie może składać się tylko z białych znaków
 */
export const GenerateFlashcardsSchema = z.object({
  source_text: z
    .string({ required_error: "Pole 'source_text' jest wymagane" })
    .min(1000, "Pole 'source_text' musi zawierać przynajmniej 1000 znaków")
    .max(10000, "Pole 'source_text' może mieć maksymalnie 10000 znaków")
    .trim()
    .refine((val) => val.length >= 1000, {
      message: "Pole 'source_text' po usunięciu białych znaków musi zawierać przynajmniej 1000 znaków",
    })
    .refine((val) => val.replace(/\s/g, "").length > 0, {
      message: "Pole 'source_text' nie może składać się tylko z białych znaków",
    }),
});

export type GenerateFlashcardsInput = z.infer<typeof GenerateFlashcardsSchema>;

/**
 * Schema walidacji dla query parameters GET /api/generations
 *
 * Wymagania:
 * - page: >= 1 (domyślnie 1)
 * - limit: 1-50 (domyślnie 20)
 * - sort_order: "asc" lub "desc" (domyślnie "desc")
 */
export const GetGenerationsQuerySchema = z.object({
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
  sort_order: z.enum(["asc", "desc"]).default("desc").describe("Kolejność sortowania (domyślnie desc)"),
});

export type GetGenerationsQueryInput = z.infer<typeof GetGenerationsQuerySchema>;
