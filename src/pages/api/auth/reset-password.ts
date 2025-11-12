import type { APIRoute } from "astro";
import { createSupabaseServerInstance } from "../../../db/supabase.client";
import { z } from "zod";

export const prerender = false;

// Validation schema
const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "Hasło musi zawierać minimum 8 znaków")
    .regex(/[A-Z]/, "Hasło musi zawierać przynajmniej jedną wielką literę")
    .regex(/[a-z]/, "Hasło musi zawierać przynajmniej jedną małą literę")
    .regex(/[0-9]/, "Hasło musi zawierać przynajmniej jedną cyfrę"),
});

export const POST: APIRoute = async ({ request, cookies }) => {
  let supabase: ReturnType<typeof createSupabaseServerInstance> | null = null;
  try {
    // Parse and validate request body
    const body = await request.json();
    const validationResult = resetPasswordSchema.safeParse(body);

    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0];
      return new Response(
        JSON.stringify({
          error: firstError.message,
          field: firstError.path[0],
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { password } = validationResult.data;

    // Create Supabase server instance
    supabase = createSupabaseServerInstance({
      cookies,
      headers: request.headers,
    });

    // Check if user is authenticated (should have session from email link)
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      await supabase.flushPendingCookies();
      return new Response(
        JSON.stringify({
          error: "Sesja wygasła. Spróbuj ponownie zresetować hasło.",
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Update user password
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      console.error("Password update error:", error);
      await supabase.flushPendingCookies();
      return new Response(
        JSON.stringify({
          error: error.message || "Wystąpił błąd podczas zmiany hasła",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Clear recovery session flag and invalidate recovery session
    cookies.delete("recovery_session", {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });

    // Sign out to invalidate the recovery session
    await supabase.auth.signOut();

    // Success
    await supabase.flushPendingCookies();
    return new Response(
      JSON.stringify({
        success: true,
        message: "Hasło zostało pomyślnie zmienione",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Reset password error:", error);
    if (supabase) {
      await supabase.flushPendingCookies();
    }
    return new Response(
      JSON.stringify({
        error: "Wystąpił błąd serwera. Spróbuj ponownie później.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
