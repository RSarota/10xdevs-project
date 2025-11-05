import { useState, useEffect } from "react";
import { Sheet, Stack, Input, TextArea, Button, Title2, FormField, Footnote } from "@/components/apple-hig";
import type { FlashcardDTO, UpdateFlashcardCommand } from "@/types";

export interface EditFlashcardModalProps {
  flashcard: FlashcardDTO | null;
  open: boolean;
  onSave: (id: number, data: UpdateFlashcardCommand) => void;
  onCancel: () => void;
}

export function EditFlashcardModal({ flashcard, open, onSave, onCancel }: EditFlashcardModalProps) {
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");

  useEffect(() => {
    if (flashcard) {
      setFront(flashcard.front);
      setBack(flashcard.back);
    }
  }, [flashcard]);

  const handleSave = () => {
    if (!flashcard) return;

    const data: UpdateFlashcardCommand = {};

    if (front.trim() !== flashcard.front) {
      data.front = front.trim();
    }

    if (back.trim() !== flashcard.back) {
      data.back = back.trim();
    }

    onSave(flashcard.id, data);
  };

  const frontLength = front.trim().length;
  const backLength = back.trim().length;
  const isValid = frontLength > 0 && frontLength <= 200 && backLength > 0 && backLength <= 500;

  if (!flashcard) return null;

  return (
    <Sheet open={open} onClose={onCancel} title="Edytuj fiszkę">
      <Stack direction="vertical" spacing="lg">
        <Title2>Edycja fiszki</Title2>

        {/* Front field */}
        <Stack direction="vertical" spacing="xs">
          <FormField
            label="Przód fiszki"
            control={
              <Input
                value={front}
                onChange={(e) => setFront(e.target.value)}
                placeholder="Wpisz pytanie lub termin..."
                maxLength={200}
              />
            }
          />
          <Footnote className="text-[hsl(var(--apple-label-tertiary))]">{frontLength}/200 znaków</Footnote>
        </Stack>

        {/* Back field */}
        <Stack direction="vertical" spacing="xs">
          <FormField
            label="Tył fiszki"
            control={
              <TextArea
                value={back}
                onChange={(e) => setBack(e.target.value)}
                placeholder="Wpisz odpowiedź lub definicję..."
                rows={5}
                maxLength={500}
              />
            }
          />
          <Footnote className="text-[hsl(var(--apple-label-tertiary))]">{backLength}/500 znaków</Footnote>
        </Stack>

        {/* Actions */}
        <Stack direction="horizontal" spacing="sm" justify="end">
          <Button variant="default" color="gray" size="medium" onClick={onCancel}>
            Anuluj
          </Button>
          <Button variant="filled" color="blue" size="medium" onClick={handleSave} disabled={!isValid}>
            Zapisz zmiany
          </Button>
        </Stack>
      </Stack>
    </Sheet>
  );
}
