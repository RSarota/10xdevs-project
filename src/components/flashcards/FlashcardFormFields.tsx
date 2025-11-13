import { Input, TextArea } from "@/components/apple-hig/Input";
import { Stack } from "@/components/apple-hig/Layout";
import { Badge } from "@/components/apple-hig/Feedback";
import { FLASHCARD_LIMITS } from "@/lib/constants/flashcardLimits";
import type { useFlashcardForm } from "@/hooks/useFlashcardForm";

export interface FlashcardFormFieldsProps {
  form: ReturnType<typeof useFlashcardForm>;
  frontLabel?: string;
  backLabel?: string;
  frontPlaceholder?: string;
  backPlaceholder?: string;
  frontId?: string;
  backId?: string;
  frontTestId?: string;
  backTestId?: string;
  frontCountTestId?: string;
  backCountTestId?: string;
}

export function FlashcardFormFields({
  form,
  frontLabel = "Przód fiszki",
  backLabel = "Tył fiszki",
  frontPlaceholder = "Pytanie lub termin",
  backPlaceholder = "Odpowiedź lub definicja",
  frontId = "flashcard-front",
  backId = "flashcard-back",
  frontTestId,
  backTestId,
  frontCountTestId,
  backCountTestId,
}: FlashcardFormFieldsProps) {
  return (
    <>
      <Stack direction="vertical" spacing="lg">
        <div>
          <Stack direction="horizontal" justify="between" align="center" className="mb-2">
            <label
              htmlFor={frontId}
              className="text-[var(--apple-font-subheadline)] font-[var(--apple-weight-medium)] text-[hsl(var(--apple-label))]"
            >
              {frontLabel}
            </label>
            <Badge color={form.getFrontBadgeColor()} variant="filled" size="md" data-testid={frontCountTestId}>
              {form.frontLength} / {FLASHCARD_LIMITS.FRONT_MAX}
            </Badge>
          </Stack>
          <Input
            id={frontId}
            value={form.front}
            onChange={(e) => form.handleFrontChange(e.target.value)}
            placeholder={frontPlaceholder}
            error={form.showFrontError && form.frontLength === 0 ? "Pole wymagane" : undefined}
            data-testid={frontTestId || "flashcard-front-input"}
          />
        </div>
      </Stack>

      <Stack direction="vertical" spacing="lg">
        <div>
          <Stack direction="horizontal" justify="between" align="center" className="mb-2">
            <label
              htmlFor={backId}
              className="text-[var(--apple-font-subheadline)] font-[var(--apple-weight-medium)] text-[hsl(var(--apple-label))]"
            >
              {backLabel}
            </label>
            <Badge color={form.getBackBadgeColor()} variant="filled" size="md" data-testid={backCountTestId}>
              {form.backLength} / {FLASHCARD_LIMITS.BACK_MAX}
            </Badge>
          </Stack>
          <TextArea
            id={backId}
            value={form.back}
            onChange={(e) => form.handleBackChange(e.target.value)}
            placeholder={backPlaceholder}
            className="min-h-[150px]"
            rows={6}
            error={form.showBackError && form.backLength === 0 ? "Pole wymagane" : undefined}
            data-testid={backTestId || "flashcard-back-input"}
          />
        </div>
      </Stack>
    </>
  );
}
