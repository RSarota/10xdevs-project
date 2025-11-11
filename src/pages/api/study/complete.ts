import type { APIRoute } from "astro";

import { CompleteStudySessionSchema } from "@/lib/schemas/study.schema";
import { completeStudySession } from "@/lib/services/study.service";

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

    const validation = CompleteStudySessionSchema.safeParse(body);
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

    const session = await completeStudySession(
      supabase,
      user.id,
      validation.data.studySessionId,
      validation.data.completedAt
    );

    return new Response(
      JSON.stringify({
        message: "Sesja zakończona",
        studySession: session,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in PUT /api/study/complete:", error);

    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        message: "Nie udało się zakończyć sesji nauki",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
