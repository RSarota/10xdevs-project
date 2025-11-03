import type { APIRoute } from "astro";
import { DEFAULT_USER_ID } from "../../db/supabase.client";
import { GenerateFlashcardsSchema, GetGenerationsQuerySchema } from "../../lib/schemas/generation.schema";
import { createGeneration, logGenerationError, getGenerations } from "../../lib/services/generations.service";
import { AIServiceError } from "../../lib/services/ai.service";
import { calculateHash } from "../../lib/utils/hash";

export const prerender = false;

/**
 * GET /api/generations
 * Pobiera historię sesji generowania fiszek dla uwierzytelnionego użytkownika.
 * Obsługuje paginację i sortowanie.
 *
 * Query parameters:
 * - page: numer strony (domyślnie 1)
 * - limit: ilość rekordów na stronę (domyślnie 20, maks 50)
 * - sort_order: kolejność sortowania "asc" | "desc" (domyślnie "desc")
 *
 * Zwraca:
 * - 200 OK: Lista generacji z metadanymi paginacji
 * - 400 Bad Request: błędy walidacji parametrów
 * - 500 Internal Server Error: błąd serwera
 *
 * TODO: Tymczasowo używamy DEFAULT_USER_ID dla developmentu.
 */
export const GET: APIRoute = async ({ request, locals }) => {
  try {
    // ============================================
    // DEVELOPMENT MODE: Używamy DEFAULT_USER_ID
    // TODO: Wdrożyć pełną autoryzację (Bearer token)
    // ============================================
    const userId = DEFAULT_USER_ID;

    // 1. Walidacja parametrów zapytania
    const url = new URL(request.url);
    const rawParams = {
      page: url.searchParams.get("page") || "1",
      limit: url.searchParams.get("limit") || "20",
      sort_order: url.searchParams.get("sort_order") || "desc",
    };

    const validationResult = GetGenerationsQuerySchema.safeParse(rawParams);

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
    const result = await getGenerations(locals.supabase, userId, params);

    // 3. Zwrócenie odpowiedzi
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in GET /api/generations:", error);

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
 * POST /api/generations
 * Generuje propozycje fiszek przy użyciu AI na podstawie tekstu źródłowego.
 *
 * Request body:
 * - source_text: string (1000-10000 znaków)
 *
 * Zwraca:
 * - 201 Created: GenerateFlashcardsResponse (generation_id, proposals, metadata)
 * - 400 Bad Request: błędy walidacji
 * - 429 Too Many Requests: przekroczony rate limit
 * - 503 Service Unavailable: AI service niedostępny
 * - 500 Internal Server Error: błąd serwera
 *
 * TODO: Tymczasowo używamy DEFAULT_USER_ID dla developmentu.
 * W przyszłości zostanie wdrożona pełna autoryzacja z tokenem Bearer.
 */
export const POST: APIRoute = async ({ request, locals }) => {
  let sourceTextHash: string | undefined;
  let sourceTextLength: number | undefined;

  try {
    // ============================================
    // DEVELOPMENT MODE: Używamy DEFAULT_USER_ID
    // TODO: Wdrożyć pełną autoryzację (Bearer token)
    // ============================================
    const userId = DEFAULT_USER_ID;

    // 1. Parsowanie request body
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
    const validationResult = GenerateFlashcardsSchema.safeParse(body);

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

    const { source_text } = validationResult.data;

    // 3. Obliczenie metadanych dla logowania błędów
    sourceTextHash = await calculateHash(source_text);
    sourceTextLength = source_text.length;

    // 4. Wywołanie serwisu generowania
    const result = await createGeneration(locals.supabase, userId, source_text);

    // 5. Zwrócenie odpowiedzi 201 Created
    return new Response(JSON.stringify(result), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in POST /api/generations:", error);

    // Obsługa błędów AI Service
    if (error instanceof AIServiceError) {
      // Logowanie błędu do bazy danych
      if (sourceTextHash && sourceTextLength) {
        await logGenerationError(
          locals.supabase,
          DEFAULT_USER_ID,
          sourceTextHash,
          sourceTextLength,
          error.code,
          error.message
        );
      }

      // Mapowanie błędów AI na odpowiednie kody HTTP
      return new Response(
        JSON.stringify({
          error: error.code === "RATE_LIMIT_EXCEEDED" ? "Too Many Requests" : "Service Unavailable",
          message: "Usługa AI jest tymczasowo niedostępna. Spróbuj ponownie później.",
        }),
        {
          status: error.statusCode,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Logowanie innych błędów
    if (sourceTextHash && sourceTextLength) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      await logGenerationError(
        locals.supabase,
        DEFAULT_USER_ID,
        sourceTextHash,
        sourceTextLength,
        "INTERNAL_ERROR",
        errorMessage
      );
    }

    // 500: Ogólny błąd serwera
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        message: "Wystąpił błąd podczas generowania fiszek",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
