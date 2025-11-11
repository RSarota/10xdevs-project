import { Badge, Button, Stack, Title2, Body } from "@/components/apple-hig";

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
    <Stack
      direction="horizontal"
      justify="between"
      align="flex-start"
      wrap
      className="w-full gap-[var(--apple-space-4)]"
      data-testid="study-session-header"
    >
      <Stack direction="vertical" spacing="xs" className="flex-1 min-w-[240px]">
        <Title2 className="text-[hsl(var(--apple-label))]">Sesja nauki</Title2>
        <Stack direction="horizontal" spacing="sm" align="center" wrap>
          <Body className="text-[hsl(var(--apple-label-secondary))]">
            Fiszka {displayIndex} z {flashcardsCount}
          </Body>
          {formattedAverageRating && (
            <Badge variant="outlined" color="blue" size="md">
              Średnia {formattedAverageRating}
            </Badge>
          )}
        </Stack>
      </Stack>
      {showEndSessionAction && (
        <Button variant="plain" color="red" onClick={onEndSession} data-testid="end-session-button">
          Zakończ sesję
        </Button>
      )}
    </Stack>
  );
}
