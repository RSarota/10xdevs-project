import type { SupabaseClient } from "../../db/supabase.client";
import type { AstroCookies } from "astro";
import { VERIFICATION_TYPES, AUTH_ERROR_KEYS, type VerificationType } from "../constants/auth";
import { setRecoverySession } from "../utils/recoverySession";

export interface VerificationParams {
  token?: string | null;
  tokenHash?: string | null;
  code?: string | null;
  type?: string | null;
  error?: string | null;
  errorDescription?: string | null;
}

export interface VerificationResult {
  success: boolean;
  redirectTo: string;
  errorKey?: string;
  message?: string;
}

/**
 * Handles email confirmation and password recovery verification
 */
export async function verifyAuthToken(
  params: VerificationParams,
  supabase: SupabaseClient,
  cookies: AstroCookies
): Promise<VerificationResult> {
  // Handle error parameter
  if (params.error) {
    const redirectTarget = params.type === VERIFICATION_TYPES.RECOVERY ? "/auth/forgot-password" : "/auth/login";
    const message = params.errorDescription || "Wystąpił błąd podczas potwierdzania";
    return {
      success: false,
      redirectTo: redirectTarget,
      errorKey: AUTH_ERROR_KEYS.CONFIRMATION_FAILED,
      message,
    };
  }

  // Validate verification type
  const typeParam = params.type ?? VERIFICATION_TYPES.SIGNUP;
  const SUPPORTED_TYPES = new Set([VERIFICATION_TYPES.SIGNUP, VERIFICATION_TYPES.RECOVERY]);

  if (!SUPPORTED_TYPES.has(typeParam as VerificationType)) {
    return {
      success: false,
      redirectTo: "/auth/login",
      errorKey: AUTH_ERROR_KEYS.UNEXPECTED,
      message: "Nieobsługiwany rodzaj potwierdzenia",
    };
  }

  const verifyType =
    typeParam === VERIFICATION_TYPES.RECOVERY ? VERIFICATION_TYPES.RECOVERY : VERIFICATION_TYPES.SIGNUP;

  // Handle PKCE tokens and code exchange
  const rawToken = params.token ?? params.tokenHash;
  const isPkceToken = rawToken?.startsWith("pkce_") ?? false;
  const tokenHash = isPkceToken ? null : rawToken;

  if (!tokenHash) {
    const codeToExchange = params.code ?? (isPkceToken ? rawToken : null);

    if (verifyType === VERIFICATION_TYPES.SIGNUP) {
      return {
        success: true,
        redirectTo: "/auth/login?confirmed=true",
      };
    }

    if (codeToExchange) {
      const { data, error } = await supabase.auth.exchangeCodeForSession(codeToExchange);

      if (error || !data.session) {
        const message = error?.message ?? "Nie udało się utworzyć sesji resetu hasła";
        return {
          success: false,
          redirectTo: "/auth/forgot-password",
          errorKey: AUTH_ERROR_KEYS.UNEXPECTED,
          message,
        };
      }

      // Set recovery session flag
      setRecoverySession(cookies);

      return {
        success: true,
        redirectTo: "/auth/reset-password",
      };
    }

    return {
      success: false,
      redirectTo: "/auth/forgot-password",
      errorKey: AUTH_ERROR_KEYS.CONFIRMATION_FAILED,
      message: "Link resetowania hasła jest nieprawidłowy lub wygasł",
    };
  }

  // Handle token hash verification
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      type: verifyType,
      token_hash: tokenHash,
    });

    if (error) {
      const message =
        error.message === "Email link is invalid or has expired"
          ? "Link potwierdzający jest nieprawidłowy lub wygasł"
          : error.message || "Nie udało się potwierdzić tokenu";

      const redirectTarget = verifyType === VERIFICATION_TYPES.RECOVERY ? "/auth/forgot-password" : "/auth/login";

      return {
        success: false,
        redirectTo: redirectTarget,
        errorKey: AUTH_ERROR_KEYS.CONFIRMATION_FAILED,
        message,
      };
    }

    if (verifyType === VERIFICATION_TYPES.RECOVERY) {
      if (!data.session) {
        return {
          success: false,
          redirectTo: "/auth/forgot-password",
          errorKey: AUTH_ERROR_KEYS.UNEXPECTED,
          message: "Nie udało się utworzyć sesji resetu hasła",
        };
      }

      // Set recovery session flag
      setRecoverySession(cookies);

      return {
        success: true,
        redirectTo: "/auth/reset-password",
      };
    }

    return {
      success: true,
      redirectTo: "/auth/login?confirmed=true",
    };
  } catch (error) {
    const message =
      error instanceof Response
        ? ""
        : error instanceof Error
          ? error.message
          : "Wystąpił nieoczekiwany błąd podczas potwierdzania";

    return {
      success: false,
      redirectTo: "/auth/login",
      errorKey: AUTH_ERROR_KEYS.UNEXPECTED,
      message,
    };
  }
}
