import type { APIRoute } from "astro";
import { createSupabaseServerInstance } from "../../../db/supabase.client";
import { z } from "zod";

export const prerender = false;

// Validation schema
const registerSchema = z.object({
  email: z.string().email("Nieprawidłowy format adresu e-mail"),
  password: z
    .string()
    .min(8, "Hasło musi zawierać minimum 8 znaków")
    .regex(/[A-Z]/, "Hasło musi zawierać przynajmniej jedną wielką literę")
    .regex(/[a-z]/, "Hasło musi zawierać przynajmniej jedną małą literę")
    .regex(/[0-9]/, "Hasło musi zawierać przynajmniej jedną cyfrę"),
  name: z.string().min(2, "Imię musi zawierać przynajmniej 2 znaki").trim(),
});

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validationResult = registerSchema.safeParse(body);

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

    const { email, password, name } = validationResult.data;

    // Create Supabase server instance
    const supabase = createSupabaseServerInstance({
      cookies,
      headers: request.headers,
    });

    // Attempt to sign up
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
        emailRedirectTo: `${new URL(request.url).origin}/auth/confirm`,
      },
    });

    if (error) {
      // Handle specific error cases
      if (error.message.includes("already registered") || error.message.includes("already exists")) {
        return new Response(
          JSON.stringify({
            error: "Ten adres e-mail jest już zarejestrowany",
            field: "email",
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // Generic error
      return new Response(
        JSON.stringify({
          error: error.message || "Wystąpił błąd podczas rejestracji",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Success - user needs to confirm email
    return new Response(
      JSON.stringify({
        success: true,
        message: "Wysłaliśmy link aktywacyjny na podany adres e-mail",
        user: {
          id: data.user?.id,
          email: data.user?.email,
        },
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return new Response(
      JSON.stringify({
        error: "Wystąpił błąd serwera. Spróbuj ponownie później.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

