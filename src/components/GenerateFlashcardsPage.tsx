import { FlashcardsForm } from "./generate-flashcards/FlashcardsForm";
import { FlashcardsLoader } from "./generate-flashcards/FlashcardsLoader";
import { ProposalsList } from "./generate-flashcards/ProposalsList";
import { ProposalEditorModal } from "./generate-flashcards/ProposalEditorModal";
import { ProposalsStatsCard } from "./generate-flashcards/ProposalsStatsCard";
import { useFlashcardGeneration } from "@/hooks/useFlashcardGeneration";
import { FileText } from "lucide-react";

// Apple HIG Components
import { Stack, Title2, Body, Banner, EmptyState, Container } from "./apple-hig";

// Re-export ProposalViewModel for backward compatibility
export type { ProposalViewModel } from "@/hooks/useFlashcardGeneration";

export default function GenerateFlashcardsPage() {
  const {
    loading,
    saving,
    error,
    proposals,
    editingProposal,
    savedFlashcards,
    formKey,
    acceptedProposalsCount,
    reviewedProposalsCount,
    hasProposals,
    hasAccepted,
    handleGenerate,
    handleAccept,
    handleEdit,
    handleReject,
    handleSaveEdit,
    handleCancelEdit,
    handleSaveFlashcards,
    handleStartOver,
    setError,
  } = useFlashcardGeneration();

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
            {error && (
              <div data-testid="generate-error-banner">
                <Banner open={!!error} message={error} type="error" dismissible onClose={() => setError(null)} />
              </div>
            )}

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[var(--apple-space-6)] lg:gap-[var(--apple-space-8)]">
              {/* LEFT COLUMN - Form */}
              <div className="lg:sticky lg:top-[var(--apple-space-8)] lg:self-start">
                <FlashcardsForm key={formKey} onSubmit={handleGenerate} loading={loading} disabled={loading} />
              </div>

              {/* RIGHT COLUMN - Proposals */}
              <div className="space-y-[var(--apple-space-6)]">
                {/* Stats Header */}
                {!loading && (
                  <ProposalsStatsCard
                    proposalsCount={proposals.length}
                    reviewedCount={reviewedProposalsCount}
                    acceptedCount={acceptedProposalsCount}
                    hasAccepted={hasAccepted}
                    savedFlashcards={savedFlashcards}
                    saving={saving}
                    onStartOver={handleStartOver}
                    onSave={handleSaveFlashcards}
                  />
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
