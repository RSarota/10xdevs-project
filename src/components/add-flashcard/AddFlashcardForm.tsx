import { useState, type FormEvent, type ChangeEvent } from "react";
import { Card, CardHeader, Stack, Input, TextArea, Button, Badge } from "@/components/apple-hig";
import type { AddFlashcardFormData } from "@/hooks/useAddFlashcard";

export interface AddFlashcardFormProps {
  onSubmit: (data: AddFlashcardFormData) => void;
  loading?: boolean;
}

const FRONT_MAX_LENGTH = 200;
const BACK_MAX_LENGTH = 500;

export function AddFlashcardForm({ onSubmit, loading = false }: AddFlashcardFormProps) {
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");

  const frontLength = front.trim().length;
  const backLength = back.trim().length;
  const isValid = frontLength > 0 && frontLength <= FRONT_MAX_LENGTH && backLength > 0 && backLength <= BACK_MAX_LENGTH;

  const handleFrontChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFront(e.target.value);
  };

  const handleBackChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setBack(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isValid) {
      return;
    }

    onSubmit({ front, back });
  };

  const getFrontBadgeColor = () => {
    if (frontLength === 0) return "gray";
    if (frontLength > FRONT_MAX_LENGTH) return "red";
    return "green";
  };

  const getBackBadgeColor = () => {
    if (backLength === 0) return "gray";
    if (backLength > BACK_MAX_LENGTH) return "red";
    return "green";
  };

  return (
    <Card elevation="md" padding="xl" variant="grouped">
      <Stack direction="vertical" spacing="xl">
        <CardHeader title="Dodaj nową fiszkę" subtitle="Stwórz fiszkę ręcznie, wpisując pytanie i odpowiedź" />

        <form onSubmit={handleSubmit}>
          <Stack direction="vertical" spacing="lg">
            {/* Front field */}
            <Input
              id="flashcard-front"
              label="Przód fiszki"
              value={front}
              onChange={handleFrontChange}
              placeholder="Wpisz pytanie lub termin..."
              disabled={loading}
            />

            <div className="pt-[var(--apple-space-2)]">
              <Badge color={getFrontBadgeColor()} variant="outlined" size="md">
                {frontLength} / {FRONT_MAX_LENGTH} znaków
              </Badge>
            </div>

            {/* Back field */}
            <TextArea
              id="flashcard-back"
              label="Tył fiszki"
              value={back}
              onChange={handleBackChange}
              placeholder="Wpisz odpowiedź lub definicję..."
              disabled={loading}
              rows={5}
            />

            <div className="pt-[var(--apple-space-2)]">
              <Badge color={getBackBadgeColor()} variant="outlined" size="md">
                {backLength} / {BACK_MAX_LENGTH} znaków
              </Badge>
            </div>

            {/* Submit button */}
            <div className="pt-[var(--apple-space-4)]">
              <Button
                variant="filled"
                color="blue"
                size="large"
                fullWidth
                type="submit"
                disabled={!isValid || loading}
                isLoading={loading}
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
