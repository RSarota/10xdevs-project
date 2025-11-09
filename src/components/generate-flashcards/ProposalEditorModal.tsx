import { useState, useEffect, type FormEvent } from "react";
import { Button } from "@/components/apple-hig/Button";
import { Input, TextArea } from "@/components/apple-hig/Input";
import { Stack } from "@/components/apple-hig/Layout";
import { Title2, Callout } from "@/components/apple-hig/Typography";
import { Badge } from "@/components/apple-hig/Feedback";
import type { ProposalViewModel } from "../GenerateFlashcardsPage";

interface ProposalEditorModalProps {
  proposal: ProposalViewModel | null;
  open: boolean;
  onSave: (editedProposal: ProposalViewModel) => void;
  onCancel: () => void;
}

const MAX_FRONT_LENGTH = 200;
const MAX_BACK_LENGTH = 500;

export function ProposalEditorModal({ proposal, open, onSave, onCancel }: ProposalEditorModalProps) {
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [touchedFront, setTouchedFront] = useState(false);
  const [touchedBack, setTouchedBack] = useState(false);

  // Resetowanie formularza gdy zmienia się proposal
  useEffect(() => {
    if (proposal) {
      setFront(proposal.front);
      setBack(proposal.back);
      setTouchedFront(false);
      setTouchedBack(false);
    }
  }, [proposal]);

  const frontLength = front.trim().length;
  const backLength = back.trim().length;

  const isFrontValid = frontLength > 0 && frontLength <= MAX_FRONT_LENGTH;
  const isBackValid = backLength > 0 && backLength <= MAX_BACK_LENGTH;
  const isFormValid = isFrontValid && isBackValid;

  const showFrontError = touchedFront && !isFrontValid;
  const showBackError = touchedBack && !isBackValid;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouchedFront(true);
    setTouchedBack(true);

    if (!isFormValid || !proposal) {
      return;
    }

    const editedProposal: ProposalViewModel = {
      ...proposal,
      front: front.trim(),
      back: back.trim(),
      status: "edited",
    };

    onSave(editedProposal);
  };

  const handleCancel = () => {
    setTouchedFront(false);
    setTouchedBack(false);
    onCancel();
  };

  const getFrontBadgeColor = () => {
    if (frontLength === 0) return "gray";
    if (frontLength > MAX_FRONT_LENGTH) return "red";
    return "green";
  };

  const getBackBadgeColor = () => {
    if (backLength === 0) return "gray";
    if (backLength > MAX_BACK_LENGTH) return "red";
    return "green";
  };

  const getFrontHelperText = () => {
    if (frontLength === 0) return undefined;
    if (frontLength > MAX_FRONT_LENGTH) {
      return `Przekroczono o ${frontLength - MAX_FRONT_LENGTH} znaków`;
    }
    return `${MAX_FRONT_LENGTH - frontLength} znaków pozostało`;
  };

  const getBackHelperText = () => {
    if (backLength === 0) return undefined;
    if (backLength > MAX_BACK_LENGTH) {
      return `Przekroczono o ${backLength - MAX_BACK_LENGTH} znaków`;
    }
    return `${MAX_BACK_LENGTH - backLength} znaków pozostało`;
  };

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!proposal || !open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-[var(--apple-space-4)] sm:p-[var(--apple-space-6)]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-[var(--apple-blur-amount)] bg-black/30 transition-opacity"
        onClick={handleCancel}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleCancel();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Close modal"
      />

      {/* Modal */}
      <div
        className="
          relative w-full max-w-2xl
          bg-[hsl(var(--apple-grouped-bg-secondary))]/95
          backdrop-blur-xl
          rounded-[var(--apple-radius-large)]
          shadow-[var(--apple-shadow-xl)]
          overflow-hidden
          transform transition-all duration-[var(--apple-spring-duration)]
          ease-[var(--apple-spring-easing)]
          max-h-[90vh] overflow-y-auto
        "
      >
        {/* Header */}
        <div className="px-[var(--apple-space-6)] pt-[var(--apple-space-6)] pb-[var(--apple-space-5)] border-b border-[hsl(var(--apple-separator-opaque))]">
          <Stack direction="vertical" spacing="sm">
            <Title2 id="modal-title">Edytuj fiszkę</Title2>
            <Callout className="text-[hsl(var(--apple-label-secondary))]">
              Dostosuj treść fiszki przed zaakceptowaniem
            </Callout>
          </Stack>
        </div>

        {/* Content */}
        <div className="px-[var(--apple-space-6)] py-[var(--apple-space-6)]">
          <form onSubmit={handleSubmit}>
            <Stack direction="vertical" spacing="xl">
              <Stack direction="vertical" spacing="lg">
                <Input
                  id="edit-front"
                  label="Przód fiszki"
                  value={front}
                  onChange={(e) => {
                    setFront(e.target.value);
                    if (!touchedFront) setTouchedFront(true);
                  }}
                  placeholder="Pytanie lub termin"
                  error={showFrontError && frontLength === 0 ? "Pole wymagane" : undefined}
                  success={!showFrontError && isFrontValid && touchedFront}
                  helperText={getFrontHelperText()}
                />
                <Stack direction="horizontal" justify="between" align="center">
                  <Badge color={getFrontBadgeColor()} variant="outlined" size="sm">
                    {frontLength} / {MAX_FRONT_LENGTH}
                  </Badge>
                </Stack>
              </Stack>

              <Stack direction="vertical" spacing="lg">
                <TextArea
                  id="edit-back"
                  label="Tył fiszki"
                  value={back}
                  onChange={(e) => {
                    setBack(e.target.value);
                    if (!touchedBack) setTouchedBack(true);
                  }}
                  placeholder="Odpowiedź lub definicja"
                  className="min-h-[150px]"
                  rows={6}
                  error={showBackError && backLength === 0 ? "Pole wymagane" : undefined}
                  success={!showBackError && isBackValid && touchedBack}
                  helperText={getBackHelperText()}
                />
                <Stack direction="horizontal" justify="between" align="center">
                  <Badge color={getBackBadgeColor()} variant="outlined" size="sm">
                    {backLength} / {MAX_BACK_LENGTH}
                  </Badge>
                </Stack>
              </Stack>

              <Stack
                direction="horizontal"
                spacing="md"
                justify="end"
                className="pt-[var(--apple-space-4)] border-t border-[hsl(var(--apple-separator-opaque))]"
              >
                <Button type="button" variant="plain" color="gray" size="medium" onClick={handleCancel}>
                  Anuluj
                </Button>
                <Button type="submit" variant="filled" color="green" size="large" disabled={!isFormValid}>
                  Zapisz i zaakceptuj
                </Button>
              </Stack>
            </Stack>
          </form>
        </div>
      </div>
    </div>
  );
}
