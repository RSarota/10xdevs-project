import { Stack } from "@/components/apple-hig";
import { ProposalsStatsHeader } from "./ProposalsStatsHeader";
import { ProposalsActionButtons } from "./ProposalsActionButtons";

interface ProposalsStatsCardProps {
  proposalsCount: number;
  reviewedCount: number;
  acceptedCount: number;
  hasAccepted: boolean;
  savedFlashcards: boolean;
  saving: boolean;
  onStartOver: () => void;
  onSave: () => void;
}

export function ProposalsStatsCard({
  proposalsCount,
  reviewedCount,
  acceptedCount,
  hasAccepted,
  savedFlashcards,
  saving,
  onStartOver,
  onSave,
}: ProposalsStatsCardProps) {
  if (proposalsCount === 0) {
    return null;
  }

  return (
    <div className="sticky top-6 z-10">
      <Stack direction="vertical" spacing="md">
        <ProposalsStatsHeader
          reviewedCount={reviewedCount}
          proposalsCount={proposalsCount}
          acceptedCount={acceptedCount}
        />

        {/* Action Buttons (when there are accepted proposals and not saved) */}
        {hasAccepted && !savedFlashcards && (
          <ProposalsActionButtons
            acceptedCount={acceptedCount}
            saving={saving}
            onStartOver={onStartOver}
            onSave={onSave}
          />
        )}
      </Stack>
    </div>
  );
}
