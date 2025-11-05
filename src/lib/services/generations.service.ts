import type { SupabaseClient } from "../../db/supabase.client";
import type { GenerationDTO } from "../../types";
import { generateFlashcards, type FlashcardProposal } from "./openai.service";
import { calculateHash } from "../utils/hash";

/**
 * Odpowiedź z endpointu Generate Flashcards
 */
export interface GenerateFlashcardsResponse {
  generation_id: number;
  proposals: FlashcardProposal[];
  source_text_hash: string;
  source_text_length: number;
  generation_duration: number;
  created_at: string;
}

/**
 * Parametry dla funkcji getGenerations
 */
export interface GetGenerationsParams {
  page: number;
  limit: number;
  sort_order: "asc" | "desc";
}

/**
 * Wynik funkcji getGenerations
 */
export interface GetGenerationsResult {
  data: GenerationDTO[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

/**
 * Uproszczona reprezentacja fiszki dla odpowiedzi generacji
 */
export interface FlashcardInGeneration {
  id: number;
  type: "ai-full" | "ai-edited";
  front: string;
  back: string;
  created_at: string;
}

/**
 * Generacja wraz z powiązanymi fiszkami
 */
export interface GenerationWithFlashcards extends GenerationDTO {
  flashcards: FlashcardInGeneration[];
}

/**
 * Tworzy nową generację fiszek.
 *
 * Przepływ:
 * 1. Obliczenie hash i metadanych
 * 2. Wywołanie AI service (mock)
 * 3. Zapis do tabeli generations
 * 4. Zwrócenie propozycji
 *
 * @param supabase - Klient Supabase
 * @param userId - ID użytkownika
 * @param sourceText - Tekst źródłowy
 * @returns Odpowiedź z propozycjami fiszek i metadanymi
 * @throws Error w przypadku błędu
 */
export async function createGeneration(
  supabase: SupabaseClient,
  userId: string,
  sourceText: string
): Promise<GenerateFlashcardsResponse> {
  // 1. Obliczenie metadanych
  const sourceTextHash = await calculateHash(sourceText);
  const sourceTextLength = sourceText.length;

  // 2. Rozpoczęcie pomiaru czasu
  const startTime = Date.now();

  // 3. Wywołanie AI service
  const proposals = await generateFlashcards(sourceText);

  // 4. Zatrzymanie pomiaru czasu
  const generationDuration = Date.now() - startTime;

  // 5. Zapis do bazy danych
  const { data: generation, error } = await supabase
    .from("generations")
    .insert({
      user_id: userId,
      generated_count: proposals.length,
      source_text_hash: sourceTextHash,
      source_text_length: sourceTextLength,
      generation_duration: generationDuration,
      accepted_unedited_count: 0,
      accepted_edited_count: 0,
    })
    .select()
    .single();

  if (error || !generation) {
    throw new Error(`Błąd podczas zapisywania generacji: ${error?.message || "Unknown error"}`);
  }

  // 6. Zwrócenie odpowiedzi
  return {
    generation_id: generation.id,
    proposals,
    source_text_hash: sourceTextHash,
    source_text_length: sourceTextLength,
    generation_duration: generationDuration,
    created_at: generation.created_at,
  };
}

/**
 * Loguje błąd generacji do tabeli generation_error_logs
 *
 * @param supabase - Klient Supabase
 * @param userId - ID użytkownika
 * @param sourceTextHash - Hash tekstu źródłowego
 * @param sourceTextLength - Długość tekstu źródłowego
 * @param errorCode - Kod błędu (np. "API_TIMEOUT", "INVALID_RESPONSE")
 * @param errorMessage - Szczegółowy komunikat błędu
 */
export async function logGenerationError(
  supabase: SupabaseClient,
  userId: string,
  sourceTextHash: string,
  sourceTextLength: number,
  errorCode: string,
  errorMessage: string
): Promise<void> {
  try {
    await supabase.from("generation_error_logs").insert({
      user_id: userId,
      source_text_hash: sourceTextHash,
      source_text_length: sourceTextLength,
      error_code: errorCode,
      error_message: errorMessage,
    });
  } catch (error) {
    // Logowanie błędu nie powinno przerwać głównego przepływu
    console.error("Error logging generation error:", error);
  }
}

/**
 * Pobiera historię generacji dla danego użytkownika z paginacją i sortowaniem.
 *
 * @param supabase - Klient Supabase
 * @param userId - ID użytkownika
 * @param params - Parametry zapytania (paginacja, sortowanie)
 * @returns Lista generacji i metadane paginacji
 */
export async function getGenerations(
  supabase: SupabaseClient,
  userId: string,
  params: GetGenerationsParams
): Promise<GetGenerationsResult> {
  const { page, limit, sort_order } = params;

  // Obliczenie offsetu dla paginacji
  const offset = (page - 1) * limit;

  // Budowanie zapytania z filtrowaniem po user_id
  let query = supabase.from("generations").select("*", { count: "exact" }).eq("user_id", userId);

  // Sortowanie po created_at
  query = query.order("created_at", { ascending: sort_order === "asc" });

  // Paginacja
  query = query.range(offset, offset + limit - 1);

  // Wykonanie zapytania
  const { data, error, count } = await query;

  // Obsługa błędów
  if (error) {
    console.error("Error fetching generations:", error);
    throw new Error(`Błąd podczas pobierania generacji: ${error.message || error.code || "Unknown error"}`);
  }

  return {
    data: data || [],
    pagination: {
      page,
      limit,
      total: count || 0,
      total_pages: Math.ceil((count || 0) / limit),
    },
  };
}

/**
 * Pobiera szczegóły pojedynczej generacji wraz z powiązanymi fiszkami.
 *
 * @param supabase - Klient Supabase
 * @param userId - ID użytkownika
 * @param generationId - ID generacji
 * @returns Generacja z fiszkami lub null jeśli nie znaleziono
 */
export async function getGenerationById(
  supabase: SupabaseClient,
  userId: string,
  generationId: number
): Promise<GenerationWithFlashcards | null> {
  // 1. Pobierz generację
  const { data: generation, error: generationError } = await supabase
    .from("generations")
    .select("*")
    .eq("id", generationId)
    .eq("user_id", userId)
    .single();

  if (generationError) {
    // Not found nie jest błędem technicznym
    if (generationError.code === "PGRST116") {
      return null;
    }
    throw new Error(`Błąd podczas pobierania generacji: ${generationError.message}`);
  }

  if (!generation) {
    return null;
  }

  // 2. Pobierz powiązane fiszki (tylko AI-generated)
  const { data: flashcards, error: flashcardsError } = await supabase
    .from("flashcards")
    .select("id, type, front, back, created_at")
    .eq("generation_id", generationId)
    .in("type", ["ai-full", "ai-edited"])
    .order("created_at", { ascending: true });

  if (flashcardsError) {
    throw new Error(`Błąd podczas pobierania fiszek: ${flashcardsError.message}`);
  }

  // 3. Połącz dane
  return {
    ...generation,
    flashcards: (flashcards || []) as FlashcardInGeneration[],
  };
}
