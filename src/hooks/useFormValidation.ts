import { useState, useCallback } from "react";
import type { ZodSchema, ZodError } from "zod";

export interface UseFormValidationOptions<T> {
  schema: ZodSchema<T>;
  initialErrors?: Partial<Record<keyof T, string>>;
}

export interface UseFormValidationReturn<T> {
  errors: Partial<Record<keyof T, string>> & { general?: string };
  setErrors: React.Dispatch<React.SetStateAction<Partial<Record<keyof T, string>> & { general?: string }>>;
  validateForm: (data: T) => boolean;
  clearFieldError: (field: keyof T) => void;
  clearAllErrors: () => void;
}

export function useFormValidation<T extends Record<string, unknown>>({
  schema,
  initialErrors = {},
}: UseFormValidationOptions<T>): UseFormValidationReturn<T> {
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>> & { general?: string }>(initialErrors);

  const validateForm = useCallback(
    (data: T): boolean => {
      try {
        schema.parse(data);
        setErrors({});
        return true;
      } catch (error) {
        if (error && typeof error === "object" && "errors" in error) {
          const zodError = error as ZodError<T>;
          const newErrors: Partial<Record<keyof T, string>> = {};

          zodError.errors.forEach((err) => {
            const field = err.path[0] as keyof T;
            if (field) {
              newErrors[field] = err.message;
            }
          });

          setErrors(newErrors);
        }
        return false;
      }
    },
    [schema]
  );

  const clearFieldError = useCallback((field: keyof T) => {
    setErrors((prev) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [field]: _, ...rest } = prev;
      return rest as Partial<Record<keyof T, string>> & { general?: string };
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    errors,
    setErrors,
    validateForm,
    clearFieldError,
    clearAllErrors,
  };
}
