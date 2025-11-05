import { AlertDialog, Button, Stack } from "@/components/apple-hig";

export interface ConfirmationModalProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationModal({ isOpen, message, onConfirm, onCancel }: ConfirmationModalProps) {
  return (
    <AlertDialog
      open={isOpen}
      onClose={onCancel}
      title="Potwierdzenie"
      description={message}
      actions={
        <Stack direction="horizontal" spacing="sm" justify="end">
          <Button variant="default" color="gray" size="medium" onClick={onCancel}>
            Nie
          </Button>
          <Button variant="filled" color="red" size="medium" onClick={onConfirm}>
            Tak, usuń
          </Button>
        </Stack>
      }
    />
  );
}
