import { Card, Button, Badge, Body, Caption1 } from "@/components/apple-hig";
import type { ProposalViewModel } from "../GenerateFlashcardsPage";
import { Check, Pencil, X, RotateCcw } from "lucide-react";

interface ProposalItemProps {
  proposal: ProposalViewModel;
  onAccept: (id: string) => void;
  onEdit: (id: string) => void;
  onReject: (id: string) => void;
  disabled?: boolean;
}

export function ProposalItem({ proposal, onAccept, onEdit, onReject, disabled = false }: ProposalItemProps) {
  const isAccepted = proposal.status === "accepted";
  const isEdited = proposal.status === "edited";
  const isRejected = proposal.status === "rejected";
  const isPending = proposal.status === "pending";

  const getStatusBadge = () => {
    switch (proposal.status) {
      case "accepted":
        return (
          <Badge color="green" variant="filled" size="sm">
            Zaakceptowano
          </Badge>
        );
      case "edited":
        return (
          <Badge color="blue" variant="filled" size="sm">
            Edytowano
          </Badge>
        );
      case "rejected":
        return (
          <Badge color="red" variant="filled" size="sm">
            Odrzucono
          </Badge>
        );
      default:
        return null;
    }
  };

  const cardClassName = isRejected ? "opacity-40" : "";

  return (
    <Card
      elevation={isRejected ? "none" : isAccepted || isEdited ? "lg" : "md"}
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
            <Body className="text-[hsl(var(--apple-label))] leading-relaxed">{proposal.front}</Body>
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
            <Body className="text-[hsl(var(--apple-label))] leading-relaxed">{proposal.back}</Body>
          </div>
        </div>
      </div>

      {/* Action buttons - footer */}
      {!disabled && (
        <div className="border-t border-[hsl(var(--apple-separator-opaque))] bg-[hsl(var(--apple-fill))]/5 p-[var(--apple-space-4)] flex justify-end gap-[var(--apple-space-2)]">
          {isRejected ? (
            <Button
              variant="default"
              color="green"
              size="small"
              onClick={() => onAccept(proposal.temporary_id)}
              aria-label="Przywróć"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Przywróć</span>
            </Button>
          ) : isPending ? (
            <>
              <Button
                variant="default"
                color="red"
                size="small"
                onClick={() => onReject(proposal.temporary_id)}
                aria-label="Odrzuć"
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:inline">Odrzuć</span>
              </Button>
              <Button
                variant="default"
                color="blue"
                size="small"
                onClick={() => onEdit(proposal.temporary_id)}
                aria-label="Edytuj"
              >
                <Pencil className="w-4 h-4" />
                <span className="hidden sm:inline">Edytuj</span>
              </Button>
              <Button
                variant="filled"
                color="green"
                size="small"
                onClick={() => onAccept(proposal.temporary_id)}
                aria-label="Zaakceptuj"
              >
                <Check className="w-4 h-4" />
                <span className="hidden sm:inline">Zaakceptuj</span>
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="default"
                color="red"
                size="small"
                onClick={() => onReject(proposal.temporary_id)}
                aria-label="Odrzuć"
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:inline">Odrzuć</span>
              </Button>
              <Button
                variant="default"
                color="blue"
                size="small"
                onClick={() => onEdit(proposal.temporary_id)}
                aria-label="Edytuj"
              >
                <Pencil className="w-4 h-4" />
                <span>Edytuj</span>
              </Button>
            </>
          )}
        </div>
      )}
    </Card>
  );
}
