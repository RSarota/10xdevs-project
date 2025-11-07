import type { APIRoute } from "astro";
import { createSupabaseServerInstance } from "../../../db/supabase.client";
import { z } from "zod";

export const prerender = false;

// Validation schema
const loginSchema = z.object({
  email: z.string().email("Nieprawidłowy format adresu e-mail"),
  password: z.string().min(6, "Hasło musi zawierać minimum 6 znaków"),
});

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validationResult = loginSchema.safeParse(body);

    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0];
      return new Response(
        JSON.stringify({ 
          error: firstError.message,
          field: firstError.path[0] 
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { email, password } = validationResult.data;

    // Create Supabase server instance
    const supabase = createSupabaseServerInstance({
      cookies,
      headers: request.headers,
    });

    // Attempt to sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Handle specific error cases
      if (error.message.includes("Email not confirmed")) {
        return new Response(
          JSON.stringify({
            error: "Adres e-mail nie został potwierdzony. Sprawdź swoją skrzynkę e-mail.",
            code: "email_not_confirmed",
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      if (error.message.includes("Invalid login credentials")) {
        return new Response(
          JSON.stringify({
            error: "Nieprawidłowy e-mail lub hasło",
          }),
          { status: 401, headers: { "Content-Type": "application/json" } }
        );
      }

      // Generic error
      return new Response(
        JSON.stringify({
          error: error.message || "Wystąpił błąd podczas logowania",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Success
    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email,
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Login error:", error);
    return new Response(
      JSON.stringify({
        error: "Wystąpił błąd serwera. Spróbuj ponownie później.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};


