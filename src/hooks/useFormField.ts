import { useCallback } from "react";

export interface UseFormFieldOptions<T> {
  value: T;
  onChange: (value: T) => void;
  error?: string;
  onErrorClear?: () => void;
}

export interface UseFormFieldReturn<T> {
  value: T;
  onChange: (value: T) => void;
  error?: string;
}

export function useFormField<T>({
  value,
  onChange,
  error,
  onErrorClear,
}: UseFormFieldOptions<T>): UseFormFieldReturn<T> {
  const handleChange = useCallback(
    (newValue: T) => {
      onChange(newValue);
      // Clear error when user starts typing
      if (error && onErrorClear) {
        onErrorClear();
      }
    },
    [onChange, error, onErrorClear]
  );

  return {
    value,
    onChange: handleChange,
    error,
  };
}
