import { useState, useEffect } from "react";
import { toast } from "sonner";
import { FlashcardsForm } from "./generate-flashcards/FlashcardsForm";
import { FlashcardsLoader } from "./generate-flashcards/FlashcardsLoader";
import { ProposalsList } from "./generate-flashcards/ProposalsList";
import { ProposalEditorModal } from "./generate-flashcards/ProposalEditorModal";
import { StepIndicator } from "./generate-flashcards/StepIndicator";
import type { GenerateFlashcardsCommand, BulkCreateFlashcardsCommand } from "@/types";
import { Save, CheckCircle2, RotateCcw, FileText } from "lucide-react";
import { pluralizeWithCount } from "@/lib/polish-plurals";

// Apple HIG Components
import { Button, Card, Stack, Title2, Title3, Callout, Footnote, Banner, EmptyState, Badge } from "./apple-hig";

// ProposalViewModel - reprezentacja propozycji w UI
export interface ProposalViewModel {
  temporary_id: string;
  front: string;
  back: string;
  status: "pending" | "accepted" | "edited" | "rejected";
}

export default function GenerateFlashcardsPage() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [proposals, setProposals] = useState<ProposalViewModel[]>([]);
  const [generationId, setGenerationId] = useState<number | null>(null);
  const [editingProposal, setEditingProposal] = useState<ProposalViewModel | null>(null);
  const [savedFlashcards, setSavedFlashcards] = useState(false);

  const handleGenerate = async (text: string) => {
    setLoading(true);
    setError(null);
    setProposals([]); // Reset poprzednich propozycji
    setSavedFlashcards(false); // Reset statusu zapisu

    try {
      const command: GenerateFlashcardsCommand = {
        source_text: text,
      };

      const response = await fetch("/api/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(command),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Wystąpił błąd podczas generowania fiszek");
      }

      const data = await response.json();

      // Mapowanie odpowiedzi API na ProposalViewModel
      const mappedProposals: ProposalViewModel[] = data.proposals.map(
        (proposal: { front: string; back: string }, index: number) => ({
          temporary_id: `${data.generation_id}-${index}`,
          front: proposal.front,
          back: proposal.back,
          status: "pending" as const,
        })
      );

      setGenerationId(data.generation_id);
      setProposals(mappedProposals);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Wystąpił nieoczekiwany błąd");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = (id: string) => {
    setProposals((prev) => prev.map((p) => (p.temporary_id === id ? { ...p, status: "accepted" as const } : p)));
  };

  const handleEdit = (id: string) => {
    const proposal = proposals.find((p) => p.temporary_id === id);
    if (proposal) {
      setEditingProposal(proposal);
    }
  };

  const handleReject = (id: string) => {
    setProposals((prev) => prev.map((p) => (p.temporary_id === id ? { ...p, status: "rejected" as const } : p)));
  };

  const handleSaveEdit = (editedProposal: ProposalViewModel) => {
    setProposals((prev) => prev.map((p) => (p.temporary_id === editedProposal.temporary_id ? editedProposal : p)));
    setEditingProposal(null);
  };

  const handleCancelEdit = () => {
    setEditingProposal(null);
  };

  const acceptedProposalsCount = proposals.filter((p) => p.status === "accepted" || p.status === "edited").length;
  const reviewedProposalsCount = proposals.filter((p) => p.status !== "pending").length;
  const hasProposals = proposals.length > 0;
  const hasAccepted = acceptedProposalsCount > 0;

  // Scroll to top when proposals are generated
  useEffect(() => {
    if (hasProposals && !loading) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [hasProposals, loading]);

  const handleSaveFlashcards = async () => {
    if (!generationId) {
      toast.error("Brak identyfikatora generacji");
      return;
    }

    const acceptedProposals = proposals.filter((p) => p.status === "accepted" || p.status === "edited");

    if (acceptedProposals.length === 0) {
      toast.error("Brak zaakceptowanych fiszek do zapisania");
      return;
    }

    setSaving(true);

    try {
      // Przygotowanie danych w formacie bulk create
      const bulkCommand: BulkCreateFlashcardsCommand = {
        flashcards: acceptedProposals.map((proposal) => ({
          front: proposal.front,
          back: proposal.back,
          source: proposal.status === "edited" ? "ai-edited" : "ai-full",
          generation_id: generationId,
        })),
      };

      const response = await fetch("/api/flashcards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bulkCommand),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Wystąpił błąd podczas zapisywania fiszek");
      }

      const data = await response.json();

      setSavedFlashcards(true);
      toast.success(`Pomyślnie zapisano ${data.count} fiszek!`, {
        description: "Twoje fiszki zostały dodane do kolekcji",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Wystąpił nieoczekiwany błąd";
      toast.error("Błąd podczas zapisywania", {
        description: errorMessage,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleStartOver = () => {
    setProposals([]);
    setSavedFlashcards(false);
    setGenerationId(null);
    setError(null);
  };

  return (
    <div className="min-h-screen lg:h-screen flex flex-col bg-[hsl(var(--apple-grouped-bg))]">
      {/* Main Content Container */}
      <div className="flex-1 lg:overflow-hidden">
        <div className="h-full max-w-[1600px] mx-auto px-[var(--apple-space-4)] sm:px-[var(--apple-space-5)] py-[var(--apple-space-6)] sm:py-[var(--apple-space-10)]">
          {/* Step Indicator - Always visible */}
          <div className="mb-[var(--apple-space-6)] sm:mb-[var(--apple-space-8)]">
            <div className="max-w-4xl mx-auto">
              <StepIndicator hasProposals={hasProposals} hasAccepted={hasAccepted} />
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[var(--apple-space-6)] lg:gap-[var(--apple-space-8)] lg:h-[calc(100%-var(--apple-space-8)-80px)]">
            {/* LEFT COLUMN - Full height with scroll */}
            <div className="flex flex-col gap-[var(--apple-space-6)] lg:h-full lg:overflow-y-auto lg:pr-[var(--apple-space-2)] lg:pb-[var(--apple-space-8)]">
              {/* Form Card */}
              <div className="flex-1 flex flex-col justify-center min-h-0">
                <FlashcardsForm onSubmit={handleGenerate} loading={loading} />
              </div>

              {/* Error Banner */}
              {error && (
                <Banner open={!!error} message={error} type="error" dismissible onClose={() => setError(null)} />
              )}

              {/* Success Banner in left column */}
              {savedFlashcards && (
                <Banner
                  open={savedFlashcards}
                  message={`Sukces! ${
                    acceptedProposalsCount === 1
                      ? "Fiszka została dodana"
                      : `${pluralizeWithCount(acceptedProposalsCount, "fiszka", "fiszki", "fiszek")} zostało dodanych`
                  } do Twojej kolekcji.`}
                  type="success"
                  icon={<CheckCircle2 className="w-5 h-5" />}
                  action={{
                    label: "Generuj kolejne",
                    onClick: handleStartOver,
                  }}
                />
              )}
            </div>

            {/* RIGHT COLUMN - Scrollable with sticky header */}
            <div className="space-y-[var(--apple-space-6)] lg:h-full lg:overflow-y-auto lg:pr-[var(--apple-space-2)] lg:pb-[var(--apple-space-8)] pb-[var(--apple-space-6)]">
              {/* Stats Header - Sticky at top */}
              {hasProposals && !loading && (
                <div className="sticky top-0 z-20 bg-[hsl(var(--apple-grouped-bg))] pb-[var(--apple-space-6)]">
                  <Card elevation="md" padding="lg" variant="grouped">
                    <Stack direction="vertical" spacing="md">
                      {/* First Row - Title and Stats */}
                      <Stack direction="horizontal" justify="between" align="center">
                        <Stack direction="horizontal" spacing="md" align="center">
                          <Title2>Propozycje</Title2>
                          <Badge color="blue" variant="filled" size="md">
                            {reviewedProposalsCount} / {proposals.length}
                          </Badge>
                        </Stack>
                        <Stack direction="horizontal" spacing="sm" align="center">
                          <Stack direction="vertical" align="end" spacing="none">
                            <Title3 className="text-[hsl(var(--apple-green))]">{acceptedProposalsCount}</Title3>
                            <Footnote className="text-[hsl(var(--apple-label-tertiary))]">zaakceptowano</Footnote>
                          </Stack>
                          {!savedFlashcards && acceptedProposalsCount === 0 && (
                            <Button variant="plain" color="blue" size="small" onClick={handleStartOver}>
                              <RotateCcw className="w-4 h-4" />
                              <span className="hidden xl:inline">Od nowa</span>
                            </Button>
                          )}
                        </Stack>
                      </Stack>

                      {/* Second Row - Action Buttons (when there are accepted proposals) */}
                      {hasAccepted && !savedFlashcards && (
                        <>
                          <div className="h-px bg-[hsl(var(--apple-separator-opaque))]" />
                          <Stack direction="horizontal" spacing="sm" align="center" justify="between">
                            <Callout className="text-[hsl(var(--apple-label-secondary))]">
                              {acceptedProposalsCount === 1
                                ? "1 fiszka gotowa do zapisu"
                                : acceptedProposalsCount < 5
                                  ? `${acceptedProposalsCount} fiszki gotowe do zapisu`
                                  : `${acceptedProposalsCount} fiszek gotowych do zapisu`}
                            </Callout>
                            <Stack direction="horizontal" spacing="sm">
                              <Button variant="plain" color="blue" size="small" onClick={handleStartOver}>
                                <RotateCcw className="w-4 h-4" />
                                <span className="hidden sm:inline">Od nowa</span>
                              </Button>
                              <Button
                                variant="filled"
                                color="green"
                                size="medium"
                                onClick={handleSaveFlashcards}
                                disabled={saving}
                                isLoading={saving}
                              >
                                <Save className="w-4 h-4" />
                                {saving ? "Zapisywanie..." : "Zapisz teraz"}
                              </Button>
                            </Stack>
                          </Stack>
                        </>
                      )}
                    </Stack>
                  </Card>
                </div>
              )}

              {/* Loading State */}
              {loading && (
                <div className="py-[var(--apple-space-10)]">
                  <FlashcardsLoader loading={loading} />
                </div>
              )}

              {/* Empty State */}
              {!loading && !hasProposals && (
                <div className="py-[var(--apple-space-10)]">
                  <EmptyState
                    icon={<FileText className="w-16 h-16" />}
                    title="Brak wygenerowanych fiszek"
                    description="Wklej tekst źródłowy po lewej stronie i wygeneruj fiszki za pomocą AI"
                  />
                </div>
              )}

              {/* Proposals List */}
              {!loading && hasProposals && (
                <ProposalsList
                  proposals={proposals}
                  onAccept={handleAccept}
                  onEdit={handleEdit}
                  onReject={handleReject}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <ProposalEditorModal
        proposal={editingProposal}
        open={editingProposal !== null}
        onSave={handleSaveEdit}
        onCancel={handleCancelEdit}
      />
    </div>
  );
}
