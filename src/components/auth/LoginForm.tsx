import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { Button, Stack, Input, Divider, Body } from "../apple-hig";
import { loginSchema, type LoginInput } from "@/lib/schemas/auth.schema";
import { login, isEmailNotConfirmedError } from "@/lib/services/authService";
import { AuthErrorDisplay } from "./AuthErrorDisplay";
import { useFormValidation } from "@/hooks/useFormValidation";
import { useFormReady } from "@/hooks/useFormReady";

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [formData, setFormData] = useState<LoginInput>({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { isReady } = useFormReady();
  const { errors, setErrors, validateForm, clearFieldError } = useFormValidation({
    schema: loginSchema,
  });

  const handleFieldChange = <K extends keyof LoginInput>(field: K, value: LoginInput[K]) => {
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

    const result = await login(formData);

    if (!result.success) {
      if (isEmailNotConfirmedError(result.code)) {
        setErrors({
          general: result.error || "Adres e-mail nie został potwierdzony. Sprawdź swoją skrzynkę e-mail.",
        });
      } else {
        setErrors({ general: result.error || "Nieprawidłowy e-mail lub hasło" });
      }
      setIsLoading(false);
      return;
    }

    // Success - redirect or call callback
    if (onSuccess) {
      onSuccess();
    } else {
      window.location.href = "/dashboard";
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full"
      data-testid="login-form"
      data-ready={isReady ? "true" : "false"}
      aria-busy={!isReady}
      noValidate
    >
      <Stack direction="vertical" spacing="lg">
        {/* General Error */}
        {errors.general && <AuthErrorDisplay message={errors.general} testId="login-general-error" />}

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
          data-testid="login-email-input"
        />

        {/* Password Input */}
        <Input
          type="password"
          label="Hasło"
          placeholder="Wprowadź hasło"
          value={formData.password}
          onChange={(e) => handleFieldChange("password", e.target.value)}
          error={errors.password}
          icon={<Lock className="w-5 h-5" />}
          disabled={isLoading}
          autoComplete="current-password"
          required
          data-testid="login-password-input"
        />

        {/* Forgot Password Link */}
        <div className="flex justify-end">
          <a
            href="/auth/forgot-password"
            data-testid="login-forgot-password-link"
            className="text-[var(--apple-font-footnote)] text-[hsl(var(--apple-blue))] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--apple-blue))] rounded-sm"
          >
            Zapomniałeś hasła?
          </a>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="filled"
          color="blue"
          size="large"
          fullWidth
          isLoading={isLoading}
          data-testid="login-submit-button"
        >
          Zaloguj się
        </Button>

        <Divider />

        {/* Register Link */}
        <div className="text-center">
          <Body className="text-[hsl(var(--apple-label-secondary))] text-sm">
            Nie masz jeszcze konta?{" "}
            <a
              href="/auth/register"
              data-testid="login-register-link"
              className="text-[hsl(var(--apple-blue))] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--apple-blue))] rounded-sm"
            >
              Zarejestruj się
            </a>
          </Body>
        </div>
      </Stack>
    </form>
  );
}
