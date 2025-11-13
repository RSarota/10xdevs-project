import { type FormEvent } from "react";
import { Button } from "@/components/apple-hig/Button";
import { Stack } from "@/components/apple-hig/Layout";
import { BaseModal } from "@/components/ui/BaseModal";
import { FlashcardFormFields } from "@/components/flashcards/FlashcardFormFields";
import { useFlashcardForm } from "@/hooks/useFlashcardForm";
import type { ProposalViewModel } from "../GenerateFlashcardsPage";

interface ProposalEditorModalProps {
  proposal: ProposalViewModel | null;
  open: boolean;
  onSave: (editedProposal: ProposalViewModel) => void;
  onCancel: () => void;
}

export function ProposalEditorModal({ proposal, open, onSave, onCancel }: ProposalEditorModalProps) {
  const form = useFlashcardForm({
    initialData: proposal ? { front: proposal.front, back: proposal.back } : undefined,
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    form.markAllTouched();

    if (!form.isFormValid || !proposal) {
      return;
    }

    const data = form.getData();
    const editedProposal: ProposalViewModel = {
      ...proposal,
      front: data.front,
      back: data.back,
      status: "edited",
    };

    onSave(editedProposal);
  };

  const handleCancel = () => {
    form.resetForm();
    onCancel();
  };

  if (!proposal) {
    return null;
  }

  return (
    <BaseModal
      open={open}
      onClose={handleCancel}
      title="Edytuj fiszkę"
      subtitle="Dostosuj treść fiszki przed zaakceptowaniem"
    >
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
            <Button type="submit" variant="filled" color="green" size="large" disabled={!form.isFormValid}>
              Zapisz i zaakceptuj
            </Button>
          </Stack>
        </Stack>
      </form>
    </BaseModal>
  );
}
