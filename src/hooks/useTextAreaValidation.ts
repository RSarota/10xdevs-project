import { useState, useCallback } from "react";

export interface UseTextAreaValidationOptions {
  minLength: number;
  maxLength: number;
  initialValue?: string;
}

export interface UseTextAreaValidationReturn {
  value: string;
  length: number;
  isValid: boolean;
  badgeColor: "gray" | "red" | "green";
  errorMessage?: string;
  setValue: (value: string) => void;
}

/**
 * Hook do walidacji pola tekstowego (textarea) z limitami znaków
 */
export function useTextAreaValidation({
  minLength,
  maxLength,
  initialValue = "",
}: UseTextAreaValidationOptions): UseTextAreaValidationReturn {
  const [value, setValue] = useState(initialValue);

  const length = value.length;
  const isValid = length >= minLength && length <= maxLength;

  const badgeColor: "gray" | "red" | "green" = (() => {
    if (length < minLength) return "gray";
    if (length > maxLength) return "red";
    return "green";
  })();

  const errorMessage = length > 0 && length < minLength ? `Minimum ${minLength.toLocaleString()} znaków` : undefined;

  const handleSetValue = useCallback((newValue: string) => {
    setValue(newValue);
  }, []);

  return {
    value,
    length,
    isValid,
    badgeColor,
    errorMessage,
    setValue: handleSetValue,
  };
}
