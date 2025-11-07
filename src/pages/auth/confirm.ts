import type { APIRoute } from "astro";
import { createSupabaseServerInstance } from "../../db/supabase.client";

export const prerender = false;

/**
 * Endpoint do obsługi potwierdzenia emaila i resetowania hasła
 * Supabase przekierowuje tutaj z tokenem w parametrze URL
 */
export const GET: APIRoute = async ({ request, cookies, redirect, url }) => {
  try {
    // Extract token from URL (different formats depending on Supabase version)
    const token_hash = url.searchParams.get("token_hash");
    const type = url.searchParams.get("type");
    const code = url.searchParams.get("code"); // Legacy/alternative parameter

    // Check if we have a token
    const token = token_hash || code;

    if (!token) {
      console.error("No confirmation token found in URL");
      return redirect("/auth/login?error=no_token");
    }

    // Create Supabase server instance
    const supabase = createSupabaseServerInstance({
      cookies,
      headers: request.headers,
    });

    // Handle different confirmation types
    if (type === "recovery") {
      // Password reset flow - verify and redirect to reset password page
      const { error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: "recovery",
      });

      if (error) {
        console.error("Password recovery verification error:", error);
        return redirect(
          `/auth/forgot-password?error=verification_failed&message=${encodeURIComponent(error.message)}`
        );
      }

      // Success - redirect to reset password page
      return redirect("/auth/reset-password");
    } else {
      // Email confirmation flow (signup or email change)
      // The code parameter is a session code, not an OTP token
      // Supabase has already verified the email, we just need to exchange the code for a session
      const { error } = await supabase.auth.exchangeCodeForSession(token);

      if (error) {
        console.error("Email confirmation error:", error);
        return redirect(
          `/auth/login?error=confirmation_failed&message=${encodeURIComponent(error.message)}`
        );
      }

      // Success - user is now logged in with a valid session
      // Redirect to login with success message (or directly to dashboard)
      return redirect("/auth/login?confirmed=true");
    }
  } catch (error) {
    console.error("Unexpected error during confirmation:", error);
    return redirect("/auth/login?error=unexpected");
  }
};

