import { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import { Button, Stack, Input, Body } from "../apple-hig";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/schemas/auth.schema";
import { forgotPassword } from "@/lib/services/authService";
import { EmailSentSuccessState } from "./EmailSentSuccessState";
import { AuthErrorDisplay } from "./AuthErrorDisplay";
import { useFormValidation } from "@/hooks/useFormValidation";
import { useFormReady } from "@/hooks/useFormReady";

interface ForgotPasswordFormProps {
  onSuccess?: () => void;
}

export function ForgotPasswordForm({ onSuccess }: ForgotPasswordFormProps) {
  const [formData, setFormData] = useState<ForgotPasswordInput>({
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { isReady } = useFormReady();
  const { errors, setErrors, validateForm, clearFieldError } = useFormValidation({
    schema: forgotPasswordSchema,
  });

  const handleFieldChange = <K extends keyof ForgotPasswordInput>(field: K, value: ForgotPasswordInput[K]) => {
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

    const result = await forgotPassword(formData);

    if (!result.success) {
      setErrors({ general: result.error || "Wystąpił błąd podczas wysyłania e-maila" });
      setIsLoading(false);
      return;
    }

    // Success - show message
    setShowSuccess(true);

    // Optional callback
    if (onSuccess) {
      setTimeout(() => {
        onSuccess();
      }, 2000);
    }
  };

  const handleResend = () => {
    setShowSuccess(false);
    setFormData({ email: formData.email }); // Keep email
  };

  // Show success message
  if (showSuccess) {
    return (
      <EmailSentSuccessState
        email={formData.email}
        onGoToLogin={() => (window.location.href = "/auth/login")}
        onResend={handleResend}
      />
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full"
      data-testid="forgot-password-form"
      data-ready={isReady ? "true" : "false"}
      aria-busy={!isReady}
    >
      <Stack direction="vertical" spacing="lg">
        {/* Description */}
        <Body className="text-[hsl(var(--apple-label-secondary))] text-sm text-center">
          Podaj adres e-mail powiązany z Twoim kontem. Wyślemy Ci link do resetowania hasła.
        </Body>

        {/* General Error */}
        {errors.general && <AuthErrorDisplay message={errors.general} testId="forgot-password-general-error" />}

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
          data-testid="forgot-password-email-input"
        />

        {/* Submit Button */}
        <Button type="submit" variant="filled" color="blue" size="large" fullWidth isLoading={isLoading}>
          Wyślij link resetujący
        </Button>

        {/* Back to Login Link */}
        <Button
          type="button"
          variant="plain"
          color="gray"
          size="medium"
          onClick={() => (window.location.href = "/auth/login")}
        >
          <ArrowLeft className="w-4 h-4" />
          Wróć do logowania
        </Button>
      </Stack>
    </form>
  );
}
