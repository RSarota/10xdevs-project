import { Grid } from "@/components/apple-hig";
import { FlashcardItem } from "./FlashcardItem";
import type { FlashcardDTO } from "@/types";

export interface FlashcardsListProps {
  items: FlashcardDTO[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function FlashcardsList({ items, onEdit, onDelete }: FlashcardsListProps) {
  return (
    <Grid columns={3} gap="md" responsive={true} data-testid="flashcards-list">
      {items.map((flashcard) => (
        <FlashcardItem key={flashcard.id} flashcard={flashcard} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </Grid>
  );
}
