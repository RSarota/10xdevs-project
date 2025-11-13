/**
 * Authentication error keys used across auth pages
 */
export const AUTH_ERROR_KEYS = {
  CONFIRMATION_FAILED: "confirmation_failed",
  UNEXPECTED: "unexpected",
  NO_TOKEN: "no_token",
} as const;

export type AuthErrorKey = (typeof AUTH_ERROR_KEYS)[keyof typeof AUTH_ERROR_KEYS];

/**
 * Verification types for email confirmation
 */
export const VERIFICATION_TYPES = {
  SIGNUP: "signup",
  RECOVERY: "recovery",
} as const;

export type VerificationType = (typeof VERIFICATION_TYPES)[keyof typeof VERIFICATION_TYPES];

/**
 * User-friendly error messages mapped to error keys
 */
export const ERROR_MESSAGES: Record<AuthErrorKey, string> = {
  [AUTH_ERROR_KEYS.NO_TOKEN]: "Brak tokenu potwierdzenia",
  [AUTH_ERROR_KEYS.CONFIRMATION_FAILED]: "Błąd potwierdzenia",
  [AUTH_ERROR_KEYS.UNEXPECTED]: "Wystąpił nieoczekiwany błąd",
};

/**
 * Get user-friendly error message for an error key
 */
export function getAuthErrorMessage(key: string, fallback?: string): string {
  return ERROR_MESSAGES[key as AuthErrorKey] ?? fallback ?? ERROR_MESSAGES[AUTH_ERROR_KEYS.UNEXPECTED];
}
