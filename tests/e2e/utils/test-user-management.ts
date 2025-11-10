import type { APIRequestContext } from "@playwright/test";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const baseHeaders =
  SUPABASE_SERVICE_ROLE_KEY !== undefined
    ? {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
      }
    : undefined;

/**
 * Sprawdza czy admin credentials są dostępne
 * Wymagane do tworzenia i usuwania użytkowników testowych
 */
export function isSupabaseAdminConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);
}

/**
 * Tworzy potwierdzonego użytkownika testowego w Supabase
 * Wymaga SUPABASE_SERVICE_ROLE_KEY
 *
 * @param request - APIRequestContext z Playwright
 * @param label - Etykieta do generowania unikalnego emaila
 * @returns Dane utworzonego użytkownika (id, email, password)
 */
export async function createConfirmedUser(request: APIRequestContext, label: string) {
  if (!isSupabaseAdminConfigured() || !baseHeaders || !SUPABASE_URL) {
    throw new Error("Supabase admin credentials are required for this operation.");
  }

  const email = `${label}-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;
  const password = "TempUser123!";

  const response = await request.post(`${SUPABASE_URL}/auth/v1/admin/users`, {
    headers: baseHeaders,
    data: {
      email,
      password,
      email_confirm: true,
    },
  });

  if (!response.ok()) {
    throw new Error(`Failed to create temporary Supabase user: ${response.status()} ${response.statusText()}`);
  }

  const data = await response.json();
  return { id: data.id as string, email, password };
}

/**
 * Usuwa użytkownika testowego z Supabase
 * Wymaga SUPABASE_SERVICE_ROLE_KEY
 *
 * @param request - APIRequestContext z Playwright
 * @param userId - ID użytkownika do usunięcia
 */
export async function deleteUserById(request: APIRequestContext, userId: string) {
  if (!isSupabaseAdminConfigured() || !baseHeaders || !SUPABASE_URL) {
    return;
  }

  const response = await request.delete(`${SUPABASE_URL}/auth/v1/admin/users/${userId}`, {
    headers: {
      apikey: baseHeaders.apikey,
      Authorization: baseHeaders.Authorization,
    },
  });

  if (!response.ok() && response.status() !== 404) {
    throw new Error(`Failed to delete Supabase user (${userId}): ${response.status()} ${response.statusText()}`);
  }
}
