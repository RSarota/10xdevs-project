import { defineMiddleware } from "astro:middleware";
import { createSupabaseServerInstance } from "../db/supabase.client";

// Public paths that don't require authentication
const PUBLIC_PATHS = [
  // Auth pages
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/confirm",
  // Auth API endpoints
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/forgot-password",
  "/api/auth/reset-password",
  // Public pages
  "/",
  "/logo-preview",
];

export const onRequest = defineMiddleware(
  async ({ locals, cookies, url, request, redirect }, next) => {
    // Create Supabase server instance with SSR support
    const supabase = createSupabaseServerInstance({
      cookies,
      headers: request.headers,
    });

    // Store supabase instance in locals
    locals.supabase = supabase;

    // Skip auth check for public paths
    const isPublicPath = PUBLIC_PATHS.some((path) => url.pathname === path);
    if (isPublicPath) {
      return next();
    }

    // Get user session
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      // User is authenticated - store user info in locals
      locals.user = {
        id: user.id,
        email: user.email || "",
        name: user.user_metadata?.name || "",
      };
    } else {
      // User is not authenticated - redirect to login for protected routes
      return redirect("/auth/login");
    }

    return next();
  }
);
