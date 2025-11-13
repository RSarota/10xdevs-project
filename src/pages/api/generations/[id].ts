import type { APIRoute } from "astro";
import { z } from "zod";
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

    // 4. Return response
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
