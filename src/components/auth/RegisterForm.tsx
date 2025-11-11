import { useState } from "react";
import { Mail, Lock, User, AlertCircle } from "lucide-react";
import { Button, Stack, Input, Divider, Body } from "../apple-hig";
import { registerSchema, type RegisterInput } from "@/lib/schemas/auth.schema";
import { register, isEmailTakenError } from "@/lib/services/authService";
import { RegisterSuccessState } from "./RegisterSuccessState";
import { useFormValidation } from "@/hooks/useFormValidation";
import { useFormReady } from "@/hooks/useFormReady";

interface RegisterFormProps {
  onSuccess?: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [formData, setFormData] = useState<RegisterInput>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { isReady } = useFormReady();
  const { errors, setErrors, validateForm, clearFieldError } = useFormValidation({
    schema: registerSchema,
  });

  const handleFieldChange = <K extends keyof RegisterInput>(field: K, value: RegisterInput[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      clearFieldError(field);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm(formData)) {
      return;
    }

    setIsLoading(true);

    const result = await register({
      email: formData.email,
      password: formData.password,
      name: formData.name,
    });

    if (!result.success) {
      const errorMessage = result.error || "Wystąpił błąd podczas rejestracji";

      if (isEmailTakenError(errorMessage)) {
        setErrors({ email: "Ten adres e-mail jest już zarejestrowany" });
      } else {
        setErrors({ general: errorMessage });
      }
      setIsLoading(false);
      return;
    }

    // Success - show message
    setShowSuccess(true);

    // Optional callback or redirect after delay
    setTimeout(() => {
      if (onSuccess) {
        onSuccess();
      }
    }, 2000);
  };

  // Show success message
  if (showSuccess) {
    return (
      <RegisterSuccessState
        email={formData.email}
        onGoToLogin={() => {
          window.location.href = "/auth/login";
        }}
      />
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full"
      data-testid="register-form"
      data-ready={isReady ? "true" : "false"}
      aria-busy={!isReady}
      noValidate
    >
      <Stack direction="vertical" spacing="lg">
        {/* General Error */}
        {errors.general && (
          <div
            data-testid="register-general-error"
            className="flex items-start gap-3 p-4 bg-[hsl(var(--apple-red))]/10 border border-[hsl(var(--apple-red))]/20 rounded-[var(--apple-radius-medium)]"
          >
            <AlertCircle className="w-5 h-5 text-[hsl(var(--apple-red))] flex-shrink-0 mt-0.5" />
            <Body className="text-[hsl(var(--apple-red))] text-sm">{errors.general}</Body>
          </div>
        )}

        {/* Name Input */}
        <Input
          type="text"
          label="Imię"
          placeholder="Jan Kowalski"
          value={formData.name}
          onChange={(e) => handleFieldChange("name", e.target.value)}
          error={errors.name}
          icon={<User className="w-5 h-5" />}
          disabled={isLoading}
          autoComplete="name"
          required
          data-testid="register-name-input"
        />

        {/* Email Input */}
        <Input
          type="email"
          label="Adres e-mail"
          placeholder="twoj@email.com"
          value={formData.email}
          onChange={(e) => handleFieldChange("email", e.target.value)}
          error={errors.email}
          icon={<Mail className="w-5 h-5" />}
          disabled={isLoading}
          autoComplete="email"
          required
          data-testid="register-email-input"
        />

        {/* Password Input */}
        <Input
          type="password"
          label="Hasło"
          placeholder="Minimum 8 znaków"
          value={formData.password}
          onChange={(e) => handleFieldChange("password", e.target.value)}
          error={errors.password}
          helperText="Hasło musi zawierać min. 8 znaków, wielką i małą literę oraz cyfrę"
          icon={<Lock className="w-5 h-5" />}
          disabled={isLoading}
          autoComplete="new-password"
          required
          data-testid="register-password-input"
        />

        {/* Confirm Password Input */}
        <Input
          type="password"
          label="Potwierdź hasło"
          placeholder="Wprowadź hasło ponownie"
          value={formData.confirmPassword}
          onChange={(e) => handleFieldChange("confirmPassword", e.target.value)}
          error={errors.confirmPassword}
          icon={<Lock className="w-5 h-5" />}
          disabled={isLoading}
          autoComplete="new-password"
          required
          data-testid="register-confirm-password-input"
        />

        {/* Submit Button */}
        <Button
          type="submit"
          variant="filled"
          color="blue"
          size="large"
          fullWidth
          isLoading={isLoading}
          data-testid="register-submit-button"
        >
          Zarejestruj się
        </Button>

        {/* Terms Notice */}
        <Body className="text-[hsl(var(--apple-label-tertiary))] text-xs text-center">
          Rejestrując się, akceptujesz naszą Politykę Prywatności i Regulamin
        </Body>

        <Divider />

        {/* Login Link */}
        <div className="text-center">
          <Body className="text-[hsl(var(--apple-label-secondary))] text-sm">
            Masz już konto?{" "}
            <a
              href="/auth/login"
              data-testid="register-login-link"
              className="text-[hsl(var(--apple-blue))] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--apple-blue))] rounded-sm"
            >
              Zaloguj się
            </a>
          </Body>
        </div>
      </Stack>
    </form>
  );
}
