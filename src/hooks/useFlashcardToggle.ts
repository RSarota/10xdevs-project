import { useState, useCallback } from "react";

export interface UseFlashcardToggleReturn {
  isFlipped: boolean;
  isFlipping: boolean;
  toggle: () => void;
  reset: () => void;
  getCurrentSide: () => "front" | "back";
}

/**
 * Hook do zarządzania stanem flipowania fiszki z animacją 3D
 * Pozwala na wielokrotne przełączanie między przód/tył (toggle)
 * Używany w my-flashcards gdzie użytkownik może wielokrotnie odwracać fiszki
 */
export function useFlashcardToggle(initialState = false): UseFlashcardToggleReturn {
  const [isFlipped, setIsFlipped] = useState(initialState);
  const [isFlipping, setIsFlipping] = useState(false);

  const toggle = useCallback(() => {
    // Blokuj tylko jeśli w trakcie odwracania
    if (isFlipping) return;

    setIsFlipping(true);
    setTimeout(() => {
      setIsFlipped((prev) => !prev); // Toggle między true/false
      setIsFlipping(false);
    }, 300);
  }, [isFlipping]);

  const reset = useCallback(() => {
    if (isFlipping) return;

    setIsFlipping(true);
    setTimeout(() => {
      setIsFlipped(false);
      setIsFlipping(false);
    }, 300);
  }, [isFlipping]);

  const getCurrentSide = useCallback(() => {
    return isFlipped ? "back" : "front";
  }, [isFlipped]);

  return {
    isFlipped,
    isFlipping,
    toggle,
    reset,
    getCurrentSide,
  };
}
