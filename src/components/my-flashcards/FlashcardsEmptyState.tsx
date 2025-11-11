import { BookOpen } from "lucide-react";
import { EmptyState, Stack, Button } from "../apple-hig";

export function FlashcardsEmptyState() {
  return (
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
          <Button variant="default" color="blue" size="large" onClick={() => (window.location.href = "/add-flashcard")}>
            Dodaj ręcznie
          </Button>
        </Stack>
      }
    />
  );
}
