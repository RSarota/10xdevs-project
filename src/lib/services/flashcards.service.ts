import type { SupabaseClient } from "../../db/supabase.client";
import type { FlashcardDTO, FlashcardType, CreateFlashcardCommand } from "../../types";

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

/**
 * Wynik funkcji createMany
 */
export interface CreateManyResult {
  flashcards: FlashcardDTO[];
}

/**
 * Pobiera pojedynczą fiszkę na podstawie ID.
 * Weryfikuje, czy fiszka należy do użytkownika.
 *
 * @param supabase - Klient Supabase
 * @param userId - ID użytkownika
 * @param flashcardId - ID fiszki
 * @returns Fiszka lub null jeśli nie znaleziono
 */
export async function getFlashcardById(
  supabase: SupabaseClient,
  userId: string,
  flashcardId: number
): Promise<FlashcardDTO | null> {
  const { data, error } = await supabase
    .from("flashcards")
    .select("*")
    .eq("id", flashcardId)
    .eq("user_id", userId)
    .single();

  if (error) {
    // Not found error nie jest błędem technicznym
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(`Błąd podczas pobierania fiszki: ${error.message}`);
  }

  return data;
}

/**
 * Aktualizuje istniejącą fiszkę.
 * Weryfikuje ownership i waliduje dane wejściowe.
 *
 * @param supabase - Klient Supabase
 * @param userId - ID użytkownika
 * @param flashcardId - ID fiszki
 * @param updateData - Dane do aktualizacji (front i/lub back)
 * @returns Zaktualizowana fiszka
 */
export async function updateFlashcard(
  supabase: SupabaseClient,
  userId: string,
  flashcardId: number,
  updateData: unknown
): Promise<FlashcardDTO> {
  // Dynamiczny import schematu walidacji
  const { UpdateFlashcardSchema } = await import("../schemas/flashcard.schema");

  // Walidacja danych wejściowych
  const validation = UpdateFlashcardSchema.safeParse(updateData);

  if (!validation.success) {
    throw new Error(`Błąd walidacji: ${validation.error.issues.map((i) => i.message).join(", ")}`);
  }

  const { front, back } = validation.data;

  // Sprawdzenie czy fiszka istnieje i należy do użytkownika
  const existingFlashcard = await getFlashcardById(supabase, userId, flashcardId);

  if (!existingFlashcard) {
    throw new Error("Fiszka nie istnieje lub nie należy do użytkownika");
  }

  // Przygotowanie danych do aktualizacji
  const updateFields: Partial<FlashcardDTO> = {};
  if (front !== undefined) updateFields.front = front;
  if (back !== undefined) updateFields.back = back;

  // UPDATE fiszki
  const { data: updatedFlashcard, error } = await supabase
    .from("flashcards")
    .update(updateFields)
    .eq("id", flashcardId)
    .eq("user_id", userId)
    .select()
    .single();

  if (error || !updatedFlashcard) {
    throw new Error(`Błąd podczas aktualizacji fiszki: ${error?.message || "Unknown error"}`);
  }

  return updatedFlashcard;
}

/**
 * Usuwa fiszkę.
 * Weryfikuje ownership poprzez warunek user_id w DELETE.
 *
 * @param supabase - Klient Supabase
 * @param userId - ID użytkownika
 * @param flashcardId - ID fiszki
 * @returns Obiekt z informacją o sukcesie i ID usuniętej fiszki
 */
export async function deleteFlashcard(
  supabase: SupabaseClient,
  userId: string,
  flashcardId: number
): Promise<{ success: boolean; deletedId?: number }> {
  const { error, count } = await supabase
    .from("flashcards")
    .delete({ count: "exact" })
    .eq("id", flashcardId)
    .eq("user_id", userId);

  if (error) {
    throw new Error(`Błąd podczas usuwania fiszki: ${error.message}`);
  }

  // Sprawdzenie czy coś zostało usunięte
  if (count === 0) {
    return { success: false };
  }

  return { success: true, deletedId: flashcardId };
}

/**
 * Pobiera wszystkie ID fiszek użytkownika.
 * Używane do usuwania wszystkich fiszek przed usunięciem konta.
 *
 * @param supabase - Klient Supabase
 * @param userId - ID użytkownika
 * @returns Tablica ID fiszek
 */
export async function getAllFlashcardIds(supabase: SupabaseClient, userId: string): Promise<number[]> {
  const { data, error } = await supabase.from("flashcards").select("id").eq("user_id", userId);

  if (error) {
    throw new Error(`Błąd podczas pobierania ID fiszek: ${error.message}`);
  }

  return (data || []).map((flashcard) => flashcard.id);
}

/**
 * Usuwa wiele fiszek jednocześnie (bulk delete).
 * Weryfikuje ownership - usuwa tylko fiszki należące do użytkownika.
 *
 * @param supabase - Klient Supabase
 * @param userId - ID użytkownika
 * @param flashcardIds - Tablica ID fiszek do usunięcia
 * @returns Liczba usuniętych fiszek
 */
export async function bulkDeleteFlashcards(
  supabase: SupabaseClient,
  userId: string,
  flashcardIds: number[]
): Promise<{ deletedCount: number }> {
  // Jeśli brak fiszek do usunięcia, zwróć 0
  if (flashcardIds.length === 0) {
    return { deletedCount: 0 };
  }

  // Deduplikacja ID
  const uniqueIds = [...new Set(flashcardIds)];

  const { error, count } = await supabase
    .from("flashcards")
    .delete({ count: "exact" })
    .in("id", uniqueIds)
    .eq("user_id", userId);

  if (error) {
    throw new Error(`Błąd podczas usuwania fiszek: ${error.message}`);
  }

  return { deletedCount: count || 0 };
}

/**
 * Pomocnicza funkcja do walidacji generation_id.
 * Sprawdza czy generation_id istnieje i należy do użytkownika.
 *
 * @param supabase - Klient Supabase
 * @param userId - ID użytkownika
 * @param generationId - ID generacji do walidacji
 * @throws Error jeśli generation_id nie istnieje lub nie należy do użytkownika
 */
async function validateGenerationOwnership(
  supabase: SupabaseClient,
  userId: string,
  generationId: number
): Promise<void> {
  const { data, error } = await supabase
    .from("generations")
    .select("id")
    .eq("id", generationId)
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    throw new Error(`Generation ID ${generationId} nie istnieje lub nie należy do użytkownika`);
  }
}

/**
 * Tworzy pojedynczą fiszkę.
 *
 * Przepływ:
 * 1. Walidacja generation_id (jeśli AI)
 * 2. INSERT fiszki
 * 3. UPDATE statystyk w tabeli generations (jeśli AI)
 *
 * @param supabase - Klient Supabase
 * @param userId - ID użytkownika
 * @param command - Dane fiszki do utworzenia
 * @returns Utworzona fiszka
 * @throws Error w przypadku błędu walidacji lub bazy danych
 */
export async function createOne(
  supabase: SupabaseClient,
  userId: string,
  command: CreateFlashcardCommand
): Promise<FlashcardDTO> {
  const { front, back, source, generation_id } = command;

  // 1. Walidacja generation_id dla fiszek AI
  if ((source === "ai-full" || source === "ai-edited") && generation_id) {
    await validateGenerationOwnership(supabase, userId, generation_id);
  }

  // 2. INSERT fiszki
  const { data: flashcard, error: insertError } = await supabase
    .from("flashcards")
    .insert({
      user_id: userId,
      front: front,
      back: back,
      type: source, // source jest aliasem dla FlashcardType
      generation_id: generation_id || null,
    })
    .select()
    .single();

  if (insertError || !flashcard) {
    throw new Error(`Błąd podczas tworzenia fiszki: ${insertError?.message || "Unknown error"}`);
  }

  // 3. UPDATE statystyk dla fiszek AI
  if ((source === "ai-full" || source === "ai-edited") && generation_id) {
    // Inkrementacja odpowiedniego licznika
    // ai-full -> accepted_unedited_count
    // ai-edited -> accepted_edited_count

    // Pobierz aktualne wartości
    const { data: currentGen } = await supabase
      .from("generations")
      .select("accepted_unedited_count, accepted_edited_count")
      .eq("id", generation_id)
      .single();

    if (currentGen) {
      const updateData =
        source === "ai-full"
          ? { accepted_unedited_count: (currentGen.accepted_unedited_count || 0) + 1 }
          : { accepted_edited_count: (currentGen.accepted_edited_count || 0) + 1 };

      // UPDATE z inkrementacją
      await supabase.from("generations").update(updateData).eq("id", generation_id);
    }
    // Nie rzucamy błędu - fiszka została utworzona, tylko statystyki mogą nie być zaktualizowane
  }

  return flashcard;
}

/**
 * Tworzy wiele fiszek jednocześnie (bulk create).
 *
 * Przepływ (w transakcji):
 * 1. Walidacja wszystkich generation_id (jeśli AI)
 * 2. Bulk INSERT fiszek
 * 3. Grupowanie fiszek per generation_id
 * 4. Bulk UPDATE statystyk per generation
 *
 * @param supabase - Klient Supabase
 * @param userId - ID użytkownika
 * @param commands - Tablica danych fiszek do utworzenia
 * @returns Utworzone fiszki w tej samej kolejności co input
 * @throws Error w przypadku błędu walidacji lub bazy danych
 */
export async function createMany(
  supabase: SupabaseClient,
  userId: string,
  commands: CreateFlashcardCommand[]
): Promise<CreateManyResult> {
  // 1. Walidacja wszystkich generation_id dla fiszek AI
  const uniqueGenerationIds = new Set<number>();
  for (const command of commands) {
    if ((command.source === "ai-full" || command.source === "ai-edited") && command.generation_id) {
      uniqueGenerationIds.add(command.generation_id);
    }
  }

  // Walidacja każdego unikalnego generation_id
  if (uniqueGenerationIds.size > 0) {
    const { data: generations, error: validationError } = await supabase
      .from("generations")
      .select("id")
      .in("id", Array.from(uniqueGenerationIds))
      .eq("user_id", userId);

    if (validationError) {
      throw new Error(`Błąd podczas walidacji generation_id: ${validationError.message}`);
    }

    // Sprawdzenie czy wszystkie generation_id istnieją
    const foundIds = new Set((generations || []).map((g) => g.id));
    const missingIds = Array.from(uniqueGenerationIds).filter((id) => !foundIds.has(id));

    if (missingIds.length > 0) {
      throw new Error(`Generation ID ${missingIds.join(", ")} nie istnieje lub nie należy do użytkownika`);
    }
  }

  // 2. Bulk INSERT fiszek
  const flashcardsToInsert = commands.map((command) => ({
    user_id: userId,
    front: command.front,
    back: command.back,
    type: command.source,
    generation_id: command.generation_id || null,
  }));

  const { data: insertedFlashcards, error: insertError } = await supabase
    .from("flashcards")
    .insert(flashcardsToInsert)
    .select();

  if (insertError || !insertedFlashcards) {
    throw new Error(`Błąd podczas tworzenia fiszek: ${insertError?.message || "Unknown error"}`);
  }

  // 3. Grupowanie fiszek per generation_id i liczenie statystyk
  const generationStats = new Map<number, { accepted_unedited_count: number; accepted_edited_count: number }>();

  for (const command of commands) {
    if ((command.source === "ai-full" || command.source === "ai-edited") && command.generation_id) {
      const stats = generationStats.get(command.generation_id) || {
        accepted_unedited_count: 0,
        accepted_edited_count: 0,
      };

      if (command.source === "ai-full") {
        stats.accepted_unedited_count += 1;
      } else {
        stats.accepted_edited_count += 1;
      }

      generationStats.set(command.generation_id, stats);
    }
  }

  // 4. Bulk UPDATE statystyk per generation
  for (const [generationId, stats] of generationStats.entries()) {
    // Pobierz aktualne wartości
    const { data: currentGen, error: fetchError } = await supabase
      .from("generations")
      .select("accepted_unedited_count, accepted_edited_count")
      .eq("id", generationId)
      .single();

    if (fetchError || !currentGen) {
      continue; // Nie przerywamy całej operacji
    }

    // UPDATE z nowymi wartościami
    await supabase
      .from("generations")
      .update({
        accepted_unedited_count: (currentGen.accepted_unedited_count || 0) + stats.accepted_unedited_count,
        accepted_edited_count: (currentGen.accepted_edited_count || 0) + stats.accepted_edited_count,
      })
      .eq("id", generationId);
    // Nie rzucamy błędu - fiszki zostały utworzone
  }

  // Zwracamy fiszki w tej samej kolejności co input
  // Supabase INSERT...RETURNING zwraca w tej samej kolejności
  return {
    flashcards: insertedFlashcards,
  };
}
