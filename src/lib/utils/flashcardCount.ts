/**
 * Utility functions for formatting flashcard counts
 */

/**
 * Formatuje liczbę fiszek z poprawną odmianą
 */
export function formatFlashcardCount(count: number): string {
  if (count === 1) return "1 fiszka gotowa do zapisu";
  if (count < 5) return `${count} fiszki gotowe do zapisu`;
  return `${count} fiszek gotowych do zapisu`;
}
