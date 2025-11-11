import type { APIRoute } from "astro";
import { createSupabaseServerInstance } from "../../../db/supabase.client";

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  let supabase: ReturnType<typeof createSupabaseServerInstance> | null = null;
  try {
    // Create Supabase server instance
    supabase = createSupabaseServerInstance({
      cookies,
      headers: request.headers,
    });

    // Get all cookies before signOut to identify Supabase cookies
    const cookieHeader = request.headers.get("Cookie") || "";
    const allCookieNames = cookieHeader
      .split(";")
      .map((c) => c.trim().split("=")[0])
      .filter((name) => name && name.includes("sb-") && name.includes("-auth"));

    // Sign out - Supabase SSR should automatically clear cookies via setAll callback
    const { error } = await supabase.auth.signOut();

    if (error) {
      await supabase.flushPendingCookies();
      return new Response(
        JSON.stringify({
          error: error.message || "Wystąpił błąd podczas wylogowania",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Explicitly clear all Supabase auth cookies as a safety measure
    // This ensures cookies are cleared even if Supabase SSR doesn't handle it properly
    allCookieNames.forEach((cookieName) => {
      try {
        // Delete cookie by setting it with empty value and maxAge: 0
        cookies.delete(cookieName, {
          path: "/",
          secure: true,
          httpOnly: true,
          sameSite: "lax",
        });
      } catch (err) {
        // Ignore errors when deleting cookies (cookie might not exist)
        console.warn(`Failed to delete cookie ${cookieName}:`, err);
      }
    });

    // Success
    await supabase.flushPendingCookies();
    return new Response(
      JSON.stringify({
        success: true,
        message: "Wylogowano pomyślnie",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Logout error:", error);
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
