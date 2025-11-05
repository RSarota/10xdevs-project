/**
 * Zwraca poprawną formę polskiego rzeczownika w zależności od liczby
 *
 * @param count - Liczba elementów
 * @param singular - Forma pojedyncza (np. "fiszka")
 * @param plural - Forma mnoga 2-4 (np. "fiszki")
 * @param pluralMany - Forma mnoga 5+ (np. "fiszek")
 * @returns Poprawna forma rzeczownika
 *
 * @example
 * pluralize(1, "fiszka", "fiszki", "fiszek") // "fiszka"
 * pluralize(2, "fiszka", "fiszki", "fiszek") // "fiszki"
 * pluralize(5, "fiszka", "fiszki", "fiszek") // "fiszek"
 * pluralize(21, "fiszka", "fiszki", "fiszek") // "fiszka"
 */
export function pluralize(count: number, singular: string, plural: string, pluralMany: string): string {
  if (count === 1) {
    return singular;
  }

  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  // 12-14 zawsze pluralMany
  if (lastTwoDigits >= 12 && lastTwoDigits <= 14) {
    return pluralMany;
  }

  // 2-4 (ale nie 12-14) -> plural
  if (lastDigit >= 2 && lastDigit <= 4) {
    return plural;
  }

  // Wszystko inne -> pluralMany
  return pluralMany;
}

/**
 * Zwraca pełny ciąg z liczbą i poprawną formą rzeczownika
 *
 * @example
 * pluralizeWithCount(1, "fiszka", "fiszki", "fiszek") // "1 fiszka"
 * pluralizeWithCount(2, "fiszka", "fiszki", "fiszek") // "2 fiszki"
 * pluralizeWithCount(5, "fiszka", "fiszki", "fiszek") // "5 fiszek"
 */
export function pluralizeWithCount(count: number, singular: string, plural: string, pluralMany: string): string {
  return `${count} ${pluralize(count, singular, plural, pluralMany)}`;
}
