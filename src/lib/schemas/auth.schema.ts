import { z } from "zod";

/**
 * Schema walidacji dla rejestracji użytkownika
 */
export const registerSchema = z
  .object({
    name: z
      .string({ required_error: "Imię jest wymagane" })
      .min(1, "Imię jest wymagane")
      .min(2, "Imię musi zawierać przynajmniej 2 znaki")
      .trim(),
    email: z
      .string({ required_error: "Adres e-mail jest wymagany" })
      .min(1, "Adres e-mail jest wymagany")
      .email("Podaj poprawny adres e-mail"),
    password: z
      .string({ required_error: "Hasło jest wymagane" })
      .min(1, "Hasło jest wymagane")
      .min(8, "Hasło musi zawierać minimum 8 znaków")
      .regex(/[A-Z]/, "Hasło musi zawierać przynajmniej jedną wielką literę")
      .regex(/[a-z]/, "Hasło musi zawierać przynajmniej jedną małą literę")
      .regex(/[0-9]/, "Hasło musi zawierać przynajmniej jedną cyfrę"),
    confirmPassword: z.string({ required_error: "Potwierdzenie hasła jest wymagane" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Hasła nie są identyczne",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

/**
 * Schema walidacji dla logowania
 */
export const loginSchema = z.object({
  email: z
    .string({ required_error: "Adres e-mail jest wymagany" })
    .min(1, "Adres e-mail jest wymagany")
    .email("Podaj poprawny adres e-mail"),
  password: z
    .string({ required_error: "Hasło jest wymagane" })
    .min(1, "Hasło jest wymagane")
    .min(6, "Hasło musi zawierać minimum 6 znaków"),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Schema walidacji dla resetowania hasła
 */
export const resetPasswordSchema = z
  .object({
    password: z
      .string({ required_error: "Hasło jest wymagane" })
      .min(1, "Hasło jest wymagane")
      .min(8, "Hasło musi zawierać minimum 8 znaków")
      .regex(/[A-Z]/, "Hasło musi zawierać przynajmniej jedną wielką literę")
      .regex(/[a-z]/, "Hasło musi zawierać przynajmniej jedną małą literę")
      .regex(/[0-9]/, "Hasło musi zawierać przynajmniej jedną cyfrę"),
    confirmPassword: z.string({ required_error: "Potwierdzenie hasła jest wymagane" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Hasła nie są identyczne",
    path: ["confirmPassword"],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

/**
 * Schema walidacji dla przypomnienia hasła (tylko email)
 */
export const forgotPasswordSchema = z.object({
  email: z
    .string({ required_error: "Adres e-mail jest wymagany" })
    .min(1, "Adres e-mail jest wymagany")
    .email("Podaj poprawny adres e-mail"),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
