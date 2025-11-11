import { Card, CardContent, Stack, Body, Footnote } from "@/components/apple-hig";
import { FlashcardTypeBadge } from "@/components/flashcards/FlashcardTypeBadge";
import { FlashcardTypeIcon } from "@/components/flashcards/FlashcardTypeIcon";
import type { FlashcardDTO, FlashcardType } from "@/types";
import type { KeyboardEventHandler } from "react";

interface FlashcardViewProps {
  flashcard: FlashcardDTO;
  isRevealed: boolean;
  onReveal: () => void;
}

export function FlashcardView({ flashcard, isRevealed, onReveal }: FlashcardViewProps) {
  const handleReveal = () => {
    if (isRevealed) {
      return;
    }
    onReveal();
  };

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleReveal();
    }
  };

  const flashcardType = flashcard.type as FlashcardType | undefined;
  const canFlip = !isRevealed;
  const statusLabel = isRevealed ? "Tył" : "Przód";

  return (
    <Card
      elevation="md"
      padding="md"
      variant="grouped"
      className={`w-full ${canFlip ? "cursor-pointer" : "cursor-default"}`}
      onClick={handleReveal}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={canFlip ? 0 : -1}
      aria-pressed={isRevealed}
      data-testid="flashcard-view"
    >
      <CardContent>
        <Stack direction="vertical" spacing="md">
          <Stack direction="horizontal" justify="between" align="center">
            <Stack direction="horizontal" spacing="sm" align="center">
              {flashcardType && <FlashcardTypeIcon type={flashcardType} />}
              {flashcardType && <FlashcardTypeBadge type={flashcardType} />}
            </Stack>
          </Stack>

          <div className="min-h-[80px] flex items-center justify-center px-[var(--apple-space-2)]">
            <Body
              className={`text-[hsl(var(--apple-label))] text-center ${
                canFlip ? "font-medium" : ""
              } whitespace-pre-wrap`}
            >
              {isRevealed ? flashcard.back : flashcard.front}
            </Body>
          </div>

          <Stack direction="horizontal" justify="between" align="center">
            <Footnote className="text-[hsl(var(--apple-label-tertiary))]">{statusLabel}</Footnote>
            {canFlip && <Footnote className="text-[hsl(var(--apple-label-tertiary))]">Kliknij, aby odsłonić</Footnote>}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
