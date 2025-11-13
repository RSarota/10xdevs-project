import type { APIRoute } from "astro";
import { BulkDeleteFlashcardsSchema } from "../../../lib/schemas/flashcard.schema";
import { bulkDeleteFlashcards } from "../../../lib/services/flashcards.service";

export const prerender = false;

/**
 * POST /api/flashcards/bulk-delete
 * Usuwa wiele fiszek jednocześnie.
 * Zwraca liczbę faktycznie usuniętych fiszek.
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

    // Parsowanie body
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

    // Validate using Zod
    const validation = BulkDeleteFlashcardsSchema.safeParse(body);

    if (!validation.success) {
      return new Response(
        JSON.stringify({
          error: "Bad Request",
          message: "Nieprawidłowe dane wejściowe",
          details: validation.error.issues,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { flashcard_ids } = validation.data;

    // Bulk delete
    const result = await bulkDeleteFlashcards(locals.supabase, userId, flashcard_ids);

    return new Response(
      JSON.stringify({
        message: "Flashcards deleted successfully",
        deleted_count: result.deletedCount,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in POST /api/flashcards/bulk-delete:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        message: "Wystąpił błąd podczas usuwania fiszek",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
