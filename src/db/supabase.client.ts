import { createClient } from "@supabase/supabase-js";
import { createServerClient, type CookieOptionsWithName } from "@supabase/ssr";
import type { AstroCookies, AstroCookieSetOptions } from "astro";

import type { Database } from "./database.types";
import { getServerEnv } from "../lib/env.server";

// Lazy initialization - get values at runtime, not at module load time
// This ensures process.env is available (from Azure Web App) when the module is imported
let _supabaseClient: ReturnType<typeof createClient<Database>> | null = null;

function getSupabaseClient(): ReturnType<typeof createClient<Database>> {
  if (!_supabaseClient) {
    const url = getServerEnv("SUPABASE_URL");
    const key = getServerEnv("SUPABASE_KEY");
    _supabaseClient = createClient<Database>(url, key);
  }
  return _supabaseClient;
}

// Legacy client for non-SSR contexts (will be phased out)
// Using Proxy to ensure values are read at runtime, not at module load time
// This allows process.env (from Azure Web App) to be available when the client is actually used
export const supabaseClient = new Proxy({} as ReturnType<typeof createClient<Database>>, {
  get(_target, prop) {
    const client = getSupabaseClient();
    const value = client[prop as keyof typeof client];
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  },
});

export type SupabaseClient = ReturnType<typeof createSupabaseServerInstance>;

// Cookie options for Supabase Auth
export const cookieOptions: CookieOptionsWithName = {
  path: "/",
  secure: true,
  httpOnly: true,
  sameSite: "lax",
};

// Helper function to parse cookie header
function parseCookieHeader(cookieHeader: string): { name: string; value: string }[] {
  return cookieHeader
    .split(";")
    .map((cookie) => {
      const trimmed = cookie.trim();
      if (!trimmed) {
        return null;
      }

      const [name, ...rest] = trimmed.split("=");
      if (!name) {
        return null;
      }

      return { name: name.trim(), value: rest.join("=") };
    })
    .filter((entry): entry is { name: string; value: string } => Boolean(entry?.name));
}

/**
 * Creates a Supabase server client with SSR support
 * Use this in Astro pages and API routes for proper session management
 */
export const createSupabaseServerInstance = (context: { headers: Headers; cookies: AstroCookies }) => {
  const pendingCookies = new Map<string, { value: string; options?: AstroCookieSetOptions }>();

  const supabase = createServerClient<Database>(getServerEnv("SUPABASE_URL"), getServerEnv("SUPABASE_KEY"), {
    cookieOptions,
    cookies: {
      getAll() {
        return parseCookieHeader(context.headers.get("Cookie") ?? "");
      },
      setAll(cookiesToSet: { name: string; value: string; options: Record<string, unknown> }[]) {
        cookiesToSet.forEach(({ name, value, options }) => {
          if (!name) {
            return;
          }

          pendingCookies.set(name, {
            value,
            options: options as AstroCookieSetOptions,
          });
        });
      },
    },
  });

  const flushPendingCookies = async () => {
    if (pendingCookies.size === 0) {
      return;
    }

    for (const [name, { value, options }] of pendingCookies) {
      context.cookies.set(name, value, options);
    }

    pendingCookies.clear();
  };

  return Object.assign(supabase, {
    flushPendingCookies,
  });
};
