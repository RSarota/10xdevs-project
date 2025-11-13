import { useCallback } from "react";
import { useFlashcards, type FlashcardsFilters } from "@/hooks/useFlashcards";
import { useFlashcardManagement } from "@/hooks/useFlashcardManagement";
import { FilterSortControls } from "./my-flashcards/FilterSortControls";
import { FlashcardsList } from "./my-flashcards/FlashcardsList";
import { PaginationControls } from "./my-flashcards/PaginationControls";
import { EditFlashcardModal } from "./my-flashcards/EditFlashcardModal";
import { ConfirmationModal } from "./my-flashcards/ConfirmationModal";
import { FlashcardsPageHeader } from "./my-flashcards/FlashcardsPageHeader";
import { FlashcardsFilteredEmptyState } from "./my-flashcards/FlashcardsFilteredEmptyState";

// Apple HIG Components
import { Stack, Banner, Container, Skeleton } from "./apple-hig";

export default function MyFlashcardsPage() {
  const {
    items,
    loading,
    error,
    filters,
    totalPages,
    totalWithoutFilters,
    setFilters,
    fetchPage,
    updateFlashcard,
    deleteFlashcard,
  } = useFlashcards();

  const { editingFlashcard, deletingFlashcardId, handleEdit, handleCancelEdit, handleDelete, handleCancelDelete } =
    useFlashcardManagement();

  const handleEditWithFlashcard = (id: number) => {
    const flashcard = items.find((f) => f.id === id);
    if (flashcard) {
      handleEdit(id, flashcard);
    }
  };

  const hasFlashcards = items.length > 0;
  const hasAnyFlashcards = totalWithoutFilters > 0;
  const hasActiveFilters = !!filters.type;

  // Stable reference for filter change handler to prevent unnecessary re-renders
  const handleFiltersChange = useCallback(
    (newFilters: FlashcardsFilters) => {
      setFilters(newFilters);
    },
    [setFilters]
  );

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
            <FlashcardsPageHeader />
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6">
              <Banner
                open={!!error}
                message="Nie udało się załadować fiszek"
                type="error"
                dismissible
                action={{
                  label: "Spróbuj ponownie",
                  onClick: () => window.location.reload(),
                }}
              />
            </div>
          )}

          {/* Static Filters Section - always visible when user has any flashcards */}
          {hasAnyFlashcards && (
            <div className="mb-6">
              <FilterSortControls filters={filters} onChange={handleFiltersChange} />
            </div>
          )}

          {/* Main Content */}
          <div className="space-y-6">
            {/* Loading State */}
            {loading && (
              <div className="bg-white/60 dark:bg-black/15 backdrop-blur-sm border border-[hsl(var(--apple-separator))]/25 rounded-3xl p-6 shadow-md">
                <Stack direction="vertical" spacing="md">
                  <Skeleton height={150} />
                  <Skeleton height={150} />
                  <Skeleton height={150} />
                </Stack>
              </div>
            )}

            {/* Empty State */}
            {!loading && !hasFlashcards && (
              <div className="bg-white/60 dark:bg-black/15 backdrop-blur-sm border border-[hsl(var(--apple-separator))]/25 rounded-3xl p-6 shadow-md">
                <FlashcardsFilteredEmptyState
                  totalFlashcards={totalWithoutFilters}
                  hasActiveFilters={hasActiveFilters}
                />
              </div>
            )}

            {/* Flashcards List */}
            {!loading && hasFlashcards && (
              <>
                <FlashcardsList items={items} onEdit={handleEditWithFlashcard} onDelete={handleDelete} />

                {/* Pagination */}
                <PaginationControls page={filters.page} totalPages={totalPages} onChange={fetchPage} />
              </>
            )}
          </div>
        </Container>
      </div>

      {/* Modals */}
      <EditFlashcardModal
        key={editingFlashcard?.id || "modal"}
        flashcard={editingFlashcard}
        open={editingFlashcard !== null}
        onSave={async (id, data) => {
          await updateFlashcard(id, data);
          handleCancelEdit();
        }}
        onCancel={handleCancelEdit}
      />

      <ConfirmationModal
        isOpen={deletingFlashcardId !== null}
        message="Czy na pewno chcesz usunąć tę fiszkę? Ta operacja jest nieodwracalna."
        onConfirm={async () => {
          if (deletingFlashcardId) {
            await deleteFlashcard(deletingFlashcardId);
            handleCancelDelete();
          }
        }}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}
