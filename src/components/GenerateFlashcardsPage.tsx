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
    <div className="flex flex-col relative">
      {/* Subtle animated background pattern */}
      <div className="fixed inset-0 opacity-15 pointer-events-none">
        <div
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-[hsl(var(--apple-blue)/0.006)] to-transparent animate-pulse"
          style={{ animationDuration: "4s" }}
        />
        <div
          className="absolute top-1/3 right-1/4 w-80 h-80 bg-[hsl(var(--apple-green)/0.012)] rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s", animationDuration: "6s" }}
        />
        <div
          className="absolute bottom-1/2 left-1/4 w-72 h-72 bg-[hsl(var(--apple-blue)/0.008)] rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s", animationDuration: "5s" }}
        />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10">
        <Container size="xl" className="py-[var(--apple-space-6)]">
          {/* Header Section */}
          <div className="mb-8">
            <Stack direction="vertical" spacing="sm">
              <Title2>Generowanie fiszek</Title2>
              <Body className="text-[hsl(var(--apple-label-secondary))]">
                Wygeneruj fiszki z tekstu źródłowego za pomocą AI
              </Body>
            </Stack>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6" data-testid="generate-error-banner">
              <Banner open={!!error} message={error} type="error" dismissible onClose={() => setError(null)} />
            </div>
          )}

          {/* Grid Layout - Form and Results */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT COLUMN - Form */}
            <div className="lg:sticky lg:top-6 lg:self-start">
              <div className="bg-white/60 dark:bg-black/15 backdrop-blur-sm border border-[hsl(var(--apple-separator))]/25 rounded-3xl p-6 shadow-md">
                <FlashcardsForm key={formKey} onSubmit={handleGenerate} loading={loading} disabled={loading} />
              </div>
            </div>

            {/* RIGHT COLUMN - Results */}
            <div className="space-y-6">
              {/* Stats Card */}
              {!loading && proposals.length > 0 && (
                <div className="bg-white/60 dark:bg-black/15 backdrop-blur-sm border border-[hsl(var(--apple-separator))]/25 rounded-3xl p-6 shadow-md">
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
                </div>
              )}

              {/* Loading State */}
              {loading && (
                <div className="bg-white/60 dark:bg-black/15 backdrop-blur-sm border border-[hsl(var(--apple-separator))]/25 rounded-3xl p-6 shadow-md">
                  <div className="py-12">
                    <FlashcardsLoader loading={loading} />
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!loading && !hasProposals && (
                <div className="bg-white/60 dark:bg-black/15 backdrop-blur-sm border border-[hsl(var(--apple-separator))]/25 rounded-3xl p-6 shadow-md">
                  <div className="py-12">
                    <EmptyState
                      icon={<FileText className="w-16 h-16" />}
                      title="Brak wygenerowanych fiszek"
                      description="Wklej tekst źródłowy po lewej stronie i wygeneruj fiszki za pomocą AI"
                    />
                  </div>
                </div>
              )}

              {/* Proposals List */}
              {!loading && hasProposals && (
                <div className="bg-white/60 dark:bg-black/15 backdrop-blur-sm border border-[hsl(var(--apple-separator))]/25 rounded-3xl p-6 shadow-md">
                  <ProposalsList
                    proposals={proposals}
                    onAccept={handleAccept}
                    onEdit={handleEdit}
                    onReject={handleReject}
                    disabled={savedFlashcards}
                  />
                </div>
              )}
            </div>
          </div>
        </Container>
      </div>

      <ProposalEditorModal
        key={editingProposal?.temporary_id}
        proposal={editingProposal}
        open={editingProposal !== null}
        onSave={handleSaveEdit}
        onCancel={handleCancelEdit}
      />
    </div>
  );
}
