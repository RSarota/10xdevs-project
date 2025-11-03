/**
 * Oblicza SHA-256 hash dla podanego tekstu.
 *
 * @param text - Tekst do zahashowania
 * @returns SHA-256 hash jako string w formacie hex
 */
export async function calculateHash(text: string): Promise<string> {
  // Kodowanie tekstu do formatu binarnego
  const encoder = new TextEncoder();
  const data = encoder.encode(text);

  // Obliczenie SHA-256 hash
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  // Konwersja do formatu hex
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");

  return hashHex;
}
