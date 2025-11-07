import type { APIRoute } from "astro";
import { getUserStatistics } from "../../../../lib/services/statistics.service";

export const prerender = false;

/**
 * GET /api/users/me/statistics
 * Pobiera kompleksowe statystyki dla uwierzytelnionego użytkownika.
 *
 * Statystyki obejmują:
 * - Liczba fiszek (ogółem i według typu: manual, ai-full, ai-edited)
 * - Liczba sesji generowania AI
 * - Liczba wygenerowanych propozycji
 * - Liczba zaakceptowanych fiszek
 * - Wskaźnik akceptacji (acceptance_rate w %)
 * - Wskaźnik edycji (edit_rate w %)
 *
 * Zwraca:
 * - 200 OK: Statystyki użytkownika
 * - 500 Internal Server Error: błąd serwera
 */
export const GET: APIRoute = async ({ locals }) => {
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

    // Delegowanie logiki do serwisu
    const statistics = await getUserStatistics(locals.supabase, userId);

    // Zwrócenie odpowiedzi
    return new Response(JSON.stringify(statistics), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in GET /api/users/me/statistics:", error);

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
