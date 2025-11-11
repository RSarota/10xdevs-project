import type { FlashcardDTO, UpdateFlashcardCommand } from "@/types";

/**
 * Service layer dla operacji na fiszkach
 */

export interface DeleteFlashcardResponse {
  success: boolean;
  error?: string;
}

export interface UpdateFlashcardResponse {
  success: boolean;
  error?: string;
  data?: FlashcardDTO;
}

/**
 * Usuwa fiszkę
 */
export async function deleteFlashcard(id: number): Promise<void> {
  const response = await fetch(`/api/flashcards/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      window.location.href = "/auth/login";
      return;
    }
    if (response.status === 404) {
      throw new Error("Fiszka nie istnieje");
    }
    throw new Error("Nie udało się usunąć fiszki");
  }
}

/**
 * Aktualizuje fiszkę
 */
export async function updateFlashcard(id: number, data: UpdateFlashcardCommand): Promise<FlashcardDTO> {
  const response = await fetch(`/api/flashcards/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    if (response.status === 401) {
      window.location.href = "/auth/login";
      throw new Error("Brak autoryzacji");
    }
    if (response.status === 404) {
      throw new Error("Fiszka nie istnieje");
    }
    throw new Error("Nie udało się zaktualizować fiszki");
  }

  return await response.json();
}
