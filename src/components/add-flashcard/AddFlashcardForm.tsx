import { useEffect, useState } from "react";
import { Card, CardHeader, Stack, Button } from "@/components/apple-hig";
import { FlashcardFormFields } from "@/components/flashcards/FlashcardFormFields";
import { useFlashcardForm } from "@/hooks/useFlashcardForm";
import type { AddFlashcardFormData } from "@/hooks/useAddFlashcard";

export interface AddFlashcardFormProps {
  onSubmit: (data: AddFlashcardFormData) => void;
  loading?: boolean;
}

export function AddFlashcardForm({ onSubmit, loading = false }: AddFlashcardFormProps) {
  const [isReady, setIsReady] = useState(false);
  const form = useFlashcardForm();

  useEffect(() => {
    setIsReady(true);
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.isFormValid) {
      form.markAllTouched();
      return;
    }

    onSubmit(form.getData());
  };

  return (
    <Card elevation="md" padding="xl" variant="grouped">
      <Stack direction="vertical" spacing="xl">
        <CardHeader title="Dodaj nową fiszkę" subtitle="Stwórz fiszkę ręcznie, wpisując pytanie i odpowiedź" />

        <form
          onSubmit={handleSubmit}
          data-testid="add-flashcard-form"
          data-ready={isReady ? "true" : "false"}
          aria-busy={!isReady}
        >
          <Stack direction="vertical" spacing="lg">
            <FlashcardFormFields
              form={form}
              frontId="add-flashcard-front"
              backId="add-flashcard-back"
              frontPlaceholder="Wpisz pytanie lub termin..."
              backPlaceholder="Wpisz odpowiedź lub definicję..."
              frontTestId="add-flashcard-front-input"
              backTestId="add-flashcard-back-input"
              frontCountTestId="add-flashcard-front-count"
              backCountTestId="add-flashcard-back-count"
            />

            {/* Submit button */}
            <div className="pt-[var(--apple-space-4)]">
              <Button
                type="submit"
                variant="filled"
                color="blue"
                size="large"
                fullWidth
                disabled={!form.isFormValid || loading}
                isLoading={loading}
                data-testid="add-flashcard-submit-button"
              >
                {loading ? "Zapisywanie..." : "Zapisz fiszkę"}
              </Button>
            </div>
          </Stack>
        </form>
      </Stack>
    </Card>
  );
}
