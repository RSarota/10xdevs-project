import type { APIRoute } from "astro";
import { z } from "zod";
import { DEFAULT_USER_ID } from "../../../db/supabase.client";
import { getGenerationById } from "../../../lib/services/generations.service";

export const prerender = false;

/**
 * Schema walidacji dla parametru id
 */
const IdParamSchema = z.number().int().positive();

/**
 * GET /api/generations/{id}
 * Pobiera szczegóły pojedynczej sesji generowania wraz z listą zaakceptowanych fiszek.
 *
 * Zwraca:
 * - 200 OK: Szczegóły generacji wraz z fiszkami
 * - 400 Bad Request: nieprawidłowy format id
 * - 404 Not Found: generacja nie istnieje lub nie należy do użytkownika
 * - 500 Internal Server Error: błąd serwera
 *
 * TODO: Tymczasowo używamy DEFAULT_USER_ID dla developmentu.
 */
export const GET: APIRoute = async ({ params, locals }) => {
  try {
    // ============================================
    // DEVELOPMENT MODE: Używamy DEFAULT_USER_ID
    // TODO: Wdrożyć pełną autoryzację (Bearer token)
    // ============================================
    const userId = DEFAULT_USER_ID;

    // 1. Walidacja parametru id
    const idParam = parseInt(params.id || "", 10);

    if (isNaN(idParam) || idParam <= 0) {
      return new Response(
        JSON.stringify({
          error: "Bad Request",
          message: "Parametr 'id' musi być dodatnią liczbą całkowitą",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const validationResult = IdParamSchema.safeParse(idParam);

    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          error: "Bad Request",
          message: "Nieprawidłowy format parametru 'id'",
          details: validationResult.error.issues,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const generationId = validationResult.data;

    // 2. Delegowanie logiki do serwisu
    const generation = await getGenerationById(locals.supabase, userId, generationId);

    // 3. Sprawdzenie czy generacja istnieje
    if (!generation) {
      return new Response(
        JSON.stringify({
          error: "Not Found",
          message: "Generacja nie istnieje lub nie należy do użytkownika",
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // 4. Zwrócenie odpowiedzi
    return new Response(JSON.stringify(generation), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in GET /api/generations/{id}:", error);

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
