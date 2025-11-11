import { useFlashcards } from "@/hooks/useFlashcards";
import { useFlashcardManagement } from "@/hooks/useFlashcardManagement";
import { FilterSortControls } from "./my-flashcards/FilterSortControls";
import { FlashcardsList } from "./my-flashcards/FlashcardsList";
import { PaginationControls } from "./my-flashcards/PaginationControls";
import { EditFlashcardModal } from "./my-flashcards/EditFlashcardModal";
import { ConfirmationModal } from "./my-flashcards/ConfirmationModal";
import { FlashcardsPageHeader } from "./my-flashcards/FlashcardsPageHeader";
import { FlashcardsEmptyState } from "./my-flashcards/FlashcardsEmptyState";

// Apple HIG Components
import { Stack, Banner, Container, Skeleton, Divider } from "./apple-hig";

export default function MyFlashcardsPage() {
  const { items, loading, error, filters, totalPages, setFilters, fetchPage, refetch } = useFlashcards();

  const {
    editingFlashcard,
    deletingFlashcardId,
    handleEdit,
    handleSaveEdit,
    handleCancelEdit,
    handleDelete,
    handleConfirmDelete,
    handleCancelDelete,
  } = useFlashcardManagement({
    onFlashcardUpdated: refetch,
    onFlashcardDeleted: refetch,
  });

  const handleEditWithFlashcard = (id: number) => {
    const flashcard = items.find((f) => f.id === id);
    if (flashcard) {
      handleEdit(id, flashcard);
    }
  };

  const hasFlashcards = items.length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-[hsl(var(--apple-grouped-bg))]">
      {/* Main Content Container */}
      <div className="flex-1 overflow-y-auto">
        <Container size="xl" className="py-[var(--apple-space-8)]">
          <Stack direction="vertical" spacing="lg">
            {/* Header */}
            <FlashcardsPageHeader onRefresh={refetch} loading={loading} />

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
            {!loading && !hasFlashcards && <FlashcardsEmptyState />}

            {/* Flashcards List */}
            {!loading && hasFlashcards && (
              <>
                <FlashcardsList items={items} onEdit={handleEditWithFlashcard} onDelete={handleDelete} />

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
