import { useState } from "react";
import { Mail, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
import { Button, Stack, Input, Body } from "../apple-hig";

interface ForgotPasswordFormProps {
  onSuccess?: () => void;
}

export function ForgotPasswordForm({ onSuccess }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ email?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: { email?: string } = {};

    if (!email) {
      newErrors.email = "Adres e-mail jest wymagany";
    } else if (!validateEmail(email)) {
      newErrors.email = "Podaj poprawny adres e-mail";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ general: data.error || "Wystąpił błąd podczas wysyłania e-maila" });
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
    } catch {
      setErrors({ general: "Wystąpił błąd połączenia. Spróbuj ponownie." });
    } finally {
      setIsLoading(false);
    }
  };

  // Show success message
  if (showSuccess) {
    return (
      <div className="w-full">
        <Stack direction="vertical" spacing="lg" align="center" className="text-center py-8">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[hsl(var(--apple-green))]/10">
            <CheckCircle className="w-10 h-10 text-[hsl(var(--apple-green))]" />
          </div>
          <Stack direction="vertical" spacing="sm">
            <Body className="text-[hsl(var(--apple-label))] text-lg font-medium">E-mail został wysłany!</Body>
            <Body className="text-[hsl(var(--apple-label-secondary))] text-sm max-w-md">
              Wysłaliśmy link resetujący hasło na adres <strong>{email}</strong>. Sprawdź swoją skrzynkę e-mail i
              kliknij w link, aby ustawić nowe hasło.
            </Body>
            <Body className="text-[hsl(var(--apple-label-tertiary))] text-xs mt-2">
              Nie otrzymałeś e-maila? Sprawdź folder spam lub spróbuj ponownie za kilka minut.
            </Body>
          </Stack>
          <Stack direction="vertical" spacing="sm" className="w-full">
            <Button variant="default" color="blue" size="medium" onClick={() => (window.location.href = "/auth/login")}>
              Wróć do logowania
            </Button>
            <Button variant="plain" color="gray" size="medium" onClick={() => setShowSuccess(false)}>
              Wyślij ponownie
            </Button>
          </Stack>
        </Stack>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <Stack direction="vertical" spacing="lg">
        {/* Description */}
        <Body className="text-[hsl(var(--apple-label-secondary))] text-sm text-center">
          Podaj adres e-mail powiązany z Twoim kontem. Wyślemy Ci link do resetowania hasła.
        </Body>

        {/* General Error */}
        {errors.general && (
          <div className="flex items-start gap-3 p-4 bg-[hsl(var(--apple-red))]/10 border border-[hsl(var(--apple-red))]/20 rounded-[var(--apple-radius-medium)]">
            <AlertCircle className="w-5 h-5 text-[hsl(var(--apple-red))] flex-shrink-0 mt-0.5" />
            <Body className="text-[hsl(var(--apple-red))] text-sm">{errors.general}</Body>
          </div>
        )}

        {/* Email Input */}
        <Input
          type="email"
          label="Adres e-mail"
          placeholder="twoj@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          icon={<Mail className="w-5 h-5" />}
          disabled={isLoading}
          autoComplete="email"
          required
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
