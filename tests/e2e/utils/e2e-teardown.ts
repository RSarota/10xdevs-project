import type { APIRequestContext } from "@playwright/test";

const E2E_USERNAME_ID = process.env.E2E_USERNAME_ID;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

/**
 * Sprawdza czy teardown jest dostępny (czy E2E_USERNAME_ID jest ustawione)
 */
export function isTeardownAvailable(): boolean {
  return !!E2E_USERNAME_ID;
}

/**
 * Pobiera wszystkie fiszki użytkownika testowego przez API
 * Wymaga autoryzacji - request musi używać storageState z zalogowanym użytkownikiem
 */
async function getAllFlashcards(request: APIRequestContext, baseURL: string): Promise<number[]> {
  if (!E2E_USERNAME_ID) {
    return [];
  }

  try {
    // Pobierz wszystkie fiszki użytkownika (używamy wysokiego limitu aby pobrać wszystkie)
    const response = await request.get(`${baseURL}/api/flashcards?limit=1000&page=1`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok()) {
      // Jeśli nie jesteśmy zalogowani lub błąd, zwróć pustą tablicę
      return [];
    }

    const data = await response.json();
    return (data.data || []).map((flashcard: { id: number }) => flashcard.id);
  } catch {
    return [];
  }
}

/**
 * Usuwa fiszki przez API używając bulk delete
 * Wymaga autoryzacji - request musi używać storageState z zalogowanym użytkownikiem
 */
async function deleteFlashcardsByIds(
  request: APIRequestContext,
  baseURL: string,
  flashcardIds: number[]
): Promise<void> {
  if (flashcardIds.length === 0) {
    return;
  }

  try {
    await request.post(`${baseURL}/api/flashcards/bulk-delete`, {
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        flashcard_ids: flashcardIds,
      },
    });
  } catch (error) {
    // Ignoruj błędy podczas teardown - nie chcemy przerywać testów
    console.warn("Failed to delete flashcards during teardown:", error);
  }
}

/**
 * Usuwa wszystkie rekordy z tabeli przez Supabase REST API
 * Wymaga autoryzacji - request musi używać storageState z zalogowanym użytkownikiem
 */
async function deleteRecordsByUserId(request: APIRequestContext, tableName: string): Promise<void> {
  if (!SUPABASE_URL || !SUPABASE_KEY || !E2E_USERNAME_ID) {
    return;
  }

  try {
    // Usuń wszystkie rekordy użytkownika z danej tabeli
    // Używamy Supabase REST API z autoryzacją przez storageState
    const response = await request.delete(`${SUPABASE_URL}/rest/v1/${tableName}?user_id=eq.${E2E_USERNAME_ID}`, {
      headers: {
        apikey: SUPABASE_KEY,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
    });

    if (!response.ok() && response.status() !== 404) {
      // Ignoruj błędy - może brakować polityk DELETE w RLS
      console.warn(`Failed to delete ${tableName} records: ${response.status()} ${response.statusText()}`);
    }
  } catch (error) {
    // Ignoruj błędy podczas teardown - nie chcemy przerywać testów
    console.warn(`Failed to delete ${tableName} records during teardown:`, error);
  }
}

/**
 * Teardown funkcja - usuwa wszystkie rekordy użytkownika testowego ze wszystkich tabel
 * Używa E2E_USERNAME_ID i API endpoints (wymaga autoryzacji przez storageState)
 *
 * Usuwa rekordy z:
 * - flashcards (przez API endpoint)
 * - generations (przez Supabase REST API)
 * - generation_error_logs (przez Supabase REST API)
 *
 * @param request - APIRequestContext z Playwright (używa storageState z zalogowanym użytkownikiem)
 * @param baseURL - Bazowy URL aplikacji (domyślnie http://localhost:3000)
 */
export async function teardownAllFlashcards(
  request: APIRequestContext,
  baseURL: string = "http://localhost:3000"
): Promise<void> {
  if (!isTeardownAvailable()) {
    return;
  }

  // 1. Usuń wszystkie fiszki przez API endpoint
  const flashcardIds = await getAllFlashcards(request, baseURL);
  if (flashcardIds.length > 0) {
    await deleteFlashcardsByIds(request, baseURL, flashcardIds);
  }

  // 2. Usuń wszystkie generacje przez Supabase REST API
  await deleteRecordsByUserId(request, "generations");

  // 3. Usuń wszystkie logi błędów przez Supabase REST API
  await deleteRecordsByUserId(request, "generation_error_logs");
}

/**
 * Dekorator @E2ETeardown - helper do użycia w test.afterEach
 * Automatycznie usuwa wszystkie fiszki użytkownika testowego (E2E_USERNAME_ID)
 *
 * Użycie:
 * ```typescript
 * test.afterEach(teardownE2E);
 * ```
 *
 * Lub z custom baseURL:
 * ```typescript
 * test.afterEach(({ request }) => teardownAllFlashcards(request, "http://custom-url:3000"));
 * ```
 */
export const teardownE2E = async ({ request }: { request: APIRequestContext }) => {
  await teardownAllFlashcards(request);
};
