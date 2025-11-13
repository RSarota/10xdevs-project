import { useEffect, useState } from "react";
import { Button, Stack, Badge } from "@/components/apple-hig";
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
    <div className="h-fit">
      <form
        onSubmit={handleSubmit}
        data-testid="generate-flashcards-form"
        data-ready={isReady ? "true" : "false"}
        aria-busy={!isReady}
      >
        <Stack direction="vertical" spacing="lg">
          <div>
            <Stack direction="horizontal" justify="between" align="center" className="mb-2">
              <label
                htmlFor="source-text"
                className="text-[var(--apple-font-subheadline)] font-[var(--apple-weight-medium)] text-[hsl(var(--apple-label))]"
              >
                Tekst źródłowy
              </label>
              <Badge color={validation.badgeColor} variant="filled" size="md" data-testid="generate-character-count">
                {validation.length.toLocaleString()} / {FLASHCARD_GENERATION_LIMITS.MAX_LENGTH.toLocaleString()}
              </Badge>
            </Stack>
            <div className="relative flex px-[var(--apple-space-4)] py-[var(--apple-space-3)] bg-[hsl(var(--apple-grouped-bg-secondary))] border border-[hsl(var(--apple-separator-opaque))] rounded-[var(--apple-radius-medium)] transition-all duration-[var(--apple-spring-duration)] ease-[var(--apple-spring-easing)] hover:border-[hsl(var(--apple-separator))]/60 focus-within:border-[hsl(var(--apple-blue))] focus-within:ring-2 focus-within:ring-[hsl(var(--apple-blue))]/20 focus-within:shadow-[var(--apple-shadow-sm)]">
              <textarea
                id="source-text"
                value={validation.value}
                onChange={handleChange}
                placeholder="Wklej tutaj tekst z którego chcesz wygenerować fiszki..."
                className="flex-1 w-full min-w-0 resize-none bg-transparent text-[var(--apple-font-body)] text-[hsl(var(--apple-label))] placeholder:text-[hsl(var(--apple-label-tertiary))] outline-none disabled:cursor-not-allowed min-h-[300px] sm:min-h-[400px] lg:min-h-[500px]"
                disabled={loading || disabled}
                rows={20}
                data-testid="generate-flashcards-textarea"
                aria-invalid={!!validation.errorMessage}
                aria-describedby={validation.errorMessage ? "source-text-error" : undefined}
              />
            </div>
            {validation.errorMessage && (
              <p
                id="source-text-error"
                className="text-[var(--apple-font-footnote)] text-[hsl(var(--apple-red))] animate-in slide-in-from-top-1 duration-200"
              >
                {validation.errorMessage}
              </p>
            )}
          </div>

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
    </div>
  );
}
