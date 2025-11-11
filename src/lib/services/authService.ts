/**
 * Service layer dla operacji autentykacji
 */

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface RegisterResponse {
  success: boolean;
  error?: string;
}

/**
 * Rejestracja użytkownika
 */
export async function register(data: RegisterData): Promise<RegisterResponse> {
  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: responseData.error || "Wystąpił błąd podczas rejestracji",
      };
    }

    return { success: true };
  } catch {
    return {
      success: false,
      error: "Wystąpił błąd połączenia. Spróbuj ponownie.",
    };
  }
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  error?: string;
  code?: string;
}

/**
 * Logowanie użytkownika
 */
export async function login(data: LoginData): Promise<LoginResponse> {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: responseData.error || "Nieprawidłowy e-mail lub hasło",
        code: responseData.code,
      };
    }

    return { success: true };
  } catch {
    return {
      success: false,
      error: "Wystąpił błąd połączenia. Spróbuj ponownie.",
    };
  }
}

/**
 * Sprawdza czy błąd dotyczy zajętego emaila
 */
export function isEmailTakenError(error: string | undefined): boolean {
  if (!error) return false;
  const errorLower = error.toLowerCase();
  return (
    errorLower.includes("już istnieje") ||
    errorLower.includes("already") ||
    errorLower.includes("zarejestrowany") ||
    errorLower.includes("email already")
  );
}

/**
 * Sprawdza czy błąd dotyczy niepotwierdzonego emaila
 */
export function isEmailNotConfirmedError(code: string | undefined): boolean {
  return code === "email_not_confirmed";
}

export interface ForgotPasswordData {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  error?: string;
}

/**
 * Wysyła link resetujący hasło
 */
export async function forgotPassword(data: ForgotPasswordData): Promise<ForgotPasswordResponse> {
  try {
    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: responseData.error || "Wystąpił błąd podczas wysyłania e-maila",
      };
    }

    return { success: true };
  } catch {
    return {
      success: false,
      error: "Wystąpił błąd połączenia. Spróbuj ponownie.",
    };
  }
}

export interface ResetPasswordData {
  password: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  error?: string;
}

/**
 * Resetuje hasło użytkownika
 */
export async function resetPassword(data: ResetPasswordData): Promise<ResetPasswordResponse> {
  try {
    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      const errorMessage = responseData.error || "Wystąpił błąd podczas resetowania hasła";
      // Check if error is about expired token
      if (errorMessage.includes("wygasł") || errorMessage.includes("expired")) {
        return {
          success: false,
          error: "Link resetowania hasła wygasł. Spróbuj ponownie.",
        };
      }
      return {
        success: false,
        error: errorMessage,
      };
    }

    return { success: true };
  } catch {
    return {
      success: false,
      error: "Wystąpił błąd połączenia. Spróbuj ponownie.",
    };
  }
}

export interface LogoutResponse {
  success: boolean;
  error?: string;
}

/**
 * Wylogowuje użytkownika
 */
export async function logout(): Promise<LogoutResponse> {
  try {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      // Even if logout fails, we still want to redirect to login
      // The middleware will handle authentication check
      return { success: true };
    }

    return { success: true };
  } catch {
    // On error, still redirect to login
    return { success: true };
  }
}
