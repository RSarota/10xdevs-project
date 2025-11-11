import type { APIRoute } from "astro";

import { UpdateSessionFlashcardSchema } from "@/lib/schemas/study.schema";
import { updateSessionFlashcard } from "@/lib/services/study.service";

export const prerender = false;

export const PUT: APIRoute = async ({ request, locals }) => {
  try {
    const { user, supabase } = locals;

    if (!user) {
      return new Response(
        JSON.stringify({
          error: "Unauthorized",
          message: "Brak uwierzytelnienia użytkownika",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return new Response(
        JSON.stringify({
          error: "Bad Request",
          message: "Nieprawidłowy format danych",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const validation = UpdateSessionFlashcardSchema.safeParse(body);
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

    const sessionFlashcard = await updateSessionFlashcard(supabase, user.id, validation.data);

    return new Response(
      JSON.stringify({
        message: "Sesja została zaktualizowana",
        sessionFlashcard,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in PUT /api/study/update:", error);

    const message = error instanceof Error ? error.message : "Błąd podczas aktualizacji sesji nauki";
    const status = message.includes("nie istnieje") || message.includes("nie została znaleziona") ? 404 : 500;

    return new Response(
      JSON.stringify({
        error: status === 404 ? "Not Found" : "Internal Server Error",
        message,
      }),
      {
        status,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
