/**
 * Propozycja fiszki wygenerowana przez AI
 */
export interface FlashcardProposal {
  front: string;
  back: string;
}

/**
 * Mock AI Service - tymczasowa implementacja symulująca wywołanie Azure OpenAI API
 *
 * UWAGA: To jest tymczasowy mock. W przyszłości zostanie zastąpiony prawdziwą integracją
 * z Azure OpenAI przez Azure API Management.
 *
 * @param sourceText - Tekst źródłowy do wygenerowania fiszek
 * @returns Tablica 10 propozycji fiszek
 */
export async function generateFlashcards(sourceText: string): Promise<FlashcardProposal[]> {
  // Symulacja opóźnienia sieciowego (100-500ms)
  const delay = Math.floor(Math.random() * 400) + 100;
  await new Promise((resolve) => setTimeout(resolve, delay));

  // Mock zwraca zawsze 10 propozycji fiszek
  const proposals: FlashcardProposal[] = [];

  for (let i = 1; i <= 10; i++) {
    proposals.push({
      front: `Pytanie ${i} - Mock AI`,
      back: `Odpowiedź ${i} - Wygenerowana na podstawie tekstu o długości ${sourceText.length} znaków`,
    });
  }

  return proposals;
}

/**
 * Błąd AI Service
 */
export class AIServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number
  ) {
    super(message);
    this.name = "AIServiceError";
  }
}
