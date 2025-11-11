import { Body, Caption1 } from "@/components/apple-hig";

interface ProposalCardContentProps {
  front: string;
  back: string;
}

export function ProposalCardContent({ front, back }: ProposalCardContentProps) {
  return (
    <div className="flex flex-col md:flex-row min-h-[200px]">
      {/* Front side */}
      <div className="flex-1 p-[var(--apple-space-6)] md:p-[var(--apple-space-8)] flex flex-col justify-between border-b md:border-b-0 md:border-r border-[hsl(var(--apple-separator-opaque))]">
        <div>
          <div className="flex items-center gap-[var(--apple-space-2)] mb-[var(--apple-space-4)]">
            <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--apple-blue))]" />
            <Caption1 className="text-[hsl(var(--apple-label-secondary))] uppercase tracking-wider font-[var(--apple-weight-semibold)]">
              Przód
            </Caption1>
          </div>
          <Body className="text-[hsl(var(--apple-label))] leading-relaxed">{front}</Body>
        </div>
      </div>

      {/* Back side */}
      <div className="flex-1 p-[var(--apple-space-6)] md:p-[var(--apple-space-8)] flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-[var(--apple-space-2)] mb-[var(--apple-space-4)]">
            <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--apple-green))]" />
            <Caption1 className="text-[hsl(var(--apple-label-secondary))] uppercase tracking-wider font-[var(--apple-weight-semibold)]">
              Tył
            </Caption1>
          </div>
          <Body className="text-[hsl(var(--apple-label))] leading-relaxed">{back}</Body>
        </div>
      </div>
    </div>
  );
}
