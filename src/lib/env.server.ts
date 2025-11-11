type ServerEnvKey = "SUPABASE_URL" | "SUPABASE_KEY" | "OPENAI_API_KEY" | "OPENAI_URL";

function readProcessEnv(key: ServerEnvKey): string | undefined {
  // Check if we're in a Node.js environment
  try {
    if (typeof process === "undefined" || !process.env) {
      return undefined;
    }

    const value = process.env[key];

    // Check if value exists and is a non-empty string
    if (!value || typeof value !== "string") {
      return undefined;
    }

    const trimmed = value.trim();
    if (trimmed.length === 0) {
      return undefined;
    }

    return trimmed;
  } catch {
    // process.env might not be available in all contexts
    return undefined;
  }
}

function readImportMetaEnv(key: ServerEnvKey): string | undefined {
  try {
    // Vite/Astro statically analyze import.meta.env at build time
    // Only direct property access works, not dynamic bracket notation
    let value: string | undefined;
    switch (key) {
      case "SUPABASE_URL":
        value = import.meta.env.SUPABASE_URL;
        break;
      case "SUPABASE_KEY":
        value = import.meta.env.SUPABASE_KEY;
        break;
      case "OPENAI_API_KEY":
        value = import.meta.env.OPENAI_API_KEY;
        break;
      case "OPENAI_URL":
        value = import.meta.env.OPENAI_URL;
        break;
    }

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
  // Always try process.env first (available in production Azure Web App)
  const runtimeValue = readProcessEnv(key);
  if (runtimeValue) {
    return runtimeValue;
  }

  // Check if we're in production (Azure Web App)
  // In production, NEVER use import.meta.env as it may contain empty strings from build time
  const isProduction = typeof process !== "undefined" && process.env?.NODE_ENV === "production";

  if (isProduction) {
    // In production, if process.env doesn't have it, it's a configuration error
    const availableKeys = Object.keys(process.env || {})
      .filter((k) => k.includes("SUPABASE") || k.includes("OPENAI"))
      .join(", ");

    throw new Error(
      `Missing environment variable: ${key}. Ensure it is configured in Azure Web App settings (Configuration > Application settings). ` +
        `Available keys: ${availableKeys || "none"}. NODE_ENV: ${process.env?.NODE_ENV || "not set"}`
    );
  }

  // In development, try import.meta.env as fallback
  const buildTimeValue = readImportMetaEnv(key);
  if (buildTimeValue) {
    return buildTimeValue;
  }

  // Neither source has the variable - throw error with helpful message
  throw new Error(
    `Missing environment variable: ${key}. Ensure it is configured in .env file. NODE_ENV: ${typeof process !== "undefined" ? process.env?.NODE_ENV || "not set" : "process not available"}`
  );
}
