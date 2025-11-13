import type { SupabaseClient } from "../../db/supabase.client";
import type { FlashcardDTO, FlashcardType, CreateFlashcardCommand } from "../../types";

/**
 * Parameters for getFlashcards function
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
 * Result of getFlashcards function
 */
export interface GetFlashcardsResult {
  flashcards: FlashcardDTO[];
  total: number;
}

/**
 * Retrieves flashcards for a given user with filtering, pagination and sorting.
 *
 * @param supabase - Supabase client
 * @param userId - User ID
 * @param params - Query parameters (filters, pagination, sorting)
 * @returns List of flashcards and total number of records
 */
export async function getFlashcards(
  supabase: SupabaseClient,
  userId: string,
  params: GetFlashcardsParams
): Promise<GetFlashcardsResult> {
  const { type, generation_id, page, limit, sort_by, sort_order } = params;

  // Calculate offset for pagination
  const offset = (page - 1) * limit;

  // Build query with filtering by user_id (authorization)
  let query = supabase.from("flashcards").select("*", { count: "exact" }).eq("user_id", userId);

  // Filter by type (optional)
  if (type) {
    query = query.eq("type", type);
  }

  // Filter by generation_id (optional)
  if (generation_id !== undefined) {
    query = query.eq("generation_id", generation_id);
  }

  // Sorting with stable fallback on id
  query = query.order(sort_by, { ascending: sort_order === "asc" });
  // Add id as secondary sort for stable order when primary sort has identical values
  query = query.order("id", { ascending: sort_order === "asc" });

  // Pagination
  query = query.range(offset, offset + limit - 1);

  // Execute query
  const { data, error, count } = await query;

  // Error handling
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
 * Result of createMany function
 */
export interface CreateManyResult {
  flashcards: FlashcardDTO[];
}

/**
 * Retrieves a single flashcard by ID.
 * Verifies that the flashcard belongs to the user.
 *
 * @param supabase - Supabase client
 * @param userId - User ID
 * @param flashcardId - Flashcard ID
 * @returns Flashcard or null if not found
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
    // Not found error is not a technical error
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(`Błąd podczas pobierania fiszki: ${error.message}`);
  }

  return data;
}

/**
 * Updates an existing flashcard.
 * Verifies ownership and validates input data.
 *
 * @param supabase - Supabase client
 * @param userId - User ID
 * @param flashcardId - Flashcard ID
 * @param updateData - Data to update (front and/or back)
 * @returns Updated flashcard
 */
export async function updateFlashcard(
  supabase: SupabaseClient,
  userId: string,
  flashcardId: number,
  updateData: unknown
): Promise<FlashcardDTO> {
  // Dynamic import of validation schema
  const { UpdateFlashcardSchema } = await import("../schemas/flashcard.schema");

  // Input data validation
  const validation = UpdateFlashcardSchema.safeParse(updateData);

  if (!validation.success) {
    throw new Error(`Błąd walidacji: ${validation.error.issues.map((i) => i.message).join(", ")}`);
  }

  const { front, back } = validation.data;

  // Check if flashcard exists and belongs to user
  const existingFlashcard = await getFlashcardById(supabase, userId, flashcardId);

  if (!existingFlashcard) {
    throw new Error("Fiszka nie istnieje lub nie należy do użytkownika");
  }

  // Prepare data for update
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
 * Deletes a flashcard.
 * Verifies ownership through user_id condition in DELETE.
 *
 * @param supabase - Supabase client
 * @param userId - User ID
 * @param flashcardId - Flashcard ID
 * @returns Object with success information and deleted flashcard ID
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

  // Check if anything was deleted
  if (count === 0) {
    return { success: false };
  }

  return { success: true, deletedId: flashcardId };
}

/**
 * Retrieves all flashcard IDs for a user.
 * Used to delete all flashcards before account deletion.
 *
 * @param supabase - Supabase client
 * @param userId - User ID
 * @returns Array of flashcard IDs
 */
export async function getAllFlashcardIds(supabase: SupabaseClient, userId: string): Promise<number[]> {
  const { data, error } = await supabase.from("flashcards").select("id").eq("user_id", userId);

  if (error) {
    throw new Error(`Błąd podczas pobierania ID fiszek: ${error.message}`);
  }

  return (data || []).map((flashcard) => flashcard.id);
}

/**
 * Deletes multiple flashcards at once (bulk delete).
 * Verifies ownership - only deletes flashcards belonging to the user.
 *
 * @param supabase - Supabase client
 * @param userId - User ID
 * @param flashcardIds - Array of flashcard IDs to delete
 * @returns Number of deleted flashcards
 */
export async function bulkDeleteFlashcards(
  supabase: SupabaseClient,
  userId: string,
  flashcardIds: number[]
): Promise<{ deletedCount: number }> {
  // If no flashcards to delete, return 0
  if (flashcardIds.length === 0) {
    return { deletedCount: 0 };
  }

  // Deduplicate IDs
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
 * Helper function to validate generation_id.
 * Checks if generation_id exists and belongs to the user.
 *
 * @param supabase - Supabase client
 * @param userId - User ID
 * @param generationId - Generation ID to validate
 * @throws Error if generation_id does not exist or does not belong to user
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
 * Creates a single flashcard.
 *
 * Flow:
 * 1. Validate generation_id (if AI)
 * 2. INSERT flashcard
 * 3. UPDATE statistics in generations table (if AI)
 *
 * @param supabase - Supabase client
 * @param userId - User ID
 * @param command - Flashcard data to create
 * @returns Created flashcard
 * @throws Error in case of validation or database error
 */
export async function createOne(
  supabase: SupabaseClient,
  userId: string,
  command: CreateFlashcardCommand
): Promise<FlashcardDTO> {
  const { front, back, source, generation_id } = command;

  // 1. Validate generation_id for AI flashcards
  if ((source === "ai-full" || source === "ai-edited") && generation_id) {
    await validateGenerationOwnership(supabase, userId, generation_id);
  }

  // 2. INSERT flashcard
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

  // 3. UPDATE statistics for AI flashcards
  if ((source === "ai-full" || source === "ai-edited") && generation_id) {
    // Increment appropriate counter
    // ai-full -> accepted_unedited_count
    // ai-edited -> accepted_edited_count

    // Get current values
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

      // UPDATE with increment
      await supabase.from("generations").update(updateData).eq("id", generation_id);
    }
    // Don't throw error - flashcard was created, only statistics may not be updated
  }

  return flashcard;
}

/**
 * Creates multiple flashcards at once (bulk create).
 *
 * Flow (in transaction):
 * 1. Validate all generation_id (if AI)
 * 2. Bulk INSERT flashcards
 * 3. Group flashcards per generation_id
 * 4. Bulk UPDATE statistics per generation
 *
 * @param supabase - Supabase client
 * @param userId - User ID
 * @param commands - Array of flashcard data to create
 * @returns Created flashcards in the same order as input
 * @throws Error in case of validation or database error
 */
export async function createMany(
  supabase: SupabaseClient,
  userId: string,
  commands: CreateFlashcardCommand[]
): Promise<CreateManyResult> {
  // 1. Validate all generation_id for AI flashcards
  const uniqueGenerationIds = new Set<number>();
  for (const command of commands) {
    if ((command.source === "ai-full" || command.source === "ai-edited") && command.generation_id) {
      uniqueGenerationIds.add(command.generation_id);
    }
  }

  // Validate each unique generation_id
  if (uniqueGenerationIds.size > 0) {
    const { data: generations, error: validationError } = await supabase
      .from("generations")
      .select("id")
      .in("id", Array.from(uniqueGenerationIds))
      .eq("user_id", userId);

    if (validationError) {
      throw new Error(`Błąd podczas walidacji generation_id: ${validationError.message}`);
    }

    // Check if all generation_id exist
    const foundIds = new Set((generations || []).map((g) => g.id));
    const missingIds = Array.from(uniqueGenerationIds).filter((id) => !foundIds.has(id));

    if (missingIds.length > 0) {
      throw new Error(`Generation ID ${missingIds.join(", ")} nie istnieje lub nie należy do użytkownika`);
    }
  }

  // 2. Bulk INSERT flashcards
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

  // 3. Group flashcards per generation_id and count statistics
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

  // 4. Bulk UPDATE statistics per generation
  for (const [generationId, stats] of generationStats.entries()) {
    // Get current values
    const { data: currentGen, error: fetchError } = await supabase
      .from("generations")
      .select("accepted_unedited_count, accepted_edited_count")
      .eq("id", generationId)
      .single();

    if (fetchError || !currentGen) {
      continue; // Don't interrupt entire operation
    }

    // UPDATE with new values
    await supabase
      .from("generations")
      .update({
        accepted_unedited_count: (currentGen.accepted_unedited_count || 0) + stats.accepted_unedited_count,
        accepted_edited_count: (currentGen.accepted_edited_count || 0) + stats.accepted_edited_count,
      })
      .eq("id", generationId);
    // Don't throw error - flashcards were created
  }

  // Return flashcards in the same order as input
  // Supabase INSERT...RETURNING returns in the same order
  return {
    flashcards: insertedFlashcards,
  };
}
