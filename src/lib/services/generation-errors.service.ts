import type { SupabaseClient } from "../../db/supabase.client";
import type { GenerationErrorDTO } from "../../types";

/**
 * Parametry dla funkcji getErrors
 */
export interface GetErrorsParams {
  page: number;
  limit: number;
  error_code?: string;
}

/**
 * Wynik funkcji getErrors
 */
export interface GetErrorsResult {
  data: GenerationErrorDTO[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

/**
 * Pobiera logi błędów generacji dla danego użytkownika z paginacją i opcjonalnym filtrowaniem.
 *
 * @param supabase - Klient Supabase
 * @param userId - ID użytkownika
 * @param params - Parametry zapytania (paginacja, filtrowanie)
 * @returns Lista błędów i metadane paginacji
 */
export async function getErrors(
  supabase: SupabaseClient,
  userId: string,
  params: GetErrorsParams
): Promise<GetErrorsResult> {
  const { page, limit, error_code } = params;

  // Calculate offset for pagination
  const offset = (page - 1) * limit;

  // Build query with filtering by user_id
  let query = supabase.from("generation_error_logs").select("*", { count: "exact" }).eq("user_id", userId);

  // Optional filtering by error_code
  if (error_code) {
    query = query.eq("error_code", error_code);
  }

  // Sort by created_at DESC (newest first)
  query = query.order("created_at", { ascending: false });

  // Pagination
  query = query.range(offset, offset + limit - 1);

  // Execute query
  const { data, error, count } = await query;

  // Error handling
  if (error) {
    console.error("Error fetching generation errors:", error);
    throw new Error(`Błąd podczas pobierania logów błędów: ${error.message || error.code || "Unknown error"}`);
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
