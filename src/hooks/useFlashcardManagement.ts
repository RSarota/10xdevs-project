import { useState, useCallback } from "react";
import { toast } from "sonner";
import { deleteFlashcard, updateFlashcard } from "@/lib/services/flashcardService";
import type { FlashcardDTO, UpdateFlashcardCommand } from "@/types";

export interface UseFlashcardManagementReturn {
  editingFlashcard: FlashcardDTO | null;
  deletingFlashcardId: number | null;
  handleEdit: (id: number, flashcard: FlashcardDTO) => void;
  handleSaveEdit: (id: number, data: UpdateFlashcardCommand) => Promise<void>;
  handleCancelEdit: () => void;
  handleDelete: (id: number) => void;
  handleConfirmDelete: () => Promise<void>;
  handleCancelDelete: () => void;
  onFlashcardUpdated?: () => void;
  onFlashcardDeleted?: () => void;
}

export function useFlashcardManagement(options?: {
  onFlashcardUpdated?: () => void;
  onFlashcardDeleted?: () => void;
}): UseFlashcardManagementReturn {
  const [editingFlashcard, setEditingFlashcard] = useState<FlashcardDTO | null>(null);
  const [deletingFlashcardId, setDeletingFlashcardId] = useState<number | null>(null);

  const handleEdit = useCallback((id: number, flashcard: FlashcardDTO) => {
    setEditingFlashcard(flashcard);
  }, []);

  const handleSaveEdit = useCallback(
    async (id: number, data: UpdateFlashcardCommand) => {
      try {
        await updateFlashcard(id, data);
        setEditingFlashcard(null);
        toast.success("Fiszka została zaktualizowana!");
        options?.onFlashcardUpdated?.();
      } catch (err) {
        toast.error("Nie udało się zaktualizować fiszki", {
          description: err instanceof Error ? err.message : "Wystąpił nieoczekiwany błąd",
        });
        throw err;
      }
    },
    [options]
  );

  const handleCancelEdit = useCallback(() => {
    setEditingFlashcard(null);
  }, []);

  const handleDelete = useCallback((id: number) => {
    setDeletingFlashcardId(id);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (deletingFlashcardId === null) return;

    const flashcardId = deletingFlashcardId;
    setDeletingFlashcardId(null);

    try {
      await deleteFlashcard(flashcardId);
      toast.success("Fiszka została usunięta!");
      options?.onFlashcardDeleted?.();
    } catch (err) {
      toast.error("Nie udało się usunąć fiszki", {
        description: err instanceof Error ? err.message : "Wystąpił nieoczekiwany błąd",
      });
      throw err;
    }
  }, [deletingFlashcardId, options]);

  const handleCancelDelete = useCallback(() => {
    setDeletingFlashcardId(null);
  }, []);

  return {
    editingFlashcard,
    deletingFlashcardId,
    handleEdit,
    handleSaveEdit,
    handleCancelEdit,
    handleDelete,
    handleConfirmDelete,
    handleCancelDelete,
  };
}
