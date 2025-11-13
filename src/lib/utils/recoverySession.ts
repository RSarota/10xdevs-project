import type { AstroCookies } from "astro";

const RECOVERY_SESSION_COOKIE = "recovery_session";
const RECOVERY_SESSION_MAX_AGE = 60 * 60; // 1 hour (same as typical recovery link expiration)

/**
 * Sets a recovery session cookie to restrict access to password reset only
 * This cookie indicates the user is in a password recovery flow
 */
export function setRecoverySession(cookies: AstroCookies): void {
  cookies.set(RECOVERY_SESSION_COOKIE, "true", {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: RECOVERY_SESSION_MAX_AGE,
  });
}

/**
 * Checks if the current session is a recovery session
 */
export function isRecoverySession(cookies: AstroCookies): boolean {
  return cookies.get(RECOVERY_SESSION_COOKIE)?.value === "true";
}

/**
 * Clears the recovery session cookie
 */
export function clearRecoverySession(cookies: AstroCookies): void {
  cookies.delete(RECOVERY_SESSION_COOKIE, {
    path: "/",
  });
}
