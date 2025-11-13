/**
 * Requires authentication and returns the authenticated user.
 * Throws a Response that should be returned from the API route.
 *
 * @param locals - Astro locals containing user and supabase instance
 * @returns The authenticated user object
 * @throws Response with 401 status if user is not authenticated
 */
export function requireAuth(locals: App.Locals) {
  if (!locals.user?.id) {
    throw new Response(
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

  return locals.user;
}

/**
 * Gets the authenticated user or returns null.
 * Does not throw, useful for optional authentication scenarios.
 *
 * @param locals - Astro locals containing user and supabase instance
 * @returns The authenticated user object or null
 */
export function getAuthUser(locals: App.Locals) {
  return locals.user ?? null;
}
