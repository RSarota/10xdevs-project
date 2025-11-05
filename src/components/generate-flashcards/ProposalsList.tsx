import type { ProposalViewModel } from "../GenerateFlashcardsPage";
import { ProposalItem } from "./ProposalItem";

interface ProposalsListProps {
  proposals: ProposalViewModel[];
  onAccept: (id: string) => void;
  onEdit: (id: string) => void;
  onReject: (id: string) => void;
}

export function ProposalsList({ proposals, onAccept, onEdit, onReject }: ProposalsListProps) {
  return (
    <div className="space-y-[var(--apple-space-6)]">
      {proposals.map((proposal) => (
        <ProposalItem
          key={proposal.temporary_id}
          proposal={proposal}
          onAccept={onAccept}
          onEdit={onEdit}
          onReject={onReject}
        />
      ))}
    </div>
  );
}
