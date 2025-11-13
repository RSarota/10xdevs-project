import type { APIRoute } from "astro";
import { z } from "zod";

export const prerender = false;

// Validation schemas
const updateProfileSchema = z.object({
  password: z
    .string()
    .min(8, "Hasło musi zawierać minimum 8 znaków")
    .regex(/[A-Z]/, "Hasło musi zawierać przynajmniej jedną wielką literę")
    .regex(/[a-z]/, "Hasło musi zawierać przynajmniej jedną małą literę")
    .regex(/[0-9]/, "Hasło musi zawierać przynajmniej jedną cyfrę")
    .optional(),
});

/**
 * GET /api/users/me
 * Pobiera profil aktualnie zalogowanego użytkownika
 */
export const GET: APIRoute = async ({ locals }) => {
  try {
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

    // Get full user data from Supabase
    const { data: userData, error } = await locals.supabase.auth.getUser();

    if (error || !userData.user) {
      return new Response(
        JSON.stringify({
          error: "Unauthorized",
          message: "Nie udało się pobrać danych użytkownika",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        id: userData.user.id,
        email: userData.user.email,
        name: userData.user.user_metadata?.name || "",
        created_at: userData.user.created_at,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in GET /api/users/me:", error);
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        message: "Wystąpił błąd podczas pobierania profilu",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

/**
 * PATCH /api/users/me
 * Aktualizuje profil aktualnie zalogowanego użytkownika
 * Możliwe pola: password (email nie może być zmieniony)
 */
export const PATCH: APIRoute = async ({ request, locals }) => {
  try {
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

    // Parse and validate request body
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

    const validationResult = updateProfileSchema.safeParse(body);

    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0];
      return new Response(
        JSON.stringify({
          error: "Bad Request",
          message: firstError.message,
          field: firstError.path[0],
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { password } = validationResult.data;

    // Prepare update data (email cannot be changed)
    const updateData: { password?: string } = {};
    if (password) updateData.password = password;

    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      return new Response(
        JSON.stringify({
          error: "Bad Request",
          message: "Brak danych do aktualizacji",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Update user in Supabase Auth
    const { data, error } = await locals.supabase.auth.updateUser(updateData);

    if (error) {
      return new Response(
        JSON.stringify({
          error: "Bad Request",
          message: error.message || "Nie udało się zaktualizować profilu",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Profil został zaktualizowany",
        user: {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || "",
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in PATCH /api/users/me:", error);
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        message: "Wystąpił błąd podczas aktualizacji profilu",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

/**
 * DELETE /api/users/me
 * Usuwa konto aktualnie zalogowanego użytkownika
 * UWAGA: To jest operacja nieodwracalna!
 */
export const DELETE: APIRoute = async ({ locals }) => {
  try {
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

    // Delete user from Supabase Auth (this will cascade delete all related data)
    // Note: Using type assertion because the function is not yet in the generated types
    const rpcResult = await (
      locals.supabase.rpc as unknown as (
        name: string
      ) => Promise<{ data: unknown; error: { code?: string; message?: string } | null }>
    )("delete_user");

    if (rpcResult.error) {
      const error = rpcResult.error;
      console.error("Error deleting user account:", error);

      // Check if RPC function doesn't exist
      if (error.code === "42883" || error.message?.includes("function") || error.message?.includes("does not exist")) {
        return new Response(
          JSON.stringify({
            error: "Internal Server Error",
            message: "Funkcja usuwania konta nie jest dostępna. Skontaktuj się z administratorem.",
          }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      // Return error with details
      return new Response(
        JSON.stringify({
          error: "Internal Server Error",
          message: error.message || "Nie można usunąć konta. Skontaktuj się z administratorem.",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Sign out user after deletion
    await locals.supabase.auth.signOut();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Konto zostało usunięte",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in DELETE /api/users/me:", error);
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        message: "Wystąpił błąd podczas usuwania konta",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
