/**
 * Environment variables for E2E tests
 * These are loaded from .env.test file via playwright.config.ts
 *
 * Note: SUPABASE_URL, SUPABASE_KEY, OPENAI_URL, and OPENAI_API_KEY are used by the application
 * (not directly by tests), but they need to be set for the dev server to work properly.
 */

export const env = {
  // Test user credentials (REQUIRED for authenticated tests)
  // The user must already exist in the integration database
  E2E_USERNAME: process.env.E2E_USERNAME,
  E2E_USER_PASSWORD: process.env.E2E_USER_PASSWORD,
  E2E_USERNAME_ID: process.env.E2E_USERNAME_ID, // Optional, not currently used in tests

  // Supabase configuration (used by the application, not directly by tests)
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_KEY: process.env.SUPABASE_KEY,

  // OpenAI configuration (used by the application, not directly by tests)
  OPENAI_URL: process.env.OPENAI_URL,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
};

/**
 * Validate that required environment variables are set
 * Only E2E_USERNAME and E2E_USER_PASSWORD are required for tests
 */
export function validateEnv() {
  const required = ["E2E_USERNAME", "E2E_USER_PASSWORD"];
  const missing: string[] = [];

  for (const key of required) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables in .env.test: ${missing.join(", ")}`);
  }
}

/**
 * Check if optional environment variables are set
 */
export function getOptionalEnv() {
  return {
    hasSupabase: !!(env.SUPABASE_URL && env.SUPABASE_KEY),
    hasOpenAI: !!(env.OPENAI_URL && env.OPENAI_API_KEY),
    hasUserId: !!env.E2E_USERNAME_ID,
  };
}
