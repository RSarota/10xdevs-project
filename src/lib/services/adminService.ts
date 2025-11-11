import type { GenerationErrorDTO } from "@/types";

export interface UserDTO {
  id: string;
  email: string;
  created_at: string;
  role?: string;
}

export interface FetchLogsResponse {
  errors: GenerationErrorDTO[];
  totalPages: number;
}

export interface FetchUsersResponse {
  users: UserDTO[];
}

/**
 * Service layer dla operacji administracyjnych
 */
export const adminService = {
  /**
   * Pobiera logi błędów generacji
   */
  async fetchLogs(page: number, limit = 20): Promise<FetchLogsResponse> {
    const response = await fetch(`/api/generation-errors?page=${page}&limit=${limit}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = "/auth/login";
        throw new Error("Brak autoryzacji");
      }
      if (response.status === 403) {
        throw new Error("Brak uprawnień");
      }
      throw new Error("Nie udało się pobrać logów błędów");
    }

    const data = await response.json();
    return {
      errors: data.errors || [],
      totalPages: data.totalPages || 1,
    };
  },

  /**
   * Pobiera listę użytkowników
   */
  async fetchUsers(): Promise<FetchUsersResponse> {
    const response = await fetch("/api/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = "/auth/login";
        throw new Error("Brak autoryzacji");
      }
      if (response.status === 403) {
        throw new Error("Brak uprawnień");
      }
      throw new Error("Nie udało się pobrać listy użytkowników");
    }

    const data = await response.json();
    return {
      users: data.users || [],
    };
  },

  /**
   * Usuwa użytkownika
   */
  async deleteUser(id: string): Promise<void> {
    const response = await fetch(`/api/users/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = "/auth/login";
        throw new Error("Brak autoryzacji");
      }
      if (response.status === 403) {
        throw new Error("Brak uprawnień");
      }
      throw new Error("Nie udało się usunąć użytkownika");
    }
  },

  /**
   * Zmienia rolę użytkownika
   */
  async changeUserRole(id: string, role: string): Promise<void> {
    const response = await fetch(`/api/users/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = "/auth/login";
        throw new Error("Brak autoryzacji");
      }
      if (response.status === 403) {
        throw new Error("Brak uprawnień");
      }
      throw new Error("Nie udało się zmienić roli użytkownika");
    }
  },
};
