import type { GenerateFlashcardsCommand, BulkCreateFlashcardsCommand } from "@/types";

export interface GenerationResponse {
  generation_id: number;
  proposals: { front: string; back: string }[];
}

export interface SaveFlashcardsResponse {
  count: number;
}

/**
 * Service layer dla generowania fiszek
 */
export const flashcardGenerationService = {
  /**
   * Generuje fiszki z tekstu źródłowego
   */
  async generate(command: GenerateFlashcardsCommand): Promise<GenerationResponse> {
    const response = await fetch("/api/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(command),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Wystąpił błąd podczas generowania fiszek");
    }

    return await response.json();
  },

  /**
   * Zapisuje wiele fiszek jednocześnie
   */
  async saveBulk(command: BulkCreateFlashcardsCommand): Promise<SaveFlashcardsResponse> {
    const response = await fetch("/api/flashcards", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(command),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Wystąpił błąd podczas zapisywania fiszek");
    }

    return await response.json();
  },
};
