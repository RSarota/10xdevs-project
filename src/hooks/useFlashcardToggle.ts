import { useState, useCallback } from "react";

export interface UseFlashcardToggleReturn {
  isFlipped: boolean;
  isFlipping: boolean;
  toggle: () => void;
  reset: () => void;
  getCurrentSide: () => "front" | "back";
}

/**
 * Hook for managing flashcard flip state with 3D animation
 * Allows multiple switching between front/back (toggle)
 * Used in my-flashcards where user can flip flashcards multiple times
 */
export function useFlashcardToggle(initialState = false): UseFlashcardToggleReturn {
  const [isFlipped, setIsFlipped] = useState(initialState);
  const [isFlipping, setIsFlipping] = useState(false);

  const toggle = useCallback(() => {
    // Block only if in the process of flipping
    if (isFlipping) return;

    setIsFlipping(true);
    setTimeout(() => {
      setIsFlipped((prev) => !prev); // Toggle between true/false
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
