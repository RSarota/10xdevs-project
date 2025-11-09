import { useState, useEffect } from "react";
import { toast } from "sonner";
import { FlashcardsForm } from "./generate-flashcards/FlashcardsForm";
import { FlashcardsLoader } from "./generate-flashcards/FlashcardsLoader";
import { ProposalsList } from "./generate-flashcards/ProposalsList";
import { ProposalEditorModal } from "./generate-flashcards/ProposalEditorModal";
import type { GenerateFlashcardsCommand, BulkCreateFlashcardsCommand } from "@/types";
import { Save, RotateCcw, FileText } from "lucide-react";
import { pluralizeWithCount } from "@/lib/polish-plurals";

// Apple HIG Components
import {
  Button,
  Card,
  Stack,
  Title2,
  Title3,
  Body,
  Callout,
  Banner,
  EmptyState,
  Badge,
  Container,
  Divider,
} from "./apple-hig";

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
  const [formKey, setFormKey] = useState(0);

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

      toast.success(`Pomyślnie zapisano ${pluralizeWithCount(data.count, "fiszkę", "fiszki", "fiszek")}!`, {
        description: "Twoje fiszki zostały dodane do kolekcji",
      });

      // Reset widoku po zapisaniu
      handleStartOver();
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
    setFormKey((prev) => prev + 1); // Reset form by changing key
  };

  return (
    <div className="min-h-screen flex flex-col bg-[hsl(var(--apple-grouped-bg))]">
      {/* Main Content Container */}
      <div className="flex-1 overflow-y-auto">
        <Container size="xl" className="py-[var(--apple-space-8)]">
          <Stack direction="vertical" spacing="xl">
            {/* Header */}
            <Stack direction="vertical" spacing="sm">
              <Title2>Generowanie fiszek</Title2>
              <Body className="text-[hsl(var(--apple-label-secondary))]">
                Wygeneruj fiszki z tekstu źródłowego za pomocą AI
              </Body>
            </Stack>

            {/* Error Banner */}
            {error && <Banner open={!!error} message={error} type="error" dismissible onClose={() => setError(null)} />}

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[var(--apple-space-6)] lg:gap-[var(--apple-space-8)]">
              {/* LEFT COLUMN - Form */}
              <div className="lg:sticky lg:top-[var(--apple-space-8)] lg:self-start">
                <FlashcardsForm key={formKey} onSubmit={handleGenerate} loading={loading} disabled={loading} />
              </div>

              {/* RIGHT COLUMN - Proposals */}
              <div className="space-y-[var(--apple-space-6)]">
                {/* Stats Header */}
                {hasProposals && !loading && (
                  <Card
                    elevation="lg"
                    padding="lg"
                    variant="grouped"
                    className="sticky top-[var(--apple-space-8)] z-10"
                  >
                    <Stack direction="vertical" spacing="md">
                      {/* First Row - Title and Stats */}
                      <Stack direction="horizontal" justify="between" align="center" wrap>
                        <Stack direction="horizontal" spacing="md" align="center">
                          <Title3>Propozycje</Title3>
                          <Badge color="blue" variant="filled" size="md">
                            {reviewedProposalsCount} / {proposals.length}
                          </Badge>
                        </Stack>
                        <Stack direction="vertical" align="end" spacing="none">
                          <Title3 className="text-[hsl(var(--apple-green))]">{acceptedProposalsCount}</Title3>
                          <Body className="text-[var(--apple-font-caption-1)] text-[hsl(var(--apple-label-tertiary))]">
                            zaakceptowano
                          </Body>
                        </Stack>
                      </Stack>

                      {/* Second Row - Action Buttons (when there are accepted proposals and not saved) */}
                      {hasAccepted && !savedFlashcards && (
                        <>
                          <Divider />
                          <Stack
                            direction="vertical"
                            spacing="sm"
                            className="sm:flex-row sm:justify-between sm:items-center"
                          >
                            <Callout className="text-[hsl(var(--apple-label-secondary))]">
                              {acceptedProposalsCount === 1
                                ? "1 fiszka gotowa do zapisu"
                                : acceptedProposalsCount < 5
                                  ? `${acceptedProposalsCount} fiszki gotowe do zapisu`
                                  : `${acceptedProposalsCount} fiszek gotowych do zapisu`}
                            </Callout>
                            <Stack direction="horizontal" spacing="sm" className="flex-wrap">
                              <Button variant="default" color="blue" size="medium" onClick={handleStartOver}>
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
                )}

                {/* Loading State */}
                {loading && (
                  <div className="py-[var(--apple-space-12)]">
                    <FlashcardsLoader loading={loading} />
                  </div>
                )}

                {/* Empty State */}
                {!loading && !hasProposals && (
                  <div className="py-[var(--apple-space-12)]">
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
                    disabled={savedFlashcards}
                  />
                )}
              </div>
            </div>
          </Stack>
        </Container>
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
