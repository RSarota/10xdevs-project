import { useState, useEffect } from "react";

export interface UserProfileDTO {
  email: string;
  name?: string;
}

export interface HistoryItemViewModel {
  id: string;
  type: "generation" | "session";
  date: string;
  count: number;
  score?: number;
}

export interface ProfileFormData {
  email: string;
  password?: string;
  confirmPassword?: string;
}

interface UseProfileReturn {
  profile: UserProfileDTO | null;
  history: HistoryItemViewModel[];
  loading: boolean;
  error: Error | null;
  updateProfile: (data: ProfileFormData) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

export function useProfile(): UseProfileReturn {
  const [profile, setProfile] = useState<UserProfileDTO | null>(null);
  const [history, setHistory] = useState<HistoryItemViewModel[]>([]);
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
          window.location.href = "/login";
          return;
        }
        throw new Error("Nie udało się pobrać profilu");
      }

      const data = await response.json();
      setProfile(data);

      // Mock history for now
      setHistory([]);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Wystąpił nieoczekiwany błąd"));
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: ProfileFormData): Promise<void> => {
    try {
      const body: any = {};

      if (data.email !== profile?.email) {
        body.email = data.email;
      }

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
          window.location.href = "/login";
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
    } catch (err) {
      throw err;
    }
  };

  const deleteAccount = async (): Promise<void> => {
    try {
      const response = await fetch("/api/users/me", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = "/login";
          return;
        }
        throw new Error("Nie udało się usunąć konta");
      }

      // Redirect to login after account deletion
      window.location.href = "/login";
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    history,
    loading,
    error,
    updateProfile,
    deleteAccount,
  };
}
