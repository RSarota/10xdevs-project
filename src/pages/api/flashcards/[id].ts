import type { APIRoute } from "astro";
import { z } from "zod";
import { getFlashcardById, updateFlashcard, deleteFlashcard } from "../../../lib/services/flashcards.service";

// Schema walidacji dla parametru id
const idParamSchema = z.coerce.number().int().positive({
  message: "ID musi być liczbą dodatnią",
});

export const prerender = false;

/**
 * GET /api/flashcards/{id}
 * Pobiera pojedynczą fiszkę na podstawie ID.
 * Weryfikuje ownership (czy fiszka należy do użytkownika).
 */
export const GET: APIRoute = async ({ params, locals }) => {
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

    // Walidacja parametru id
    const validationResult = idParamSchema.safeParse(params.id);

    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          error: "Bad Request",
          message: "Nieprawidłowy format ID",
          details: validationResult.error.issues,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const flashcardId = validationResult.data;

    // Pobranie fiszki
    const flashcard = await getFlashcardById(locals.supabase, userId, flashcardId);

    if (!flashcard) {
      return new Response(
        JSON.stringify({
          error: "Not Found",
          message: "Fiszka nie istnieje lub nie należy do użytkownika",
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify(flashcard), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in GET /api/flashcards/[id]:", {
      error: error instanceof Error ? error.message : String(error),
      flashcardId: params.id,
      stack: error instanceof Error ? error.stack : undefined,
    });

    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        message: "Wystąpił błąd podczas pobierania fiszki",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

/**
 * PATCH /api/flashcards/{id}
 * Aktualizuje istniejącą fiszkę (front i/lub back).
 */
export const PATCH: APIRoute = async ({ params, request, locals }) => {
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

    // Walidacja parametru id
    const idValidation = idParamSchema.safeParse(params.id);

    if (!idValidation.success) {
      return new Response(
        JSON.stringify({
          error: "Bad Request",
          message: "Nieprawidłowy format ID",
          details: idValidation.error.issues,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const flashcardId = idValidation.data;

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

    // Aktualizacja fiszki
    const updatedFlashcard = await updateFlashcard(locals.supabase, userId, flashcardId, body);

    return new Response(JSON.stringify(updatedFlashcard), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in PATCH /api/flashcards/[id]:", {
      error: error instanceof Error ? error.message : String(error),
      flashcardId: params.id,
      stack: error instanceof Error ? error.stack : undefined,
    });

    if (error instanceof Error) {
      // 404: Fiszka nie istnieje
      if (error.message.includes("nie istnieje") || error.message.includes("not found")) {
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

      // 400: Validation error
      if (error.message.includes("walidacji") || error.message.includes("validation")) {
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

    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        message: "Wystąpił błąd podczas aktualizacji fiszki",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

/**
 * DELETE /api/flashcards/{id}
 * Usuwa fiszkę.
 */
export const DELETE: APIRoute = async ({ params, locals }) => {
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

    // Walidacja parametru id
    const idValidation = idParamSchema.safeParse(params.id);

    if (!idValidation.success) {
      return new Response(
        JSON.stringify({
          error: "Bad Request",
          message: "Nieprawidłowy format ID",
          details: idValidation.error.issues,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const flashcardId = idValidation.data;

    // Delete flashcard
    const result = await deleteFlashcard(locals.supabase, userId, flashcardId);

    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: "Not Found",
          message: "Fiszka nie istnieje lub nie należy do użytkownika",
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        message: "Flashcard deleted successfully",
        id: result.deletedId,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in DELETE /api/flashcards/[id]:", {
      error: error instanceof Error ? error.message : String(error),
      flashcardId: params.id,
      stack: error instanceof Error ? error.stack : undefined,
    });

    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        message: "Wystąpił błąd podczas usuwania fiszki",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
