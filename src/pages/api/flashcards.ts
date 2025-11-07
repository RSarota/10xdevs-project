import type { APIRoute } from "astro";
import { z } from "zod";
import type { FlashcardDTO, BulkCreateFlashcardsResponse } from "../../types";
import { getFlashcards, createOne, createMany } from "../../lib/services/flashcards.service";
import { CreateFlashcardSchema, isBulkInput } from "../../lib/schemas/flashcard.schema";

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
 */
export const GET: APIRoute = async ({ request, locals }) => {
  try {
    // Check authentication
    const { user } = locals;
    if (!user) {
      return new Response(
        JSON.stringify({
          error: "Unauthorized",
          message: "Brak uwierzytelnienia",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const userId = user.id;

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

/**
 * POST /api/flashcards
 * Tworzy jedną lub wiele fiszek (single lub bulk).
 *
 * Request body:
 * - Wariant A (single): { front, back, source, generation_id? }
 * - Wariant B (bulk): { flashcards: [{ front, back, source, generation_id? }] }
 *
 * Zwraca:
 * - 201 Created: FlashcardDTO (single) lub BulkCreateFlashcardsResponse (bulk)
 * - 400 Bad Request: błędy walidacji
 * - 404 Not Found: generation_id nie istnieje lub nie należy do użytkownika
 * - 500 Internal Server Error: błąd serwera
 */
export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // Check authentication
    const { user } = locals;
    if (!user) {
      return new Response(
        JSON.stringify({
          error: "Unauthorized",
          message: "Brak uwierzytelnienia",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const userId = user.id;

    // 1. Parsowanie i walidacja request body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return new Response(
        JSON.stringify({
          error: "Bad Request",
          message: "Nieprawidłowy format JSON",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // 2. Walidacja przy użyciu Zod schema
    const validationResult = CreateFlashcardSchema.safeParse(body);

    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          error: "Bad Request",
          message: "Nieprawidłowe dane wejściowe",
          details: validationResult.error.issues,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const validated = validationResult.data;

    // 3. Routing: wykrycie czy single czy bulk
    if (isBulkInput(validated)) {
      // ========== BULK PATH ==========
      const result = await createMany(locals.supabase, userId, validated.flashcards);

      const response: BulkCreateFlashcardsResponse = {
        count: result.flashcards.length,
        flashcards: result.flashcards,
      };

      return new Response(JSON.stringify(response), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      // ========== SINGLE PATH ==========
      const flashcard = await createOne(locals.supabase, userId, validated);

      return new Response(JSON.stringify(flashcard), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Error in POST /api/flashcards:", error);

    // Obsługa specyficznych błędów biznesowych
    if (error instanceof Error) {
      // 404: Generation ID nie istnieje lub nie należy do użytkownika
      if (error.message.includes("Generation ID") || error.message.includes("generation_id")) {
        return new Response(
          JSON.stringify({
            error: "Not Found",
            message: error.message,
          }),
          {
            status: 404,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      // 400: Inne błędy walidacji biznesowej
      if (
        error.message.includes("walidacji") ||
        error.message.includes("validation") ||
        error.message.includes("invalid")
      ) {
        return new Response(
          JSON.stringify({
            error: "Bad Request",
            message: error.message,
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }

    // 500: Ogólny błąd serwera
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        message: "Wystąpił błąd podczas tworzenia fiszki/fiszek",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
