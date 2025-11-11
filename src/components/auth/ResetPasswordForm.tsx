import { useState } from "react";
import { Button, Stack, Body } from "../apple-hig";
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/schemas/auth.schema";
import { resetPassword } from "@/lib/services/authService";
import { PasswordChangeFields } from "../profile/PasswordChangeFields";
import { PasswordResetSuccessState } from "./PasswordResetSuccessState";
import { AuthErrorDisplay } from "./AuthErrorDisplay";
import { useFormValidation } from "@/hooks/useFormValidation";
import { useFormReady } from "@/hooks/useFormReady";

interface ResetPasswordFormProps {
  onSuccess?: () => void;
}

export function ResetPasswordForm({ onSuccess }: ResetPasswordFormProps) {
  const [formData, setFormData] = useState<ResetPasswordInput>({
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { isReady } = useFormReady();
  const { errors, setErrors, validateForm, clearFieldError } = useFormValidation({
    schema: resetPasswordSchema,
  });

  const handleFieldChange = <K extends keyof ResetPasswordInput>(field: K, value: ResetPasswordInput[K]) => {
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

    const result = await resetPassword({ password: formData.password });

    if (!result.success) {
      setErrors({ general: result.error || "Wystąpił błąd podczas resetowania hasła" });
      setIsLoading(false);
      return;
    }

    // Success - show message
    setShowSuccess(true);

    // Redirect to login after delay
    setTimeout(() => {
      if (onSuccess) {
        onSuccess();
      } else {
        window.location.href = "/auth/login";
      }
    }, 3000);
  };

  // Show success message
  if (showSuccess) {
    return (
      <PasswordResetSuccessState
        onGoToLogin={() => {
          if (onSuccess) {
            onSuccess();
          } else {
            window.location.href = "/auth/login";
          }
        }}
      />
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full"
      data-testid="reset-password-form"
      data-ready={isReady ? "true" : "false"}
      aria-busy={!isReady}
    >
      <Stack direction="vertical" spacing="lg">
        {/* Description */}
        <Body className="text-[hsl(var(--apple-label-secondary))] text-sm text-center">
          Wprowadź nowe hasło dla swojego konta.
        </Body>

        {/* General Error */}
        {errors.general && <AuthErrorDisplay message={errors.general} testId="reset-password-general-error" />}

        {/* Password fields */}
        <PasswordChangeFields
          password={formData.password}
          confirmPassword={formData.confirmPassword}
          onPasswordChange={(value) => handleFieldChange("password", value)}
          onConfirmPasswordChange={(value) => handleFieldChange("confirmPassword", value)}
          passwordError={errors.password}
          confirmPasswordError={errors.confirmPassword}
          disabled={isLoading}
        />

        {/* Submit Button */}
        <Button type="submit" variant="filled" color="blue" size="large" fullWidth isLoading={isLoading}>
          Zmień hasło
        </Button>
      </Stack>
    </form>
  );
}
