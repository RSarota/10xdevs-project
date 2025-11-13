import { useEffect, type ReactNode } from "react";

import {
  ActivityIndicator,
  Body,
  Button,
  Card,
  CardContent,
  Center,
  Container,
  EmptyState,
  Stack,
} from "@/components/apple-hig";
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
      <Center className="w-full py-[var(--apple-space-12)]" data-testid="study-session-loading">
        <ActivityIndicator />
      </Center>
    );
  } else if (error && flashcards.length === 0) {
    content = (
      <Center className="w-full py-[var(--apple-space-12)]">
        <Card
          elevation="md"
          variant="grouped"
          padding="lg"
          className="w-full max-w-lg"
          data-testid="study-session-error"
        >
          <CardContent spacing="md">
            <Stack direction="vertical" spacing="md" align="center">
              <Body className="text-[hsl(var(--apple-label))] text-center whitespace-pre-line">{error}</Body>
              <Button variant="filled" color="blue" onClick={() => void startSession()}>
                Spróbuj ponownie
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Center>
    );
  } else if (hasSessionEnded && studySession && flashcards.length > 0) {
    content = (
      <Stack direction="vertical" spacing="xl" className="w-full">
        <StudySessionHeader
          flashcardsCount={flashcards.length}
          currentIndex={completedIndex}
          onEndSession={() => void endSession()}
          averageRating={studySession.average_rating}
          showEndSessionAction={false}
        />

        <Card elevation="lg" variant="grouped" padding="lg" className="w-full">
          <CardContent spacing="lg">
            <Stack
              direction="vertical"
              spacing="lg"
              align="center"
              className="text-center"
              data-testid="study-session-complete"
            >
              <StudySessionProgress current={completedIndex} total={flashcards.length} />
              <Body className="text-[hsl(var(--apple-label))] font-medium">
                Sesja została zakończona. Świetna robota!
              </Body>
              <Body className="text-[hsl(var(--apple-label-secondary))] max-w-xl">
                Możesz rozpocząć kolejną sesję, aby utrwalić materiał, albo wrócić na dashboard i sprawdzić inne
                aktywności.
              </Body>
              <Stack direction="horizontal" spacing="md" justify="center" wrap>
                <Button variant="filled" color="blue" onClick={() => void startSession()}>
                  Rozpocznij ponownie
                </Button>
                <Button variant="plain" color="gray" onClick={() => (window.location.href = "/dashboard")}>
                  Wróć na dashboard
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    );
  } else if (!currentFlashcard || !studySession || flashcards.length === 0) {
    content = (
      <Center className="w-full py-[var(--apple-space-12)]">
        <EmptyState
          title="Brak fiszek do powtórek"
          description="Dodaj nowe fiszki lub poczekaj na termin kolejnej sesji."
          action={{
            label: "Odśwież",
            onClick: () => void startSession(),
          }}
          data-testid="study-session-empty"
        />
      </Center>
    );
  } else {
    content = (
      <Stack direction="vertical" spacing="xl" className="w-full">
        <StudySessionHeader
          flashcardsCount={flashcards.length}
          currentIndex={currentFlashcardIndex}
          onEndSession={() => void endSession()}
          averageRating={studySession.average_rating}
        />

        <Card elevation="lg" variant="grouped" padding="lg" className="w-full">
          <CardContent spacing="lg">
            <Stack direction="vertical" spacing="lg" className="w-full">
              <StudySessionProgress current={currentFlashcardIndex} total={flashcards.length} />
              <FlashcardView flashcard={currentFlashcard} isRevealed={isRevealed} onReveal={revealFlashcard} />

              {isRevealed ? (
                <RatingControls onRatingSelect={(rating) => void rateFlashcard(rating)} disabled={isRating} />
              ) : (
                <Body className="text-[hsl(var(--apple-label-tertiary))] text-left">
                  Odsłoń odpowiedź, aby ocenić stopień zapamiętania.
                </Body>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <Container size="lg" className="py-[var(--apple-space-8)]">
          {content}
        </Container>
      </div>
    </div>
  );
}
