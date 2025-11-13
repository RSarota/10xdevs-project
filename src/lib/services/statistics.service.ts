import type { SupabaseClient } from "../../db/supabase.client";
import type { UserStatisticsDTO, FlashcardType } from "../../types";

/**
 * Pobiera kompleksowe statystyki dla użytkownika.
 *
 * Statystyki obejmują:
 * - Liczba fiszek (ogółem i według typu)
 * - Liczba sesji generowania
 * - Liczba wygenerowanych propozycji
 * - Liczba zaakceptowanych fiszek
 * - Wskaźnik akceptacji (acceptance_rate)
 * - Wskaźnik edycji (edit_rate)
 *
 * @param supabase - Klient Supabase
 * @param userId - ID użytkownika
 * @returns Statystyki użytkownika
 */
export async function getUserStatistics(supabase: SupabaseClient, userId: string): Promise<UserStatisticsDTO> {
  // 1. Pobierz statystyki fiszek (agregacja z GROUP BY type)
  const { data: flashcardsData, error: flashcardsError } = await supabase
    .from("flashcards")
    .select("type")
    .eq("user_id", userId);

  if (flashcardsError) {
    throw new Error(`Błąd podczas pobierania statystyk fiszek: ${flashcardsError.message}`);
  }

  // Count flashcards by type
  const flashcardsByType: Record<FlashcardType, number> = {
    manual: 0,
    "ai-full": 0,
    "ai-edited": 0,
  };

  (flashcardsData || []).forEach((flashcard) => {
    if (flashcard.type in flashcardsByType) {
      flashcardsByType[flashcard.type as FlashcardType]++;
    }
  });

  const totalFlashcards = flashcardsData?.length || 0;

  // 2. Pobierz statystyki generacji (agregacja SUM)
  const { data: generationsData, error: generationsError } = await supabase
    .from("generations")
    .select("generated_count, accepted_unedited_count, accepted_edited_count")
    .eq("user_id", userId);

  if (generationsError) {
    throw new Error(`Błąd podczas pobierania statystyk generacji: ${generationsError.message}`);
  }

  // Obliczenie sum
  let totalSessions = 0;
  let totalGenerated = 0;
  let totalAcceptedUnedited = 0;
  let totalAcceptedEdited = 0;

  (generationsData || []).forEach((gen) => {
    totalSessions++;
    totalGenerated += gen.generated_count || 0;
    totalAcceptedUnedited += gen.accepted_unedited_count || 0;
    totalAcceptedEdited += gen.accepted_edited_count || 0;
  });

  const totalAccepted = totalAcceptedUnedited + totalAcceptedEdited;

  // 3. Calculate indicators (with protection against division by 0)
  const acceptanceRate = totalGenerated > 0 ? Math.round((totalAccepted / totalGenerated) * 100 * 100) / 100 : 0;
  const editRate = totalAccepted > 0 ? Math.round((totalAcceptedEdited / totalAccepted) * 100 * 100) / 100 : 0;

  // 4. Return statistics
  return {
    flashcards: {
      total: totalFlashcards,
      by_type: flashcardsByType,
    },
    generations: {
      total_sessions: totalSessions,
      total_generated: totalGenerated,
      total_accepted: totalAccepted,
      acceptance_rate: acceptanceRate,
      edit_rate: editRate,
    },
  };
}
