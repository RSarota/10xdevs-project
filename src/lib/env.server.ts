type ServerEnvKey = "SUPABASE_URL" | "SUPABASE_KEY" | "OPENAI_API_KEY" | "OPENAI_URL";

function readProcessEnv(key: ServerEnvKey): string | undefined {
  if (typeof process === "undefined") {
    return undefined;
  }

  const value = process.env[key];
  if (!value) {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function readImportMetaEnv(key: ServerEnvKey): string | undefined {
  const value = import.meta.env[key];
  if (!value) {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function getServerEnv(key: ServerEnvKey): string {
  const runtimeValue = readProcessEnv(key);
  if (runtimeValue) {
    return runtimeValue;
  }

  const buildTimeValue = readImportMetaEnv(key);
  if (buildTimeValue) {
    return buildTimeValue;
  }

  throw new Error(
    `Missing environment variable: ${key}. Ensure it is configured in Azure Web App settings and .env files.`
  );
}
