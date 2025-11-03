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

  // Obliczenie offsetu dla paginacji
  const offset = (page - 1) * limit;

  // Budowanie zapytania z filtrowaniem po user_id
  let query = supabase.from("generation_error_logs").select("*", { count: "exact" }).eq("user_id", userId);

  // Opcjonalne filtrowanie po error_code
  if (error_code) {
    query = query.eq("error_code", error_code);
  }

  // Sortowanie po created_at DESC (najnowsze najpierw)
  query = query.order("created_at", { ascending: false });

  // Paginacja
  query = query.range(offset, offset + limit - 1);

  // Wykonanie zapytania
  const { data, error, count } = await query;

  // Obsługa błędów
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
