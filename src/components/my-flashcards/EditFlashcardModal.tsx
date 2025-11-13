import { type FormEvent } from "react";
import { Button } from "@/components/apple-hig/Button";
import { Stack } from "@/components/apple-hig/Layout";
import { BaseModal } from "@/components/ui/BaseModal";
import { FlashcardFormFields } from "@/components/flashcards/FlashcardFormFields";
import { useFlashcardForm } from "@/hooks/useFlashcardForm";
import type { FlashcardDTO, UpdateFlashcardCommand } from "@/types";

export interface EditFlashcardModalProps {
  flashcard: FlashcardDTO | null;
  open: boolean;
  onSave: (id: number, data: UpdateFlashcardCommand) => void;
  onCancel: () => void;
}

export function EditFlashcardModal({ flashcard, open, onSave, onCancel }: EditFlashcardModalProps) {
  const form = useFlashcardForm({
    initialData: flashcard ? { front: flashcard.front, back: flashcard.back } : undefined,
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    form.markAllTouched();

    if (!form.isFormValid || !flashcard) {
      return;
    }

    const data = form.getData();
    const updateCommand: UpdateFlashcardCommand = {};

    if (data.front !== flashcard.front) {
      updateCommand.front = data.front;
    }

    if (data.back !== flashcard.back) {
      updateCommand.back = data.back;
    }

    // Zapisz tylko jeśli są zmiany
    if (Object.keys(updateCommand).length > 0) {
      onSave(flashcard.id, updateCommand);
    } else {
      onCancel();
    }
  };

  const handleCancel = () => {
    form.resetForm();
    onCancel();
  };

  if (!flashcard) {
    return null;
  }

  return (
    <BaseModal open={open} onClose={handleCancel} title="Edytuj fiszkę">
      <form onSubmit={handleSubmit}>
        <Stack direction="vertical" spacing="xl">
          <FlashcardFormFields form={form} frontId="edit-front" backId="edit-back" />

          <Stack
            direction="horizontal"
            spacing="md"
            justify="end"
            className="pt-[var(--apple-space-4)] border-t border-[hsl(var(--apple-separator-opaque))]"
          >
            <Button type="button" variant="plain" color="gray" size="medium" onClick={handleCancel}>
              Anuluj
            </Button>
            <Button type="submit" variant="filled" color="blue" size="large" disabled={!form.isFormValid}>
              Zapisz zmiany
            </Button>
          </Stack>
        </Stack>
      </form>
    </BaseModal>
  );
}
