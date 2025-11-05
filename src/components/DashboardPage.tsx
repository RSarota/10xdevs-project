import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useDashboard } from "@/hooks/useDashboard";
import { DashboardHeader } from "./dashboard/DashboardHeader";
import { StatisticsOverview } from "./dashboard/StatisticsOverview";
import { QuickActionsPanel, DEFAULT_QUICK_ACTIONS } from "./dashboard/QuickActionsPanel";
import { RecentActivityFeed } from "./dashboard/RecentActivityFeed";
import type { ActivityViewModel } from "@/hooks/useDashboard";
import { RefreshCw } from "lucide-react";

// Apple HIG Components
import { Button, Stack, Banner, EmptyState, Skeleton, Container, Divider } from "./apple-hig";

export default function DashboardPage() {
  const { statistics, loading, error, refetch } = useDashboard();
  const [recentActivities] = useState<ActivityViewModel[]>([]);

  useEffect(() => {
    if (error) {
      toast.error("Nie udało się załadować statystyk", {
        description: error.message,
      });
    }
  }, [error]);

  const hasFlashcards = statistics && statistics.flashcards.total > 0;

  return (
    <div className="min-h-screen flex flex-col bg-[hsl(var(--apple-grouped-bg))]">
      {/* Main Content Container */}
      <div className="flex-1 overflow-y-auto">
        <Container size="xl" className="py-[var(--apple-space-8)]">
          <Stack direction="vertical" spacing="xl">
            {/* Header */}
            <DashboardHeader />

            {/* Error Banner */}
            {error && (
              <Banner
                open={!!error}
                message="Nie udało się załadować statystyk. Sprawdź połączenie internetowe."
                type="error"
                dismissible
                action={{
                  label: "Spróbuj ponownie",
                  onClick: refetch,
                }}
              />
            )}

            {/* Loading State */}
            {loading && (
              <Stack direction="vertical" spacing="lg">
                <Skeleton height={200} />
                <Skeleton height={150} />
                <Skeleton height={200} />
              </Stack>
            )}

            {/* Statistics loaded */}
            {!loading && statistics && (
              <>
                {/* Quick Actions Panel */}
                <QuickActionsPanel actions={DEFAULT_QUICK_ACTIONS} />

                <Divider />

                {/* Statistics Overview */}
                {hasFlashcards ? (
                  <StatisticsOverview statistics={statistics} />
                ) : (
                  <EmptyState
                    icon={<RefreshCw className="w-16 h-16" />}
                    title="Brak fiszek"
                    description="Rozpocznij swoją przygodę z nauką, tworząc pierwszą fiszkę!"
                    action={
                      <Button
                        variant="filled"
                        color="blue"
                        size="large"
                        onClick={() => (window.location.href = "/generate-flashcards")}
                      >
                        Wygeneruj fiszki
                      </Button>
                    }
                  />
                )}

                {hasFlashcards && (
                  <>
                    <Divider />
                    {/* Recent Activity Feed */}
                    <RecentActivityFeed activities={recentActivities} />
                  </>
                )}
              </>
            )}
          </Stack>
        </Container>
      </div>
    </div>
  );
}
