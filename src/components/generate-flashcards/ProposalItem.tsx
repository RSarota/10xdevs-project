import { Badge } from "@/components/apple-hig";
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
  const shadowClasses = isRejected
    ? ""
    : isAccepted || isEdited
      ? "shadow-[var(--apple-shadow-lg)]"
      : "shadow-[var(--apple-shadow-md)]";
  const hoverClasses = isRejected
    ? ""
    : "hover:shadow-[var(--apple-shadow-lg)] hover:-translate-y-0.5 transition-all duration-200";

  return (
    <div
      className={`relative bg-white dark:bg-gray-900 backdrop-blur-sm border border-[hsl(var(--apple-separator))]/25 rounded-3xl ${shadowClasses} ${hoverClasses} ${cardClassName} ${!isRejected ? "cursor-pointer" : ""}`}
    >
      {/* Status badge - absolutne pozycjonowanie */}
      <div className="absolute top-4 right-4 z-10 pointer-events-none">{getStatusBadge()}</div>

      {/* Main content - flashcard style */}
      <ProposalCardContent front={proposal.front} back={proposal.back} />

      {/* Action buttons - footer */}
      <div className="border-t border-[hsl(var(--apple-separator))]/25 bg-transparent p-4 flex justify-end gap-2">
        <ProposalActionButtons
          status={proposal.status}
          onAccept={() => onAccept(proposal.temporary_id)}
          onEdit={() => onEdit(proposal.temporary_id)}
          onReject={() => onReject(proposal.temporary_id)}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
