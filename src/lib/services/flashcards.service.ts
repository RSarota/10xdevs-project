import type { SupabaseClient } from "../../db/supabase.client";
import type { FlashcardDTO, FlashcardType } from "../../types";

/**
 * Parametry dla funkcji getFlashcards
 */
export interface GetFlashcardsParams {
  type?: FlashcardType;
  generation_id?: number;
  page: number;
  limit: number;
  sort_by: "created_at" | "updated_at";
  sort_order: "asc" | "desc";
}

/**
 * Wynik funkcji getFlashcards
 */
export interface GetFlashcardsResult {
  flashcards: FlashcardDTO[];
  total: number;
}

/**
 * Pobiera fiszki dla danego użytkownika z zastosowaniem filtrów, paginacji i sortowania.
 *
 * @param supabase - Klient Supabase
 * @param userId - ID użytkownika
 * @param params - Parametry zapytania (filtry, paginacja, sortowanie)
 * @returns Lista fiszek i łączna liczba rekordów
 */
export async function getFlashcards(
  supabase: SupabaseClient,
  userId: string,
  params: GetFlashcardsParams
): Promise<GetFlashcardsResult> {
  const { type, generation_id, page, limit, sort_by, sort_order } = params;

  // Obliczenie offsetu dla paginacji
  const offset = (page - 1) * limit;

  // Budowanie zapytania z filtrowaniem po user_id (autoryzacja)
  let query = supabase.from("flashcards").select("*", { count: "exact" }).eq("user_id", userId);

  // Filtracja według typu (opcjonalne)
  if (type) {
    query = query.eq("type", type);
  }

  // Filtracja według generation_id (opcjonalne)
  if (generation_id !== undefined) {
    query = query.eq("generation_id", generation_id);
  }

  // Sortowanie
  query = query.order(sort_by, { ascending: sort_order === "asc" });

  // Paginacja
  query = query.range(offset, offset + limit - 1);

  // Wykonanie zapytania
  const { data, error, count } = await query;

  // Obsługa błędów
  if (error) {
    console.error("Error fetching flashcards:", error);
    throw new Error(`Błąd podczas pobierania fiszek: ${error.message || error.code || "Unknown error"}`);
  }

  return {
    flashcards: data || [],
    total: count || 0,
  };
}
