import { z } from "zod";

/**
 * Schema walidacji dla aktualizacji profilu
 * Hasło jest opcjonalne - jeśli nie jest podane, nie jest zmieniane
 */
export const profileUpdateSchema = z
  .object({
    email: z.string().email(), // Read-only, always use original
    password: z
      .string()
      .min(8, "Hasło musi mieć co najmniej 8 znaków")
      .regex(/[A-Z]/, "Hasło musi zawierać co najmniej jedną wielką literę")
      .regex(/[0-9]/, "Hasło musi zawierać co najmniej jedną cyfrę")
      .optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      // If password is provided, confirmPassword must also be provided
      if (data.password && !data.confirmPassword) {
        return false;
      }
      return true;
    },
    {
      message: "Potwierdzenie hasła jest wymagane",
      path: ["confirmPassword"],
    }
  )
  .refine(
    (data) => {
      // If password is provided, it must match confirmPassword
      if (data.password && data.confirmPassword) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: "Hasła nie są zgodne",
      path: ["confirmPassword"],
    }
  );

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
