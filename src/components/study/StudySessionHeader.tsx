import { Badge, Button, Title2, Body } from "@/components/apple-hig";

interface StudySessionHeaderProps {
  flashcardsCount: number;
  currentIndex: number;
  onEndSession: () => void;
  averageRating?: number | null;
  showEndSessionAction?: boolean;
}

export function StudySessionHeader({
  flashcardsCount,
  currentIndex,
  onEndSession,
  averageRating,
  showEndSessionAction = true,
}: StudySessionHeaderProps) {
  const displayIndex = Math.min(currentIndex + 1, flashcardsCount);
  const hasAverageRating = typeof averageRating === "number";
  const formattedAverageRating = hasAverageRating && averageRating !== null ? averageRating.toFixed(2) : null;

  return (
    <div className="flex justify-between items-start flex-wrap gap-4 w-full" data-testid="study-session-header">
      <div className="flex-1 min-w-[240px]">
        <Title2 className="text-[hsl(var(--apple-label))] mb-2">Sesja nauki</Title2>
        <div className="flex items-center gap-3 flex-wrap">
          <Body className="text-[hsl(var(--apple-label-secondary))]">
            Fiszka {displayIndex} z {flashcardsCount}
          </Body>
          {formattedAverageRating && (
            <Badge variant="outlined" color="blue" size="md">
              Średnia {formattedAverageRating}
            </Badge>
          )}
        </div>
      </div>
      {showEndSessionAction && (
        <Button variant="plain" color="red" onClick={onEndSession} data-testid="end-session-button">
          Zakończ sesję
        </Button>
      )}
    </div>
  );
}
