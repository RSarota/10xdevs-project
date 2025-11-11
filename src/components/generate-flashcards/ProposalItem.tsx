import { Card, Badge } from "@/components/apple-hig";
import { ProposalCardContent } from "./ProposalCardContent";
import { ProposalActionButtons } from "./ProposalActionButtons";
import type { ProposalViewModel } from "../GenerateFlashcardsPage";

interface ProposalItemProps {
  proposal: ProposalViewModel;
  onAccept: (id: string) => void;
  onEdit: (id: string) => void;
  onReject: (id: string) => void;
  disabled?: boolean;
}

const STATUS_BADGE_CONFIG = {
  accepted: { color: "green" as const, label: "Zaakceptowano" },
  edited: { color: "blue" as const, label: "Edytowano" },
  rejected: { color: "red" as const, label: "Odrzucono" },
} as const;

export function ProposalItem({ proposal, onAccept, onEdit, onReject, disabled = false }: ProposalItemProps) {
  const isRejected = proposal.status === "rejected";
  const isAccepted = proposal.status === "accepted";
  const isEdited = proposal.status === "edited";

  const getStatusBadge = () => {
    if (proposal.status === "pending") return null;
    const config = STATUS_BADGE_CONFIG[proposal.status];
    return (
      <Badge color={config.color} variant="filled" size="sm">
        {config.label}
      </Badge>
    );
  };

  const cardClassName = isRejected ? "opacity-40" : "";
  const elevation = isRejected ? "none" : isAccepted || isEdited ? "lg" : "md";

  return (
    <Card
      elevation={elevation}
      padding="none"
      variant="default"
      hoverable={!isRejected}
      className={`relative ${cardClassName}`}
    >
      {/* Status badge - absolutne pozycjonowanie */}
      <div className="absolute top-[var(--apple-space-4)] right-[var(--apple-space-4)] z-10 pointer-events-none">
        {getStatusBadge()}
      </div>

      {/* Main content - flashcard style */}
      <ProposalCardContent front={proposal.front} back={proposal.back} />

      {/* Action buttons - footer */}
      <div className="border-t border-[hsl(var(--apple-separator-opaque))] bg-[hsl(var(--apple-fill))]/5 p-[var(--apple-space-4)] flex justify-end gap-[var(--apple-space-2)]">
        <ProposalActionButtons
          status={proposal.status}
          onAccept={() => onAccept(proposal.temporary_id)}
          onEdit={() => onEdit(proposal.temporary_id)}
          onReject={() => onReject(proposal.temporary_id)}
          disabled={disabled}
        />
      </div>
    </Card>
  );
}
