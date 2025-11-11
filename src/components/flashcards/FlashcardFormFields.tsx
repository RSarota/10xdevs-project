import { Input, TextArea } from "@/components/apple-hig/Input";
import { Stack } from "@/components/apple-hig/Layout";
import { Badge } from "@/components/apple-hig/Feedback";
import { FLASHCARD_LIMITS } from "@/lib/constants/flashcardLimits";
import type { useFlashcardForm } from "@/hooks/useFlashcardForm";

export interface FlashcardFormFieldsProps {
  form: ReturnType<typeof useFlashcardForm>;
  showHelperText?: boolean;
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
  showHelperText = false,
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
        <Input
          id={frontId}
          label={frontLabel}
          value={form.front}
          onChange={(e) => form.handleFrontChange(e.target.value)}
          placeholder={frontPlaceholder}
          error={form.showFrontError && form.frontLength === 0 ? "Pole wymagane" : undefined}
          success={!form.showFrontError && form.isFrontValid && form.touchedFront}
          helperText={showHelperText ? form.getFrontHelperText() : undefined}
          data-testid={frontTestId}
        />
        <Stack direction="horizontal" justify="between" align="center">
          <Badge color={form.getFrontBadgeColor()} variant="outlined" size="sm" data-testid={frontCountTestId}>
            {form.frontLength} / {FLASHCARD_LIMITS.FRONT_MAX}
          </Badge>
        </Stack>
      </Stack>

      <Stack direction="vertical" spacing="lg">
        <TextArea
          id={backId}
          label={backLabel}
          value={form.back}
          onChange={(e) => form.handleBackChange(e.target.value)}
          placeholder={backPlaceholder}
          className="min-h-[150px]"
          rows={6}
          error={form.showBackError && form.backLength === 0 ? "Pole wymagane" : undefined}
          success={!form.showBackError && form.isBackValid && form.touchedBack}
          helperText={showHelperText ? form.getBackHelperText() : undefined}
          data-testid={backTestId}
        />
        <Stack direction="horizontal" justify="between" align="center">
          <Badge color={form.getBackBadgeColor()} variant="outlined" size="sm" data-testid={backCountTestId}>
            {form.backLength} / {FLASHCARD_LIMITS.BACK_MAX}
          </Badge>
        </Stack>
      </Stack>
    </>
  );
}
