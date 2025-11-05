import { useState, useEffect } from "react";
import type { UserStatisticsDTO } from "@/types";

export interface ActivityViewModel {
  id: string;
  type: "generation" | "flashcard" | "session";
  description: string;
  timestamp: string; // ISO 8601 format
}

interface UseDashboardReturn {
  statistics: UserStatisticsDTO | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useDashboard(): UseDashboardReturn {
  const [statistics, setStatistics] = useState<UserStatisticsDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/users/me/statistics", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Redirect to login if unauthorized
          window.location.href = "/login";
          return;
        }
        throw new Error("Nie udało się załadować statystyk");
      }

      const data = await response.json();
      setStatistics(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Wystąpił nieoczekiwany błąd"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  return {
    statistics,
    loading,
    error,
    refetch: fetchStatistics,
  };
}
