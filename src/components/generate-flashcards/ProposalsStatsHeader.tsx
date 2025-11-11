import { Title3, Body, Badge } from "@/components/apple-hig";

interface ProposalsStatsHeaderProps {
  reviewedCount: number;
  proposalsCount: number;
  acceptedCount: number;
}

export function ProposalsStatsHeader({ reviewedCount, proposalsCount, acceptedCount }: ProposalsStatsHeaderProps) {
  return (
    <>
      {/* First Row - Title and Stats */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Title3>Propozycje</Title3>
          <Badge color="blue" variant="filled" size="md">
            {reviewedCount} / {proposalsCount}
          </Badge>
        </div>
        <div className="flex flex-col items-end">
          <Title3 className="text-[hsl(var(--apple-green))]">{acceptedCount}</Title3>
          <Body className="text-[var(--apple-font-caption-1)] text-[hsl(var(--apple-label-tertiary))]">
            zaakceptowano
          </Body>
        </div>
      </div>
    </>
  );
}
