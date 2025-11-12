/**
 * Mock for astro:env/server
 * Used in Vitest tests since astro:env/server is an Astro virtual module
 * that's not available in the test environment
 */

export const SUPABASE_URL = process.env.SUPABASE_URL || "https://test.supabase.co";
export const SUPABASE_KEY = process.env.SUPABASE_KEY || "test-supabase-key";
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "test-api-key";
export const OPENAI_URL = process.env.OPENAI_URL || "https://test-endpoint.com/api";
