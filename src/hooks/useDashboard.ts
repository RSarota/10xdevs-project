import { useState, useEffect, useCallback } from "react";
import type { UserStatisticsDTO, StudySessionDTO } from "@/types";
import { pluralizeWithCount } from "@/lib/polish-plurals";

export interface ActivityViewModel {
  id: string;
  type: "generation" | "flashcard" | "session";
  description: string;
  timestamp: string; // ISO 8601 format
}

interface UseDashboardReturn {
  statistics: UserStatisticsDTO | null;
  recentActivities: ActivityViewModel[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

function mapStudySessionToActivity(session: StudySessionDTO): ActivityViewModel {
  const flashcardsText = pluralizeWithCount(session.flashcards_count, "fiszka", "fiszki", "fiszek");
  const ratingText = session.average_rating ? ` (średnia ocena: ${session.average_rating.toFixed(1)})` : "";
  const description = `Sesja nauki: ${flashcardsText}${ratingText}`;

  // Użyj completed_at jeśli dostępne, w przeciwnym razie started_at
  const timestamp = session.completed_at || session.started_at;

  return {
    id: `session-${session.id}`,
    type: "session",
    description,
    timestamp,
  };
}

export function useDashboard(): UseDashboardReturn {
  const [statistics, setStatistics] = useState<UserStatisticsDTO | null>(null);
  const [recentActivities, setRecentActivities] = useState<ActivityViewModel[]>([]);
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
          window.location.href = "/auth/login";
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

  const fetchRecentSessions = async () => {
    try {
      const response = await fetch("/api/study/history?limit=5&sort_by=started_at&sort_order=desc", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        // Nie rzucamy błędu, jeśli nie uda się pobrać sesji - to nie jest krytyczne
        return;
      }

      const data = await response.json();
      const activities = data.studySessions?.map(mapStudySessionToActivity) || [];
      setRecentActivities(activities);
    } catch {
      // Nie rzucamy błędu, jeśli nie uda się pobrać sesji - to nie jest krytyczne
    }
  };

  const fetchAll = useCallback(async () => {
    await Promise.all([fetchStatistics(), fetchRecentSessions()]);
  }, []);

  useEffect(() => {
    void fetchAll();
  }, [fetchAll]);

  return {
    statistics,
    recentActivities,
    loading,
    error,
    refetch: fetchAll,
  };
}
