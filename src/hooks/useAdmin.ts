import { useState, useEffect } from "react";
import { toast } from "sonner";
import type { GenerationErrorDTO } from "@/types";

export interface UserDTO {
  id: string;
  email: string;
  created_at: string;
  role?: string;
}

interface UseAdminReturn {
  logs: GenerationErrorDTO[];
  users: UserDTO[];
  loading: boolean;
  error: Error | null;
  currentPage: number;
  totalPages: number;
  fetchLogs: (page: number) => Promise<void>;
  fetchUsers: () => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  changeUserRole: (id: string, role: string) => Promise<void>;
}

export function useAdmin(): UseAdminReturn {
  const [logs, setLogs] = useState<GenerationErrorDTO[]>([]);
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLogs = async (page: number) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/generation-errors?page=${page}&limit=20`, {
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
        if (response.status === 403) {
          toast.error("Brak uprawnień");
          window.location.href = "/dashboard";
          return;
        }
        throw new Error("Nie udało się pobrać logów błędów");
      }

      const data = await response.json();
      setLogs(data.errors || []);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Wystąpił nieoczekiwany błąd"));
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/users", {
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
        if (response.status === 403) {
          toast.error("Brak uprawnień");
          window.location.href = "/dashboard";
          return;
        }
        throw new Error("Nie udało się pobrać listy użytkowników");
      }

      const data = await response.json();
      setUsers(data.users || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Wystąpił nieoczekiwany błąd"));
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string): Promise<void> => {
    try {
      const response = await fetch(`/api/users/${id}`, {
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
        if (response.status === 403) {
          throw new Error("Brak uprawnień");
        }
        throw new Error("Nie udało się usunąć użytkownika");
      }

      // Refresh users list
      await fetchUsers();
    } catch (err) {
      throw err;
    }
  };

  const changeUserRole = async (id: string, role: string): Promise<void> => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = "/login";
          return;
        }
        if (response.status === 403) {
          throw new Error("Brak uprawnień");
        }
        throw new Error("Nie udało się zmienić roli użytkownika");
      }

      // Refresh users list
      await fetchUsers();
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchLogs(1);
    fetchUsers();
  }, []);

  return {
    logs,
    users,
    loading,
    error,
    currentPage,
    totalPages,
    fetchLogs,
    fetchUsers,
    deleteUser,
    changeUserRole,
  };
}
