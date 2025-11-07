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
  token: z.string().min(1, "Token resetowania hasła jest wymagany"),
});

export const POST: APIRoute = async ({ request, cookies }) => {
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

    const { password, token } = validationResult.data;

    // Create Supabase server instance
    const supabase = createSupabaseServerInstance({
      cookies,
      headers: request.headers,
    });

    // Verify the token and update the password
    const { error: verifyError } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: "recovery",
    });

    if (verifyError) {
      return new Response(
        JSON.stringify({
          error: "Link resetowania hasła wygasł lub jest nieprawidłowy. Spróbuj ponownie.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Update the password
    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      return new Response(
        JSON.stringify({
          error: updateError.message || "Wystąpił błąd podczas zmiany hasła",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Success
    return new Response(
      JSON.stringify({
        success: true,
        message: "Hasło zostało pomyślnie zmienione",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return new Response(
      JSON.stringify({
        error: "Wystąpił błąd serwera. Spróbuj ponownie później.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};


