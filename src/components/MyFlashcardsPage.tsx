import { useState } from "react";
import { toast } from "sonner";
import { useFlashcards } from "@/hooks/useFlashcards";
import { FilterSortControls } from "./my-flashcards/FilterSortControls";
import { FlashcardsList } from "./my-flashcards/FlashcardsList";
import { PaginationControls } from "./my-flashcards/PaginationControls";
import { EditFlashcardModal } from "./my-flashcards/EditFlashcardModal";
import { ConfirmationModal } from "./my-flashcards/ConfirmationModal";
import type { FlashcardDTO, UpdateFlashcardCommand } from "@/types";
import { BookOpen, RefreshCw } from "lucide-react";

// Apple HIG Components
import { Stack, Banner, Container, EmptyState, Skeleton, Button, Title2, Divider } from "./apple-hig";

export default function MyFlashcardsPage() {
  const {
    items,
    loading,
    error,
    filters,
    totalPages,
    setFilters,
    deleteFlashcard,
    updateFlashcard,
    fetchPage,
    refetch,
  } = useFlashcards();
  const [editingFlashcard, setEditingFlashcard] = useState<FlashcardDTO | null>(null);
  const [deletingFlashcardId, setDeletingFlashcardId] = useState<number | null>(null);

  const handleEdit = (id: number) => {
    const flashcard = items.find((f) => f.id === id);
    if (flashcard) {
      setEditingFlashcard(flashcard);
    }
  };

  const handleSaveEdit = async (id: number, data: UpdateFlashcardCommand) => {
    try {
      await updateFlashcard(id, data);
      setEditingFlashcard(null);
      toast.success("Fiszka została zaktualizowana!");
    } catch (err) {
      toast.error("Nie udało się zaktualizować fiszki", {
        description: err instanceof Error ? err.message : "Wystąpił nieoczekiwany błąd",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingFlashcard(null);
  };

  const handleDelete = (id: number) => {
    setDeletingFlashcardId(id);
  };

  const handleConfirmDelete = async () => {
    if (deletingFlashcardId === null) return;

    const flashcardId = deletingFlashcardId;
    setDeletingFlashcardId(null);

    try {
      await deleteFlashcard(flashcardId);
      toast.success("Fiszka została usunięta!");
    } catch (err) {
      toast.error("Nie udało się usunąć fiszki", {
        description: err instanceof Error ? err.message : "Wystąpił nieoczekiwany błąd",
      });
    }
  };

  const handleCancelDelete = () => {
    setDeletingFlashcardId(null);
  };

  const hasFlashcards = items.length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-[hsl(var(--apple-grouped-bg))]">
      {/* Main Content Container */}
      <div className="flex-1 overflow-y-auto">
        <Container size="xl" className="py-[var(--apple-space-8)]">
          <Stack direction="vertical" spacing="lg">
            {/* Header with title and refresh */}
            <Stack direction="horizontal" justify="between" align="center">
              <Title2>Twoje fiszki</Title2>
              <Button variant="default" color="blue" size="medium" onClick={refetch} disabled={loading}>
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                Odśwież
              </Button>
            </Stack>

            {/* Error Banner */}
            {error && (
              <Banner
                open={!!error}
                message="Nie udało się załadować fiszek"
                type="error"
                dismissible
                action={{
                  label: "Spróbuj ponownie",
                  onClick: refetch,
                }}
              />
            )}

            {/* Filters */}
            {!loading && <FilterSortControls filters={filters} onChange={setFilters} />}

            <Divider />

            {/* Loading State */}
            {loading && (
              <Stack direction="vertical" spacing="md">
                <Skeleton height={150} />
                <Skeleton height={150} />
                <Skeleton height={150} />
              </Stack>
            )}

            {/* Empty State */}
            {!loading && !hasFlashcards && (
              <EmptyState
                icon={<BookOpen className="w-16 h-16" />}
                title="Brak fiszek"
                description="Nie masz jeszcze żadnych fiszek. Dodaj swoją pierwszą fiszkę!"
                action={
                  <Stack direction="horizontal" spacing="sm">
                    <Button
                      variant="filled"
                      color="blue"
                      size="large"
                      onClick={() => (window.location.href = "/generate-flashcards")}
                    >
                      Wygeneruj fiszki
                    </Button>
                    <Button
                      variant="default"
                      color="blue"
                      size="large"
                      onClick={() => (window.location.href = "/add-flashcard")}
                    >
                      Dodaj ręcznie
                    </Button>
                  </Stack>
                }
              />
            )}

            {/* Flashcards List */}
            {!loading && hasFlashcards && (
              <>
                <FlashcardsList items={items} onEdit={handleEdit} onDelete={handleDelete} />

                {/* Pagination */}
                <PaginationControls page={filters.page} totalPages={totalPages} onChange={fetchPage} />
              </>
            )}
          </Stack>
        </Container>
      </div>

      {/* Modals */}
      <EditFlashcardModal
        flashcard={editingFlashcard}
        open={editingFlashcard !== null}
        onSave={handleSaveEdit}
        onCancel={handleCancelEdit}
      />

      <ConfirmationModal
        isOpen={deletingFlashcardId !== null}
        message="Czy na pewno chcesz usunąć tę fiszkę? Ta operacja jest nieodwracalna."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}
