import { Button } from "@/components/apple-hig";
import { Check, Pencil, X, RotateCcw } from "lucide-react";

interface ProposalActionButtonsProps {
  status: "pending" | "accepted" | "edited" | "rejected";
  onAccept: () => void;
  onEdit: () => void;
  onReject: () => void;
  disabled?: boolean;
}

export function ProposalActionButtons({
  status,
  onAccept,
  onEdit,
  onReject,
  disabled = false,
}: ProposalActionButtonsProps) {
  if (disabled) {
    return null;
  }

  if (status === "rejected") {
    return (
      <Button variant="default" color="green" size="small" onClick={onAccept} aria-label="Przywróć">
        <RotateCcw className="w-4 h-4" />
        <span>Przywróć</span>
      </Button>
    );
  }

  if (status === "pending") {
    return (
      <>
        <Button variant="default" color="red" size="small" onClick={onReject} aria-label="Odrzuć">
          <X className="w-4 h-4" />
          <span className="hidden sm:inline">Odrzuć</span>
        </Button>
        <Button variant="default" color="blue" size="small" onClick={onEdit} aria-label="Edytuj">
          <Pencil className="w-4 h-4" />
          <span className="hidden sm:inline">Edytuj</span>
        </Button>
        <Button variant="filled" color="green" size="small" onClick={onAccept} aria-label="Zaakceptuj">
          <Check className="w-4 h-4" />
          <span className="hidden sm:inline">Zaakceptuj</span>
        </Button>
      </>
    );
  }

  // accepted or edited
  return (
    <>
      <Button variant="default" color="red" size="small" onClick={onReject} aria-label="Odrzuć">
        <X className="w-4 h-4" />
        <span className="hidden sm:inline">Odrzuć</span>
      </Button>
      <Button variant="default" color="blue" size="small" onClick={onEdit} aria-label="Edytuj">
        <Pencil className="w-4 h-4" />
        <span>Edytuj</span>
      </Button>
    </>
  );
}
