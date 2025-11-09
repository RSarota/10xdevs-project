import { useState, useEffect } from "react";

export interface UserProfileDTO {
  email: string;
  name?: string;
}

export interface ProfileFormData {
  email: string;
  password?: string;
  confirmPassword?: string;
}

interface UseProfileReturn {
  profile: UserProfileDTO | null;
  loading: boolean;
  error: Error | null;
  updateProfile: (data: ProfileFormData) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

export function useProfile(): UseProfileReturn {
  const [profile, setProfile] = useState<UserProfileDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/users/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = "/auth/login";
          return;
        }
        throw new Error("Nie udało się pobrać profilu");
      }

      const data = await response.json();
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Wystąpił nieoczekiwany błąd"));
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: ProfileFormData): Promise<void> => {
    const body: { password?: string } = {};

    // Only password can be updated (email is read-only)
    if (data.password && data.password.trim().length > 0) {
      body.password = data.password;
    }

    const response = await fetch("/api/users/me", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = "/auth/login";
        return;
      }
      if (response.status === 400) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Nieprawidłowe dane");
      }
      throw new Error("Nie udało się zaktualizować profilu");
    }

    // Refresh profile after update
    await fetchProfile();
  };

  const deleteAccount = async (): Promise<void> => {
    const response = await fetch("/api/users/me", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = "/auth/login";
        return;
      }

      // Try to parse error message from response
      let errorMessage = "Nie udało się usunąć konta";
      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch {
        // If parsing fails, use default message
      }

      throw new Error(errorMessage);
    }

    // Redirect to login after account deletion
    window.location.href = "/auth/login";
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    loading,
    error,
    updateProfile,
    deleteAccount,
  };
}
