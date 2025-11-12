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
  "/api/auth/logout",
  // Public pages
  "/",
];

export const onRequest = defineMiddleware(async ({ locals, cookies, url, request, redirect }, next) => {
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
    try {
      const response = await next();
      await supabase.flushPendingCookies();
      return response;
    } catch (error) {
      console.error("Error in middleware for public path:", error);
      await supabase.flushPendingCookies();
      throw error;
    }
  }

  // Protected routes - require authentication
  try {
    // Check if this is a recovery session (should not access protected routes)
    const isRecoverySession = cookies.get("recovery_session")?.value === "true";
    if (isRecoverySession) {
      // Recovery sessions can only access password reset pages
      await supabase.flushPendingCookies();
      return redirect("/auth/reset-password");
    }

    // Get user session (Supabase SSR handles token refresh automatically)
    const {
      data: { user },
      error: getUserError,
    } = await supabase.auth.getUser();

    // Handle authentication errors
    if (getUserError) {
      console.error("Auth error in middleware:", {
        message: getUserError.message,
        status: getUserError.status,
        path: url.pathname,
      });

      // If token expired, try explicit refresh
      if (getUserError.message.includes("expired") || getUserError.message.includes("JWT")) {
        try {
          const {
            data: { session },
            error: refreshError,
          } = await supabase.auth.refreshSession();

          if (refreshError || !session) {
            console.warn("Token refresh failed:", refreshError?.message);
            await supabase.flushPendingCookies();
            return redirect("/auth/login");
          }

          // Retry getUser after successful refresh
          const {
            data: { user: refreshedUser },
            error: retryError,
          } = await supabase.auth.getUser();

          if (retryError || !refreshedUser) {
            console.warn("Failed to get user after refresh:", retryError?.message);
            await supabase.flushPendingCookies();
            return redirect("/auth/login");
          }

          // Successfully refreshed - set user in locals
          locals.user = {
            id: refreshedUser.id,
            email: refreshedUser.email || "",
            name: refreshedUser.user_metadata?.name || "",
          };
        } catch (refreshException) {
          console.error("Exception during token refresh:", refreshException);
          await supabase.flushPendingCookies();
          return redirect("/auth/login");
        }
      } else {
        // Other auth errors - redirect to login
        await supabase.flushPendingCookies();
        return redirect("/auth/login");
      }
    } else if (user) {
      // User is authenticated - store user info in locals
      locals.user = {
        id: user.id,
        email: user.email || "",
        name: user.user_metadata?.name || "",
      };
    } else {
      // No user and no error - session expired or invalid
      await supabase.flushPendingCookies();
      return redirect("/auth/login");
    }

    // Continue to protected route
    const response = await next();
    await supabase.flushPendingCookies();
    return response;
  } catch (error) {
    // Handle unexpected errors in middleware
    console.error("Unexpected error in middleware:", {
      error: error instanceof Error ? error.message : String(error),
      path: url.pathname,
      stack: error instanceof Error ? error.stack : undefined,
    });

    await supabase.flushPendingCookies();
    return redirect("/auth/login");
  }
});
