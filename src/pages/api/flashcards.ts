import type { APIRoute } from "astro";
import { z } from "zod";
import type { FlashcardDTO } from "../../types";
import { getFlashcards } from "../../lib/services/flashcards.service";
import { DEFAULT_USER_ID } from "../../db/supabase.client";

// Schemat walidacji dla parametrów zapytania
const queryParamsSchema = z.object({
  type: z.enum(["ai-full", "ai-edited", "manual"]).optional().describe("Filtracja według typu fiszki"),
  generation_id: z
    .string()
    .regex(/^\d+$/)
    .transform((val) => parseInt(val, 10))
    .optional()
    .describe("Filtracja według identyfikatora generacji"),
  page: z
    .string()
    .regex(/^\d+$/)
    .transform((val) => Math.max(1, parseInt(val, 10)))
    .default("1")
    .describe("Numer strony (domyślnie 1)"),
  limit: z
    .string()
    .regex(/^\d+$/)
    .transform((val) => Math.min(100, Math.max(1, parseInt(val, 10))))
    .default("50")
    .describe("Ilość rekordów na stronę (domyślnie 50, maksymalnie 100)"),
  sort_by: z.enum(["created_at", "updated_at"]).default("created_at").describe("Pole sortowania"),
  sort_order: z.enum(["asc", "desc"]).default("desc").describe("Kolejność sortowania"),
});

// Typ dla odpowiedzi API
interface FlashcardsResponse {
  data: FlashcardDTO[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export const prerender = false;

/**
 * GET /api/flashcards
 * Pobiera wszystkie fiszki przypisane do uwierzytelnionego użytkownika.
 * Obsługuje filtrowanie, paginację i sortowanie.
 *
 * TODO: Tymczasowo używamy DEFAULT_USER_ID dla developmentu.
 * W przyszłości zostanie wdrożona pełna autoryzacja z tokenem Bearer.
 */
export const GET: APIRoute = async ({ request, locals }) => {
  try {
    // ============================================
    // DEVELOPMENT MODE: Używamy DEFAULT_USER_ID
    // TODO: Wdrożyć pełną autoryzację (Bearer token)
    // ============================================
    const userId = DEFAULT_USER_ID;

    // 2. Walidacja parametrów zapytania
    const url = new URL(request.url);
    const rawParams = {
      type: url.searchParams.get("type") || undefined,
      generation_id: url.searchParams.get("generation_id") || undefined,
      page: url.searchParams.get("page") || "1",
      limit: url.searchParams.get("limit") || "50",
      sort_by: url.searchParams.get("sort_by") || "created_at",
      sort_order: url.searchParams.get("sort_order") || "desc",
    };

    const validationResult = queryParamsSchema.safeParse(rawParams);

    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          error: "Bad Request",
          message: "Nieprawidłowe parametry zapytania",
          details: validationResult.error.issues,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const params = validationResult.data;

    // 2. Delegowanie logiki do serwisu
    const result = await getFlashcards(locals.supabase, userId, params);

    // 3. Zwrócenie odpowiedzi
    const response: FlashcardsResponse = {
      data: result.flashcards,
      pagination: {
        page: params.page,
        limit: params.limit,
        total: result.total,
        total_pages: Math.ceil(result.total / params.limit),
      },
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in GET /api/flashcards:", error);

    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        message: "Wystąpił błąd podczas przetwarzania żądania",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
