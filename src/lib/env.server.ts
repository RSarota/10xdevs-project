type ServerEnvKey = "SUPABASE_URL" | "SUPABASE_KEY" | "OPENAI_API_KEY" | "OPENAI_URL";

function readProcessEnv(key: ServerEnvKey): string | undefined {
  // Check if we're in a Node.js environment
  try {
    if (typeof process === "undefined" || !process.env) {
      return undefined;
    }

    const value = process.env[key];
    if (!value || typeof value !== "string") {
      return undefined;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  } catch {
    // process.env might not be available in all contexts
    return undefined;
  }
}

function readImportMetaEnv(key: ServerEnvKey): string | undefined {
  try {
    const value = import.meta.env[key];
    // Check if value exists and is not an empty string
    // Empty strings might be embedded during build if env vars weren't available
    if (!value || typeof value !== "string" || value.trim().length === 0) {
      return undefined;
    }

    return value.trim();
  } catch {
    // import.meta.env might not be available in all contexts
    return undefined;
  }
}

export function getServerEnv(key: ServerEnvKey): string {
  // First try runtime environment (process.env) - available in production (Azure Web App)
  const runtimeValue = readProcessEnv(key);
  if (runtimeValue) {
    return runtimeValue;
  }

  // Fallback to build-time environment (import.meta.env) - available in dev/build
  const buildTimeValue = readImportMetaEnv(key);
  if (buildTimeValue) {
    return buildTimeValue;
  }

  // Neither source has the variable - throw error with helpful message
  const isProduction = typeof process !== "undefined" && process.env?.NODE_ENV === "production";
  const errorMessage = isProduction
    ? `Missing environment variable: ${key}. Ensure it is configured in Azure Web App settings (Configuration > Application settings).`
    : `Missing environment variable: ${key}. Ensure it is configured in .env file.`;

  throw new Error(errorMessage);
}
