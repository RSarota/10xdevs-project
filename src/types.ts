import type { Database } from "./db/database.types";

// -----------------------------
// DTOs and Command Models
// -----------------------------

// 1. Flashcard DTO - odpowiada rekordowi w tabeli flashcards
export type FlashcardDTO = Database["public"]["Tables"]["flashcards"]["Row"];

// 1a. FlashcardType - typ flashcarda przechowywany w bazie danych
// Jest to enum z bazy danych używany w kolumnie "type" tabeli flashcards.
// Możliwe wartości: "manual", "ai-full" (AI bez edycji), "ai-edited" (AI z edycją)
export type FlashcardType = Database["public"]["Enums"]["flashcard_type"];

// 2. CreateFlashcardCommand
// Dane wejściowe dla tworzenia flashcarda (pojedynczego lub wielu).
// FlashcardSource jest aliasem dla FlashcardType - używamy tych samych wartości w API i bazie danych.
// Wymagania:
//    - "manual" -> generation_id musi być null
//    - "ai-full" -> generation_id jest wymagane (flashcard wygenerowany przez AI bez edycji)
//    - "ai-edited" -> generation_id jest wymagane (flashcard wygenerowany przez AI z edycją)
// Limity dla wszystkich flashcardów:
//    - front: max 200 znaków
//    - back: max 500 znaków
export type FlashcardSource = FlashcardType;

export interface CreateFlashcardCommand {
  front: string; // wymagane, tekst frontu (max 200 znaków)
  back: string; // wymagane, tekst backu (max 500 znaków)
  source: FlashcardSource; // określa pochodzenie flashcarda
  generation_id?: number; // wymagane dla "ai-full" i "ai-edited", null dla "manual"
}

// 2a. BulkCreateFlashcardsCommand
// Polecenie do tworzenia wielu flashcardów jednocześnie (max 100).
// Używane w POST /api/flashcards z body: { flashcards: [...] }
export interface BulkCreateFlashcardsCommand {
  flashcards: CreateFlashcardCommand[]; // tablica flashcardów (max 100 elementów)
}

// 2b. BulkCreateFlashcardsResponse
// Odpowiedź z endpointu POST /api/flashcards przy bulk create.
export interface BulkCreateFlashcardsResponse {
  count: number; // liczba utworzonych flashcardów
  flashcards: FlashcardDTO[]; // utworzone flashcardy w tej samej kolejności co request
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
// AI zwraca propozycje (front, back) które NIE są jeszcze zapisane w bazie.
// Użytkownik przegląda propozycje i zatwierdza je przez POST /api/flashcards
// (single lub bulk z CreateFlashcardCommand).
export interface GenerateFlashcardsCommand {
  source_text: string; // tekst źródłowy o długości 1000-10000 znaków
}

// 6. Generation DTO - odpowiada rekordowi w tabeli generations
export type GenerationDTO = Database["public"]["Tables"]["generations"]["Row"];

// 7. GenerationError DTO - odpowiada rekordowi w tabeli generation_error_logs
export type GenerationErrorDTO = Database["public"]["Tables"]["generation_error_logs"]["Row"];

// 8. Study Session DTO - odpowiada rekordowi w tabeli study_sessions
export type StudySessionDTO = Database["public"]["Tables"]["study_sessions"]["Row"];

// 9. Session Flashcard DTO - odpowiada rekordowi w tabeli session_flashcards
export type SessionFlashcardDTO = Database["public"]["Tables"]["session_flashcards"]["Row"];

// 10. CreateStudySessionCommand - dane wejściowe do utworzenia sesji nauki
export interface CreateStudySessionCommand {
  userId: string;
}

// 11. UpdateStudySessionCommand - aktualizacja podstawowych danych sesji
export interface UpdateStudySessionCommand {
  completedAt?: string;
  flashcardsCount?: number;
  averageRating?: number;
}

// 12. StartStudySessionResponse - wynik uruchomienia sesji nauki
export interface StartStudySessionResponse {
  studySession: StudySessionDTO;
  flashcards: FlashcardDTO[];
}

// 13. UpdateSessionFlashcardCommand - dane wejściowe do oceny fiszki w sesji
export interface UpdateSessionFlashcardCommand {
  studySessionId: number;
  flashcardId: number;
  lastRating: number;
}

// 14. GetStudyHistoryResponse - odpowiedź API z historią sesji
export interface GetStudyHistoryResponse {
  studySessions: StudySessionDTO[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    total_pages?: number;
  };
}

// 15. GetFlashcardsDueResponse - odpowiedź z listą fiszek wymagających powtórki
export interface GetFlashcardsDueResponse {
  flashcards: (FlashcardDTO & {
    nextReviewAt: string;
    lastRating: number | null;
    reviewCount: number;
    stability: number;
    difficulty: number;
    lapses: number;
    state: number;
  })[];
}

// 16. UserStatisticsDTO
// Odpowiada strukturze danych z endpointu GET /api/users/me/statistics.
export interface UserStatisticsDTO {
  flashcards: {
    total: number;
    by_type: Record<FlashcardType, number>;
  };
  generations: {
    total_sessions: number;
    total_generated: number;
    total_accepted: number;
    acceptance_rate: number; // procentowa wartość, np. 75
    edit_rate: number; // procentowa wartość, np. 20
  };
}
