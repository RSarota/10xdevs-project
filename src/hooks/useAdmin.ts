import { useState, useEffect } from "react";
import { toast } from "sonner";
import { adminService, type UserDTO } from "@/lib/services/adminService";
import type { GenerationErrorDTO } from "@/types";

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

      const data = await adminService.fetchLogs(page, 20);
      setLogs(data.errors);
      setTotalPages(data.totalPages);
      setCurrentPage(page);
    } catch (err) {
      if (err instanceof Error && err.message === "Brak uprawnień") {
        toast.error("Brak uprawnień");
        window.location.href = "/dashboard";
        return;
      }
      setError(err instanceof Error ? err : new Error("Wystąpił nieoczekiwany błąd"));
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await adminService.fetchUsers();
      setUsers(data.users);
    } catch (err) {
      if (err instanceof Error && err.message === "Brak uprawnień") {
        toast.error("Brak uprawnień");
        window.location.href = "/dashboard";
        return;
      }
      setError(err instanceof Error ? err : new Error("Wystąpił nieoczekiwany błąd"));
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string): Promise<void> => {
    await adminService.deleteUser(id);
    // Refresh users list
    await fetchUsers();
  };

  const changeUserRole = async (id: string, role: string): Promise<void> => {
    await adminService.changeUserRole(id, role);
    // Refresh users list
    await fetchUsers();
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
