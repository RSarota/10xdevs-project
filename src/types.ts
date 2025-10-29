import type { Database } from "./db/database.types";

// -----------------------------
// DTOs and Command Models
// -----------------------------

// 1. Flashcard DTO - odpowiada rekordowi w tabeli flashcards
export type FlashcardDTO = Database["public"]["Tables"]["flashcards"]["Row"];

// 2. CreateFlashcardCommand
// Dane wejściowe dla tworzenia flashcarda.
// Pole "source" określa typ flashcarda:
//    - "manual" -> type: "manual" (i generation_id musi być pominięte lub null)
//    - "ai-unedited" -> type: "ai-full" (i generation_id jest wymagane)
//    - "ai-edited" -> type: "ai-edited" (i generation_id jest wymagane)
export type FlashcardSource = "manual" | "ai-unedited" | "ai-edited";

export interface CreateFlashcardCommand {
  front: string; // wymagane, tekst frontu
  back: string; // wymagane, tekst backu
  source: FlashcardSource; // określa pochodzenie flashcarda
  generation_id?: number; // wymagane dla "ai-unedited" i "ai-edited", null dla "manual"
}

// 3. UpdateFlashcardCommand
// Umożliwia częściową aktualizację flashcarda.
export interface UpdateFlashcardCommand {
  front?: string; // opcjonalnie, nowy tekst frontu
  back?: string; // opcjonalnie, nowy tekst backu
}

// 4. BulkDeleteFlashcardsCommand
// Polecenie do usuwania wielu flashcardów jednocześnie.
export interface BulkDeleteFlashcardsCommand {
  flashcard_ids: number[]; // lista identyfikatorów flashcardów do usunięcia
}

// 5. GenerateFlashcardsCommand
// Polecenie generowania propozycji flashcardów przy użyciu AI.
export interface GenerateFlashcardsCommand {
  source_text: string; // tekst źródłowy o długości 1000-10000 znaków
}

// 6. AcceptGeneratedFlashcardsCommand and GeneratedFlashcardProposal
// Polecenie zatwierdzania wygenerowanych flashcardów.
// Każda propozycja zawiera unikalny "temporary_id" do śledzenia, front, back i source.
// Dla tego polecenia, source może być tylko "ai-unedited" lub "ai-edited".
export type AcceptFlashcardSource = "ai-unedited" | "ai-edited";

export interface GeneratedFlashcardProposal {
  temporary_id: string;
  front: string;
  back: string;
  source: AcceptFlashcardSource;
}

export interface AcceptGeneratedFlashcardsCommand {
  flashcards: GeneratedFlashcardProposal[];
}

// 7. Generation DTO - odpowiada rekordowi w tabeli generations
export type GenerationDTO = Database["public"]["Tables"]["generations"]["Row"];

// 8. GenerationError DTO - odpowiada rekordowi w tabeli generation_error_logs
export type GenerationErrorDTO = Database["public"]["Tables"]["generation_error_logs"]["Row"];

// 9. UserStatisticsDTO
// Odpowiada strukturze danych z endpointu GET /api/users/me/statistics.
export interface UserStatisticsDTO {
  flashcards: {
    total: number;
    by_type: {
      manual: number;
      "ai-full": number;
      "ai-edited": number;
    };
  };
  generations: {
    total_sessions: number;
    total_generated: number;
    total_accepted: number;
    acceptance_rate: number; // procentowa wartość, np. 75
    edit_rate: number; // procentowa wartość, np. 20
  };
}
