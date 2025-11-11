import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { flashcardGenerationService } from "@/lib/services/flashcardGenerationService";
import { pluralizeWithCount } from "@/lib/polish-plurals";
import type { GenerateFlashcardsCommand, BulkCreateFlashcardsCommand } from "@/types";

// ProposalViewModel - reprezentacja propozycji w UI
export interface ProposalViewModel {
  temporary_id: string;
  front: string;
  back: string;
  status: "pending" | "accepted" | "edited" | "rejected";
}

export function useFlashcardGeneration() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [proposals, setProposals] = useState<ProposalViewModel[]>([]);
  const [generationId, setGenerationId] = useState<number | null>(null);
  const [editingProposal, setEditingProposal] = useState<ProposalViewModel | null>(null);
  const [savedFlashcards, setSavedFlashcards] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const handleGenerate = useCallback(async (text: string) => {
    setLoading(true);
    setError(null);
    setProposals([]);
    setSavedFlashcards(false);

    try {
      const command: GenerateFlashcardsCommand = {
        source_text: text,
      };

      const data = await flashcardGenerationService.generate(command);

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
      const errorMessage = err instanceof Error ? err.message : "Wystąpił nieoczekiwany błąd";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAccept = useCallback((id: string) => {
    setProposals((prev) => prev.map((p) => (p.temporary_id === id ? { ...p, status: "accepted" as const } : p)));
  }, []);

  const handleEdit = useCallback(
    (id: string) => {
      const proposal = proposals.find((p) => p.temporary_id === id);
      if (proposal) {
        setEditingProposal(proposal);
      }
    },
    [proposals]
  );

  const handleReject = useCallback((id: string) => {
    setProposals((prev) => prev.map((p) => (p.temporary_id === id ? { ...p, status: "rejected" as const } : p)));
  }, []);

  const handleSaveEdit = useCallback((editedProposal: ProposalViewModel) => {
    setProposals((prev) => prev.map((p) => (p.temporary_id === editedProposal.temporary_id ? editedProposal : p)));
    setEditingProposal(null);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingProposal(null);
  }, []);

  const handleStartOver = useCallback(() => {
    setProposals([]);
    setSavedFlashcards(false);
    setGenerationId(null);
    setError(null);
    setFormKey((prev) => prev + 1);
  }, []);

  const handleSaveFlashcards = useCallback(async () => {
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
      const bulkCommand: BulkCreateFlashcardsCommand = {
        flashcards: acceptedProposals.map((proposal) => ({
          front: proposal.front,
          back: proposal.back,
          source: proposal.status === "edited" ? "ai-edited" : "ai-full",
          generation_id: generationId,
        })),
      };

      const data = await flashcardGenerationService.saveBulk(bulkCommand);

      toast.success(`Pomyślnie zapisano ${pluralizeWithCount(data.count, "fiszkę", "fiszki", "fiszek")}!`, {
        description: "Twoje fiszki zostały dodane do kolekcji",
      });

      handleStartOver();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Wystąpił nieoczekiwany błąd";
      toast.error("Błąd podczas zapisywania", {
        description: errorMessage,
      });
    } finally {
      setSaving(false);
    }
  }, [generationId, proposals, handleStartOver]);

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

  return {
    // State
    loading,
    saving,
    error,
    proposals,
    generationId,
    editingProposal,
    savedFlashcards,
    formKey,
    acceptedProposalsCount,
    reviewedProposalsCount,
    hasProposals,
    hasAccepted,

    // Actions
    handleGenerate,
    handleAccept,
    handleEdit,
    handleReject,
    handleSaveEdit,
    handleCancelEdit,
    handleSaveFlashcards,
    handleStartOver,
    setError,
  };
}
