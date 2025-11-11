import { useState, useEffect } from "react";
import { FLASHCARD_LIMITS } from "@/lib/constants/flashcardLimits";

export interface FlashcardFormData {
  front: string;
  back: string;
}

export interface UseFlashcardFormOptions {
  initialData?: FlashcardFormData;
  onDataChange?: (data: FlashcardFormData) => void;
}

export function useFlashcardForm({ initialData, onDataChange }: UseFlashcardFormOptions = {}) {
  const [front, setFront] = useState(initialData?.front || "");
  const [back, setBack] = useState(initialData?.back || "");
  const [touchedFront, setTouchedFront] = useState(false);
  const [touchedBack, setTouchedBack] = useState(false);

  // Reset form when initial data changes
  useEffect(() => {
    if (initialData) {
      setFront(initialData.front);
      setBack(initialData.back);
      setTouchedFront(false);
      setTouchedBack(false);
    }
  }, [initialData]);

  // Notify parent of data changes
  useEffect(() => {
    if (onDataChange) {
      onDataChange({ front, back });
    }
  }, [front, back, onDataChange]);

  const frontLength = front.trim().length;
  const backLength = back.trim().length;

  const isFrontValid = frontLength > 0 && frontLength <= FLASHCARD_LIMITS.FRONT_MAX;
  const isBackValid = backLength > 0 && backLength <= FLASHCARD_LIMITS.BACK_MAX;
  const isFormValid = isFrontValid && isBackValid;

  const showFrontError = touchedFront && !isFrontValid;
  const showBackError = touchedBack && !isBackValid;

  const getFrontBadgeColor = (): "gray" | "red" | "green" => {
    if (frontLength === 0) return "gray";
    if (frontLength > FLASHCARD_LIMITS.FRONT_MAX) return "red";
    return "green";
  };

  const getBackBadgeColor = (): "gray" | "red" | "green" => {
    if (backLength === 0) return "gray";
    if (backLength > FLASHCARD_LIMITS.BACK_MAX) return "red";
    return "green";
  };

  const getFrontHelperText = (): string | undefined => {
    if (frontLength === 0) return undefined;
    if (frontLength > FLASHCARD_LIMITS.FRONT_MAX) {
      return `Przekroczono o ${frontLength - FLASHCARD_LIMITS.FRONT_MAX} znaków`;
    }
    return `${FLASHCARD_LIMITS.FRONT_MAX - frontLength} znaków pozostało`;
  };

  const getBackHelperText = (): string | undefined => {
    if (backLength === 0) return undefined;
    if (backLength > FLASHCARD_LIMITS.BACK_MAX) {
      return `Przekroczono o ${backLength - FLASHCARD_LIMITS.BACK_MAX} znaków`;
    }
    return `${FLASHCARD_LIMITS.BACK_MAX - backLength} znaków pozostało`;
  };

  const handleFrontChange = (value: string) => {
    setFront(value);
    if (!touchedFront) setTouchedFront(true);
  };

  const handleBackChange = (value: string) => {
    setBack(value);
    if (!touchedBack) setTouchedBack(true);
  };

  const markAllTouched = () => {
    setTouchedFront(true);
    setTouchedBack(true);
  };

  const resetTouched = () => {
    setTouchedFront(false);
    setTouchedBack(false);
  };

  const getData = (): FlashcardFormData => ({
    front: front.trim(),
    back: back.trim(),
  });

  return {
    // State
    front,
    back,
    frontLength,
    backLength,
    touchedFront,
    touchedBack,

    // Validation
    isFrontValid,
    isBackValid,
    isFormValid,
    showFrontError,
    showBackError,

    // Helpers
    getFrontBadgeColor,
    getBackBadgeColor,
    getFrontHelperText,
    getBackHelperText,

    // Handlers
    handleFrontChange,
    handleBackChange,
    markAllTouched,
    resetTouched,
    getData,
  };
}
