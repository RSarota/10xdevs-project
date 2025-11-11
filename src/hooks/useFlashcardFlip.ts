import { useState, useCallback } from "react";

export interface UseFlashcardFlipReturn {
  isFlipped: boolean;
  flip: () => void;
  reset: () => void;
}

/**
 * Hook do zarządzania stanem flipowania fiszki
 */
export function useFlashcardFlip(initialState = false): UseFlashcardFlipReturn {
  const [isFlipped, setIsFlipped] = useState(initialState);

  const flip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const reset = useCallback(() => {
    setIsFlipped(false);
  }, []);

  return {
    isFlipped,
    flip,
    reset,
  };
}
