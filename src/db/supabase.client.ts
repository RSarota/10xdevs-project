import { createClient } from "@supabase/supabase-js";
import { createServerClient, type CookieOptionsWithName } from "@supabase/ssr";
import type { AstroCookies, AstroCookieSetOptions } from "astro";

import type { Database } from "./database.types";
import { getServerEnv } from "../lib/env.server";

const supabaseUrl = getServerEnv("SUPABASE_URL");
const supabaseAnonKey = getServerEnv("SUPABASE_KEY");

// Legacy client for non-SSR contexts (will be phased out)
export const supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey);

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
