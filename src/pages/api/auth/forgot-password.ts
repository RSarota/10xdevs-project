import type { APIRoute } from "astro";
import { createSupabaseServerInstance } from "../../../db/supabase.client";
import { z } from "zod";

export const prerender = false;

// Validation schema
const forgotPasswordSchema = z.object({
  email: z.string().email("Nieprawidłowy format adresu e-mail"),
});

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validationResult = forgotPasswordSchema.safeParse(body);

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

    const { email } = validationResult.data;

    // Create Supabase server instance
    const supabase = createSupabaseServerInstance({
      cookies,
      headers: request.headers,
    });

    // Send password reset email
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${new URL(request.url).origin}/auth/confirm?type=recovery`,
    });

    if (error) {
      // For security reasons, we don't reveal if the email exists or not
      // Just log the error server-side and show a generic success message to the user
      console.error("Password reset error:", error);
    }

    // Always return success to prevent email enumeration attacks
    return new Response(
      JSON.stringify({
        success: true,
        message: "Jeśli podany adres e-mail istnieje w naszym systemie, wysłaliśmy link resetujący hasło.",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return new Response(
      JSON.stringify({
        error: "Wystąpił błąd serwera. Spróbuj ponownie później.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

