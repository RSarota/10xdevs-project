import { AlertDialog } from "@/components/apple-hig";

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
      message={message}
      primaryAction={{
        label: "Tak, usuń",
        onAction: onConfirm,
        destructive: true,
      }}
      cancelAction={{
        label: "Nie",
        onAction: onCancel,
      }}
    />
  );
}
