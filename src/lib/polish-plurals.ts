/**
 * Returns the correct form of a Polish noun depending on the number
 *
 * @param count - Number of items
 * @param singular - Singular form (e.g. "fiszka")
 * @param plural - Plural form 2-4 (e.g. "fiszki")
 * @param pluralMany - Plural form 5+ (e.g. "fiszek")
 * @returns Correct noun form
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

  // 12-14 always pluralMany
  if (lastTwoDigits >= 12 && lastTwoDigits <= 14) {
    return pluralMany;
  }

  // 2-4 (but not 12-14) -> plural
  if (lastDigit >= 2 && lastDigit <= 4) {
    return plural;
  }

  // Everything else -> pluralMany
  return pluralMany;
}

/**
 * Returns a full string with the number and correct noun form
 *
 * @example
 * pluralizeWithCount(1, "fiszka", "fiszki", "fiszek") // "1 fiszka"
 * pluralizeWithCount(2, "fiszka", "fiszki", "fiszek") // "2 fiszki"
 * pluralizeWithCount(5, "fiszka", "fiszki", "fiszek") // "5 fiszek"
 */
export function pluralizeWithCount(count: number, singular: string, plural: string, pluralMany: string): string {
  return `${count} ${pluralize(count, singular, plural, pluralMany)}`;
}
