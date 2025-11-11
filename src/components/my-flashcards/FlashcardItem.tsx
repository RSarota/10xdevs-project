import { Card, CardContent, Stack, Body, Footnote, Button } from "@/components/apple-hig";
import { Edit, Trash2 } from "lucide-react";
import { FlashcardTypeBadge } from "@/components/flashcards/FlashcardTypeBadge";
import { FlashcardTypeIcon } from "@/components/flashcards/FlashcardTypeIcon";
import { useFlashcardFlip } from "@/hooks/useFlashcardFlip";
import { formatDate } from "@/lib/utils/date";
import type { FlashcardDTO } from "@/types";

export interface FlashcardItemProps {
  flashcard: FlashcardDTO;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function FlashcardItem({ flashcard, onEdit, onDelete }: FlashcardItemProps) {
  const { isFlipped, flip } = useFlashcardFlip();

  return (
    <Card
      elevation="md"
      padding="md"
      variant="grouped"
      className="cursor-pointer w-full"
      onClick={flip}
      data-testid="flashcard-item"
    >
      <CardContent>
        <Stack direction="vertical" spacing="md">
          {/* Header with type badge and actions */}
          <Stack direction="horizontal" justify="between" align="center">
            <Stack direction="horizontal" spacing="sm" align="center">
              <FlashcardTypeIcon type={flashcard.type} />
              <FlashcardTypeBadge type={flashcard.type} />
            </Stack>
            <Stack direction="horizontal" spacing="xs">
              <Button
                variant="plain"
                color="blue"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(flashcard.id);
                }}
                aria-label="Edytuj"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="plain"
                color="red"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(flashcard.id);
                }}
                aria-label="Usuń"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </Stack>
          </Stack>

          {/* Content */}
          <div className="min-h-[80px] flex items-center justify-center">
            {isFlipped ? (
              <Body className="text-[hsl(var(--apple-label))] text-center">{flashcard.back}</Body>
            ) : (
              <Body className="text-[hsl(var(--apple-label))] text-center font-medium">{flashcard.front}</Body>
            )}
          </div>

          {/* Footer with date */}
          <Stack direction="horizontal" justify="between" align="center">
            <Footnote className="text-[hsl(var(--apple-label-tertiary))]">{isFlipped ? "Tył" : "Przód"}</Footnote>
            <Footnote className="text-[hsl(var(--apple-label-tertiary))]">{formatDate(flashcard.created_at)}</Footnote>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
