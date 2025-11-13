import { FlashcardItem } from "./FlashcardItem";
import type { FlashcardDTO } from "@/types";

export interface FlashcardsListProps {
  items: FlashcardDTO[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function FlashcardsList({ items, onEdit, onDelete }: FlashcardsListProps) {
  return (
    <div className="bg-white/60 dark:bg-black/15 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 items-stretch" data-testid="flashcards-list">
        {items.map((flashcard) => (
          <FlashcardItem key={flashcard.id} flashcard={flashcard} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
}
