/**
 * Service layer dla operacji na użytkownikach
 */

export interface UserInfo {
  email: string;
  name: string;
}

export interface GetCurrentUserResponse {
  success: boolean;
  data?: UserInfo;
  error?: string;
}

/**
 * Pobiera informacje o aktualnie zalogowanym użytkowniku
 */
export async function getCurrentUser(): Promise<GetCurrentUserResponse> {
  try {
    const response = await fetch("/api/users/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return {
        success: false,
        error: "Nie udało się pobrać danych użytkownika",
      };
    }

    const data = await response.json();
    return {
      success: true,
      data: {
        email: data.email || "",
        name: data.name || data.email?.split("@")[0] || "Użytkownik",
      },
    };
  } catch {
    return {
      success: false,
      error: "Wystąpił błąd połączenia",
    };
  }
}
