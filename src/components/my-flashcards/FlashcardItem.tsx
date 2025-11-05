import { useState } from "react";
import { Card, CardContent, Stack, Body, Footnote, Button, Badge } from "@/components/apple-hig";
import type { FlashcardDTO } from "@/types";
import { Edit, Trash2, FileText, Sparkles, CheckCircle2 } from "lucide-react";

export interface FlashcardItemProps {
  flashcard: FlashcardDTO;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function FlashcardItem({ flashcard, onEdit, onDelete }: FlashcardItemProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const getTypeIcon = () => {
    switch (flashcard.type) {
      case "manual":
        return <FileText className="w-4 h-4" />;
      case "ai-full":
        return <Sparkles className="w-4 h-4" />;
      case "ai-edited":
        return <CheckCircle2 className="w-4 h-4" />;
    }
  };

  const getTypeBadge = () => {
    switch (flashcard.type) {
      case "manual":
        return (
          <Badge color="gray" variant="filled" size="sm">
            Ręczne
          </Badge>
        );
      case "ai-full":
        return (
          <Badge color="blue" variant="filled" size="sm">
            AI
          </Badge>
        );
      case "ai-edited":
        return (
          <Badge color="green" variant="filled" size="sm">
            AI (edytowane)
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pl-PL", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Card
      elevation="md"
      padding="md"
      variant="grouped"
      className="cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <CardContent>
        <Stack direction="vertical" spacing="md">
          {/* Header with type badge and actions */}
          <Stack direction="horizontal" justify="between" align="center">
            <Stack direction="horizontal" spacing="sm" align="center">
              {getTypeIcon()}
              {getTypeBadge()}
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
