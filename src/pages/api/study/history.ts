import type { APIRoute } from "astro";

import { GetStudyHistorySchema } from "@/lib/schemas/study.schema";
import { getStudyHistory } from "@/lib/services/study.service";

export const prerender = false;

export const GET: APIRoute = async ({ request, locals }) => {
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

    const url = new URL(request.url);
    const rawQuery = {
      page: url.searchParams.get("page") ?? undefined,
      limit: url.searchParams.get("limit") ?? undefined,
      sort_by: url.searchParams.get("sort_by") ?? undefined,
      sort_order: url.searchParams.get("sort_order") ?? undefined,
    };

    const validation = GetStudyHistorySchema.safeParse(rawQuery);
    if (!validation.success) {
      return new Response(
        JSON.stringify({
          error: "Bad Request",
          message: "Nieprawidłowe parametry zapytania",
          details: validation.error.issues,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const history = await getStudyHistory(supabase, user.id, {
      page: validation.data.page,
      limit: validation.data.limit,
      sortBy: validation.data.sort_by,
      sortOrder: validation.data.sort_order,
    });

    return new Response(JSON.stringify(history), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in GET /api/study/history:", error);

    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        message: "Nie udało się pobrać historii sesji nauki",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
