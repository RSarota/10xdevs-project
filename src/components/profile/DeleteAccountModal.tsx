import { AlertDialog } from "../apple-hig";

interface DeleteAccountModalProps {
  open: boolean;
  deleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteAccountModal({ open, deleting, onConfirm, onCancel }: DeleteAccountModalProps) {
  return (
    <AlertDialog
      open={open}
      onClose={() => !deleting && onCancel()}
      title="Usuń konto"
      message="Czy na pewno chcesz usunąć swoje konto? Ta operacja jest nieodwracalna i wszystkie twoje dane zostaną trwale usunięte."
      primaryAction={{
        label: deleting ? "Usuwanie..." : "Usuń konto",
        onAction: onConfirm,
        destructive: true,
      }}
      cancelAction={{
        label: "Anuluj",
        onAction: () => {
          if (!deleting) {
            onCancel();
          }
        },
      }}
    />
  );
}
