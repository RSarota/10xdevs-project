import { useEffect, useState } from "react";
import { Button, Card, TextArea, Stack, Badge } from "@/components/apple-hig";
import { useTextAreaValidation } from "@/hooks/useTextAreaValidation";
import { FLASHCARD_GENERATION_LIMITS } from "@/lib/constants/flashcardGeneration";

interface FlashcardsFormProps {
  onSubmit: (text: string) => void;
  loading: boolean;
  disabled?: boolean;
}

export function FlashcardsForm({ onSubmit, loading, disabled = false }: FlashcardsFormProps) {
  const [isReady, setIsReady] = useState(false);
  const validation = useTextAreaValidation({
    minLength: FLASHCARD_GENERATION_LIMITS.MIN_LENGTH,
    maxLength: FLASHCARD_GENERATION_LIMITS.MAX_LENGTH,
  });

  useEffect(() => {
    setIsReady(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (disabled) return;
    validation.setValue(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validation.isValid || disabled) {
      return;
    }

    onSubmit(validation.value);
  };

  return (
    <Card elevation="md" padding="xl" variant="grouped" className="h-fit">
      <form
        onSubmit={handleSubmit}
        data-testid="generate-flashcards-form"
        data-ready={isReady ? "true" : "false"}
        aria-busy={!isReady}
      >
        <Stack direction="vertical" spacing="lg">
          <TextArea
            id="source-text"
            value={validation.value}
            onChange={handleChange}
            placeholder="Wklej tutaj tekst z którego chcesz wygenerować fiszki..."
            className="min-h-[300px] sm:min-h-[400px] lg:min-h-[500px] font-mono text-sm !resize-y"
            disabled={loading || disabled}
            rows={20}
            data-testid="generate-flashcards-textarea"
          />

          <Stack direction="horizontal" justify="between" align="center" wrap>
            <div data-testid="generate-character-count">
              <Badge color={validation.badgeColor} variant="outlined" size="md">
                {validation.length.toLocaleString()} / {FLASHCARD_GENERATION_LIMITS.MAX_LENGTH.toLocaleString()} znaków
              </Badge>
            </div>
            {validation.errorMessage && (
              <span className="text-[var(--apple-font-caption-1)] text-[hsl(var(--apple-label-tertiary))]">
                {validation.errorMessage}
              </span>
            )}
          </Stack>

          <Button
            variant="filled"
            color="blue"
            size="large"
            fullWidth
            type="submit"
            disabled={!validation.isValid || loading || disabled}
            isLoading={loading}
            data-testid="button-generuj-fiszki"
          >
            {loading ? "Generowanie..." : "Generuj fiszki"}
          </Button>
        </Stack>
      </form>
    </Card>
  );
}
