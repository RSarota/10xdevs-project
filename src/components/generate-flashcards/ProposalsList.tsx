import type { ProposalViewModel } from "../GenerateFlashcardsPage";
import { ProposalItem } from "./ProposalItem";

interface ProposalsListProps {
  proposals: ProposalViewModel[];
  onAccept: (id: string) => void;
  onEdit: (id: string) => void;
  onReject: (id: string) => void;
  disabled?: boolean;
}

export function ProposalsList({ proposals, onAccept, onEdit, onReject, disabled = false }: ProposalsListProps) {
  return (
    <div className="space-y-[var(--apple-space-5)]" data-testid="proposals-list">
      {proposals.map((proposal, index) => (
        <div
          key={proposal.temporary_id}
          className="animate-in fade-in slide-in-from-bottom-4"
          data-testid="proposal-item"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <ProposalItem
            proposal={proposal}
            onAccept={onAccept}
            onEdit={onEdit}
            onReject={onReject}
            disabled={disabled}
          />
        </div>
      ))}
    </div>
  );
}
