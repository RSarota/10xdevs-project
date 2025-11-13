import { Search, BookOpen } from "lucide-react";

interface FlashcardsFilteredEmptyStateProps {
  totalFlashcards: number;
  hasActiveFilters: boolean;
}

export function FlashcardsFilteredEmptyState({ totalFlashcards, hasActiveFilters }: FlashcardsFilteredEmptyStateProps) {
  const title = hasActiveFilters ? "Brak fiszek pasujących do filtra" : "Brak fiszek";

  const description = hasActiveFilters
    ? `Masz ${totalFlashcards} ${totalFlashcards === 1 ? "fiszkę" : totalFlashcards <= 4 ? "fiszki" : "fiszek"}, ale żadna nie pasuje do wybranego filtra.`
    : "Nie masz jeszcze żadnych fiszek. Przejdź do sekcji generowania lub dodawania fiszek aby zacząć naukę.";

  return (
    <div className="text-center py-16" data-testid="flashcards-filtered-empty-state">
      <div className="mb-6">
        {hasActiveFilters ? (
          <Search className="w-20 h-20 mx-auto text-gray-300 dark:text-gray-600" />
        ) : (
          <BookOpen className="w-20 h-20 mx-auto text-gray-300 dark:text-gray-600" />
        )}
      </div>

      <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3">{title}</h3>

      <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">{description}</p>
    </div>
  );
}
