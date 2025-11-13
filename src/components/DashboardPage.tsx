import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useDashboard } from "@/hooks/useDashboard";
import { DashboardHeader } from "./dashboard/DashboardHeader";
import { StatisticsOverview } from "./dashboard/StatisticsOverview";
import { QuickActionsPanel, DEFAULT_QUICK_ACTIONS } from "./dashboard/QuickActionsPanel";
import { RecentActivityFeed } from "./dashboard/RecentActivityFeed";
import { RefreshCw } from "lucide-react";

// Apple HIG Components
import { Banner, EmptyState, Skeleton, Container } from "./apple-hig";

export default function DashboardPage() {
  const { statistics, recentActivities, loading, error, refetch } = useDashboard();
  const [shouldNavigate, setShouldNavigate] = useState(false);

  useEffect(() => {
    if (error) {
      toast.error("Nie udało się załadować statystyk", {
        description: error.message,
      });
    }
  }, [error]);

  useEffect(() => {
    if (shouldNavigate) {
      window.location.href = "/generate-flashcards";
    }
  }, [shouldNavigate]);

  const hasFlashcards = statistics && statistics.flashcards.total > 0;

  const handleGenerateFlashcards = () => {
    setShouldNavigate(true);
  };

  return (
    <div className="flex flex-col relative">
      {/* Main Content Container */}
      <div className="relative z-10">
        <Container size="xl" className="py-[var(--apple-space-6)]">
          {/* Header Section */}
          <div className="mb-8">
            <DashboardHeader />
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6">
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
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton
                  height={120}
                  className="bg-white/70 dark:bg-black/30 backdrop-blur-sm rounded-2xl border border-[hsl(var(--apple-separator))]/30"
                />
                <Skeleton
                  height={300}
                  className="bg-white/60 dark:bg-black/25 backdrop-blur-sm rounded-2xl border border-[hsl(var(--apple-separator))]/25"
                />
              </div>
              <div className="space-y-6">
                <Skeleton
                  height={200}
                  className="bg-white/65 dark:bg-black/28 backdrop-blur-sm rounded-2xl border border-[hsl(var(--apple-separator))]/28"
                />
                <Skeleton
                  height={250}
                  className="bg-white/65 dark:bg-black/28 backdrop-blur-sm rounded-2xl border border-[hsl(var(--apple-separator))]/28"
                />
              </div>
            </div>
          )}

          {/* Main Content Grid */}
          {!loading && statistics && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Quick Actions - Redesigned */}
                <div className="bg-white/60 dark:bg-black/15 backdrop-blur-sm rounded-2xl border border-[hsl(var(--apple-separator))]/25 shadow-md p-6">
                  <QuickActionsPanel actions={DEFAULT_QUICK_ACTIONS} />
                </div>

                {/* Statistics Overview */}
                {hasFlashcards ? (
                  <div className="bg-white/60 dark:bg-black/15 backdrop-blur-sm rounded-2xl border border-[hsl(var(--apple-separator))]/25 shadow-md p-6">
                    <StatisticsOverview statistics={statistics} />
                  </div>
                ) : (
                  <div className="bg-white/70 dark:bg-black/20 backdrop-blur-sm rounded-2xl border border-[hsl(var(--apple-separator))]/30 shadow-lg p-8 text-center">
                    <EmptyState
                      icon={<RefreshCw className="w-16 h-16" />}
                      title="Brak fiszek"
                      description="Rozpocznij swoją przygodę z nauką, tworząc pierwszą fiszkę!"
                      action={{
                        label: "Wygeneruj fiszki",
                        onClick: handleGenerateFlashcards,
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Right Column - Sidebar Content */}
              <div className="space-y-6">
                {hasFlashcards && (
                  <div className="bg-white/65 dark:bg-black/18 backdrop-blur-sm rounded-2xl border border-[hsl(var(--apple-separator))]/28 shadow-md p-6">
                    <RecentActivityFeed activities={recentActivities} />
                  </div>
                )}
                
                {/* Additional sidebar content can go here */}
                <div className="bg-gradient-to-br from-[hsl(var(--apple-blue)/0.15)] to-[hsl(var(--apple-purple)/0.15)] backdrop-blur-sm rounded-2xl border border-[hsl(var(--apple-separator))]/25 shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-[hsl(var(--apple-blue))] to-[hsl(var(--apple-purple))] bg-clip-text text-transparent">
                    Wskazówki
                  </h3>
                  <p className="text-sm text-[hsl(var(--apple-label-secondary))] leading-relaxed">
                    Regularne powtarzanie fiszek zwiększa efektywność nauki o nawet 80%. Spróbuj codziennej sesji!
                  </p>
                </div>
              </div>
            </div>
          )}
        </Container>
      </div>
    </div>
  );
}
