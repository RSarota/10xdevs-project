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
 * Hook for managing flashcard flip state with 3D animation
 * - flip(): single flip from front to back (for study)
 * - toggle(): multiple switching (for my-flashcards)
 */
export function useFlashcardFlip(initialState = false, duration = 300): UseFlashcardFlipReturn {
  const [isFlipped, setIsFlipped] = useState(initialState);
  const [isFlipping, setIsFlipping] = useState(false);

  const flip = useCallback(() => {
    // Block if already flipped or in the process of flipping (only from front to back)
    if (isFlipping || isFlipped) return;

    setIsFlipping(true);
    setTimeout(() => {
      setIsFlipped(true); // Only set to true (from front to back), don't toggle
      setIsFlipping(false);
    }, duration);
  }, [isFlipping, isFlipped, duration]);

  const toggle = useCallback(() => {
    // Block only if in the process of flipping (allows multiple switching)
    if (isFlipping) return;

    setIsFlipping(true);
    setTimeout(() => {
      setIsFlipped((prev) => !prev); // Toggle between true/false
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
