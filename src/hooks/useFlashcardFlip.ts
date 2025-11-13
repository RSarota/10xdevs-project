import { useState, useCallback } from "react";

export interface UseFlashcardFlipReturn {
  isFlipped: boolean;
  isFlipping: boolean;
  flip: () => void;
  toggle: () => void;
  reset: () => void;
  getCurrentSide: () => "front" | "back";
}

/**
 * Hook do zarządzania stanem flipowania fiszki z animacją 3D
 * - flip(): jednokrotne odwrócenie z przodu na tył (dla study)
 * - toggle(): wielokrotne przełączanie (dla my-flashcards)
 */
export function useFlashcardFlip(initialState = false, duration = 300): UseFlashcardFlipReturn {
  const [isFlipped, setIsFlipped] = useState(initialState);
  const [isFlipping, setIsFlipping] = useState(false);

  const flip = useCallback(() => {
    // Blokuj jeśli już jest odwrócona lub w trakcie odwracania (tylko z przodu na tył)
    if (isFlipping || isFlipped) return;

    setIsFlipping(true);
    setTimeout(() => {
      setIsFlipped(true); // Tylko ustaw na true (z przodu na tył), nie toggle
      setIsFlipping(false);
    }, duration);
  }, [isFlipping, isFlipped, duration]);

  const toggle = useCallback(() => {
    // Blokuj tylko jeśli w trakcie odwracania (pozwala na wielokrotne przełączanie)
    if (isFlipping) return;

    setIsFlipping(true);
    setTimeout(() => {
      setIsFlipped((prev) => !prev); // Toggle między true/false
      setIsFlipping(false);
    }, duration);
  }, [isFlipping, duration]);

  const reset = useCallback(() => {
    if (isFlipping || !isFlipped) return;

    setIsFlipping(true);
    setTimeout(() => {
      setIsFlipped(false);
      setIsFlipping(false);
    }, duration);
  }, [isFlipped, isFlipping, duration]);

  const getCurrentSide = useCallback(() => {
    return isFlipped ? "back" : "front";
  }, [isFlipped]);

  return {
    isFlipped,
    isFlipping,
    flip,
    toggle,
    reset,
    getCurrentSide,
  };
}
