import type { APIRoute } from "astro";

import { StartStudySessionSchema } from "@/lib/schemas/study.schema";
import { startStudySession } from "@/lib/services/study.service";

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const { user, supabase } = locals;

    // Security: userId must come from authenticated session, never from request body
    if (!user?.id) {
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

    const userId = user.id;

    const body = await request.json().catch(() => ({}));
    const validation = StartStudySessionSchema.safeParse(body);

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

    const response = await startStudySession(supabase, userId);

    return new Response(JSON.stringify(response), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in POST /api/study/start:", error);

    const message = error instanceof Error ? error.message : "Nie udało się rozpocząć sesji nauki";
    const status = message.includes("Brak fiszek") ? 404 : 500;

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
