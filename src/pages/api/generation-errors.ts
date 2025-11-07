import type { APIRoute } from "astro";
import { GetGenerationErrorsQuerySchema } from "../../lib/schemas/generation-error.schema";
import { getErrors } from "../../lib/services/generation-errors.service";

export const prerender = false;

/**
 * GET /api/generation-errors
 * Pobiera logi błędów z nieudanych prób generowania fiszek.
 * Endpoint do celów administracyjnych i debugowania, w MVP dostępny dla użytkownika.
 *
 * Query parameters:
 * - page: numer strony (domyślnie 1)
 * - limit: ilość rekordów na stronę (domyślnie 20, maks 50)
 * - error_code: opcjonalne filtrowanie według kodu błędu
 *
 * Zwraca:
 * - 200 OK: Lista błędów z metadanymi paginacji
 * - 400 Bad Request: błędy walidacji parametrów
 * - 500 Internal Server Error: błąd serwera
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

    // 1. Walidacja parametrów zapytania
    const url = new URL(request.url);
    const rawParams = {
      page: url.searchParams.get("page") || "1",
      limit: url.searchParams.get("limit") || "20",
      error_code: url.searchParams.get("error_code") || undefined,
    };

    const validationResult = GetGenerationErrorsQuerySchema.safeParse(rawParams);

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
    const result = await getErrors(locals.supabase, userId, params);

    // 3. Zwrócenie odpowiedzi
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in GET /api/generation-errors:", error);

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
