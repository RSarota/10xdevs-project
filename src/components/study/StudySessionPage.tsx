import { useEffect, type ReactNode } from "react";

import { ActivityIndicator, Body, Button, Container, EmptyState, Stack } from "@/components/apple-hig";
import { FlashcardView } from "./FlashcardView";
import { RatingControls } from "./RatingControls";
import { StudySessionHeader } from "./StudySessionHeader";
import { StudySessionProgress } from "./StudySessionProgress";
import { useStudySession } from "@/hooks/useStudySession";

export default function StudySessionPage() {
  const {
    studySession,
    flashcards,
    currentFlashcard,
    currentFlashcardIndex,
    isRevealed,
    isLoading,
    isRating,
    error,
    hasSessionEnded,
    startSession,
    revealFlashcard,
    rateFlashcard,
    endSession,
  } = useStudySession();

  useEffect(() => {
    void startSession();
  }, [startSession]);

  let content: ReactNode;

  const completedIndex = Math.min(currentFlashcardIndex, Math.max(flashcards.length - 1, 0));

  if (isLoading && !studySession) {
    content = (
      <div className="bg-white/60 dark:bg-black/15 backdrop-blur-sm border border-[hsl(var(--apple-separator))]/25 rounded-3xl p-8 shadow-md">
        <div className="flex items-center justify-center min-h-[400px]" data-testid="study-session-loading">
          <ActivityIndicator size="lg" />
        </div>
      </div>
    );
  } else if (error && flashcards.length === 0) {
    content = (
      <div className="bg-white/60 dark:bg-black/15 backdrop-blur-sm border border-[hsl(var(--apple-separator))]/25 rounded-3xl p-8 shadow-md">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-6 max-w-lg" data-testid="study-session-error">
            <div className="text-6xl mb-4">⚠️</div>
            <Body className="text-[hsl(var(--apple-label))] text-xl font-medium">Nie udało się załadować sesji</Body>
            <Body className="text-[hsl(var(--apple-label-secondary))] whitespace-pre-line">{error}</Body>
            <Button variant="filled" color="blue" onClick={() => void startSession()}>
              Spróbuj ponownie
            </Button>
          </div>
        </div>
      </div>
    );
  } else if (hasSessionEnded && studySession && flashcards.length > 0) {
    content = (
      <Stack direction="vertical" spacing="xl" className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="w-full">
          <StudySessionHeader
            flashcardsCount={flashcards.length}
            currentIndex={completedIndex}
            onEndSession={() => void endSession()}
            averageRating={studySession.average_rating}
            showEndSessionAction={false}
          />
        </div>

        {/* Completion content */}
        <div className="bg-white/60 dark:bg-black/15 backdrop-blur-sm border border-[hsl(var(--apple-separator))]/25 rounded-3xl p-8 shadow-md">
          <div className="text-center space-y-8 py-8 w-full">
            <div className="w-full max-w-2xl mx-auto">
              <StudySessionProgress current={completedIndex} total={flashcards.length} />
            </div>

            <div className="space-y-4">
              <div className="text-6xl mb-6">🎉</div>
              <Body className="text-[hsl(var(--apple-label))] font-medium text-xl">
                Sesja została zakończona. Świetna robota!
              </Body>
              <Body className="text-[hsl(var(--apple-label-secondary))] max-w-xl mx-auto">
                Możesz rozpocząć kolejną sesję, aby utrwalić materiał, albo wrócić na dashboard i sprawdzić inne
                aktywności.
              </Body>
            </div>

            <Stack direction="horizontal" spacing="md" justify="center" wrap>
              <Button variant="filled" color="blue" onClick={() => void startSession()}>
                Rozpocznij ponownie
              </Button>
              <Button variant="plain" color="gray" onClick={() => (window.location.href = "/dashboard")}>
                Wróć na dashboard
              </Button>
            </Stack>
          </div>
        </div>
      </Stack>
    );
  } else if (!currentFlashcard || !studySession || flashcards.length === 0) {
    content = (
      <div className="bg-white/60 dark:bg-black/15 backdrop-blur-sm border border-[hsl(var(--apple-separator))]/25 rounded-3xl p-8 shadow-md">
        <div className="flex items-center justify-center min-h-[400px]">
          <EmptyState
            title="Brak fiszek do powtórek"
            description="Dodaj nowe fiszki lub poczekaj na termin kolejnej sesji."
            action={{
              label: "Odśwież",
              onClick: () => void startSession(),
            }}
            data-testid="study-session-empty"
          />
        </div>
      </div>
    );
  } else {
    content = (
      <Stack direction="vertical" spacing="lg" className="w-full max-w-7xl mx-auto">
        {/* Header with integrated progress */}
        <div className="space-y-4 w-full">
          <StudySessionHeader
            flashcardsCount={flashcards.length}
            currentIndex={currentFlashcardIndex}
            onEndSession={() => void endSession()}
            averageRating={studySession.average_rating}
          />
          <StudySessionProgress current={currentFlashcardIndex} total={flashcards.length} />
        </div>

        {/* Main content area - responsive layout */}
        <div className="flex flex-col xl:flex-row xl:gap-8 xl:items-start transition-all duration-300 ease-in-out">
          {/* Main flashcard area */}
          <div className="bg-white/60 dark:bg-black/15 backdrop-blur-sm border border-[hsl(var(--apple-separator))]/25 rounded-3xl p-6 shadow-md xl:flex-1 transition-all duration-300">
            <div className="flex items-center justify-center py-4 md:py-6 lg:py-6 xl:py-6 min-h-[450px] lg:min-h-[500px] xl:min-h-[420px] w-full">
              <FlashcardView flashcard={currentFlashcard} isRevealed={isRevealed} onReveal={revealFlashcard} />
            </div>
          </div>

          {/* Controls area - side panel on xl+ */}
          <div className="xl:w-80 xl:flex-shrink-0 space-y-2 xl:space-y-4 mt-4 xl:mt-0 transition-all duration-300 ease-in-out">
            {isRevealed ? (
              <div className="bg-white/60 dark:bg-black/15 backdrop-blur-sm border border-[hsl(var(--apple-separator))]/25 rounded-3xl p-6 shadow-md transition-all duration-300">
                <RatingControls onRatingSelect={(rating) => void rateFlashcard(rating)} disabled={isRating} />
              </div>
            ) : (
              <div className="bg-white/40 dark:bg-black/10 backdrop-blur-sm border border-[hsl(var(--apple-separator))]/20 rounded-3xl p-6 text-center transition-all duration-300">
                <Body className="text-[hsl(var(--apple-label-tertiary))]">
                  Odsłoń odpowiedź, aby ocenić stopień zapamiętania.
                </Body>
              </div>
            )}
          </div>
        </div>
      </Stack>
    );
  }

  return (
    <div className="flex flex-col relative">
      {/* Subtle animated background pattern */}
      <div className="fixed inset-0 opacity-10 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-[hsl(var(--apple-blue)/0.006)] to-transparent animate-pulse"
          style={{ animationDuration: "4s" }}
        />
        <div
          className="absolute top-1/3 right-1/4 w-80 h-80 bg-[hsl(var(--apple-green)/0.012)] rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s", animationDuration: "6s" }}
        />
        <div
          className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[hsl(var(--apple-purple)/0.008)] rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s", animationDuration: "5s" }}
        />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10">
        <Container size="xl" className="py-[var(--apple-space-6)]">
          {content}
        </Container>
      </div>
    </div>
  );
}
