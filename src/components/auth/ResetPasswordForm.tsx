import { useState, useEffect } from "react";
import { Lock, AlertCircle, CheckCircle } from "lucide-react";
import { Button, Stack, Input, Body } from "../apple-hig";

interface ResetPasswordFormProps {
  onSuccess?: () => void;
}

export function ResetPasswordForm({ onSuccess }: ResetPasswordFormProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Extract token from URL
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");
    setToken(tokenFromUrl);

    if (!tokenFromUrl) {
      setErrors({ general: "Nieprawidłowy lub brakujący token resetowania hasła" });
    }
  }, []);

  const validatePassword = (password: string): { valid: boolean; message?: string } => {
    if (password.length < 8) {
      return { valid: false, message: "Hasło musi zawierać minimum 8 znaków" };
    }
    if (!/[A-Z]/.test(password)) {
      return { valid: false, message: "Hasło musi zawierać przynajmniej jedną wielką literę" };
    }
    if (!/[a-z]/.test(password)) {
      return { valid: false, message: "Hasło musi zawierać przynajmniej jedną małą literę" };
    }
    if (!/[0-9]/.test(password)) {
      return { valid: false, message: "Hasło musi zawierać przynajmniej jedną cyfrę" };
    }
    return { valid: true };
  };

  const validateForm = (): boolean => {
    const newErrors: { password?: string; confirmPassword?: string } = {};

    // Password validation
    if (!password) {
      newErrors.password = "Hasło jest wymagane";
    } else {
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.valid) {
        newErrors.password = passwordValidation.message;
      }
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = "Potwierdzenie hasła jest wymagane";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Hasła nie są identyczne";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!token) {
      setErrors({ general: "Nieprawidłowy lub brakujący token resetowania hasła" });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error?.includes("wygasł") || data.error?.includes("expired")) {
          setErrors({ general: "Link resetowania hasła wygasł. Spróbuj ponownie." });
        } else {
          setErrors({ general: data.error || "Wystąpił błąd podczas resetowania hasła" });
        }
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
            <Body className="text-[hsl(var(--apple-label))] text-lg font-medium">Hasło zostało zmienione!</Body>
            <Body className="text-[hsl(var(--apple-label-secondary))] text-sm max-w-md">
              Twoje hasło zostało pomyślnie zmienione. Za chwilę zostaniesz przekierowany do strony logowania.
            </Body>
          </Stack>
          <Button variant="default" color="blue" size="medium" onClick={() => (window.location.href = "/auth/login")}>
            Przejdź do logowania
          </Button>
        </Stack>
      </div>
    );
  }

  // Invalid token state
  if (!token && errors.general) {
    return (
      <div className="w-full">
        <Stack direction="vertical" spacing="lg" align="center" className="text-center py-8">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[hsl(var(--apple-red))]/10">
            <AlertCircle className="w-10 h-10 text-[hsl(var(--apple-red))]" />
          </div>
          <Stack direction="vertical" spacing="sm">
            <Body className="text-[hsl(var(--apple-label))] text-lg font-medium">Nieprawidłowy link</Body>
            <Body className="text-[hsl(var(--apple-label-secondary))] text-sm max-w-md">{errors.general}</Body>
          </Stack>
          <Button
            variant="default"
            color="blue"
            size="medium"
            onClick={() => (window.location.href = "/auth/forgot-password")}
          >
            Wyślij nowy link
          </Button>
        </Stack>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <Stack direction="vertical" spacing="lg">
        {/* Description */}
        <Body className="text-[hsl(var(--apple-label-secondary))] text-sm text-center">
          Wprowadź nowe hasło dla swojego konta.
        </Body>

        {/* General Error */}
        {errors.general && (
          <div className="flex items-start gap-3 p-4 bg-[hsl(var(--apple-red))]/10 border border-[hsl(var(--apple-red))]/20 rounded-[var(--apple-radius-medium)]">
            <AlertCircle className="w-5 h-5 text-[hsl(var(--apple-red))] flex-shrink-0 mt-0.5" />
            <Body className="text-[hsl(var(--apple-red))] text-sm">{errors.general}</Body>
          </div>
        )}

        {/* Password Input */}
        <Input
          type="password"
          label="Nowe hasło"
          placeholder="Minimum 8 znaków"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          helperText="Hasło musi zawierać min. 8 znaków, wielką i małą literę oraz cyfrę"
          icon={<Lock className="w-5 h-5" />}
          disabled={isLoading}
          autoComplete="new-password"
          required
        />

        {/* Confirm Password Input */}
        <Input
          type="password"
          label="Potwierdź nowe hasło"
          placeholder="Wprowadź hasło ponownie"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
          icon={<Lock className="w-5 h-5" />}
          disabled={isLoading}
          autoComplete="new-password"
          required
        />

        {/* Submit Button */}
        <Button type="submit" variant="filled" color="blue" size="large" fullWidth isLoading={isLoading}>
          Zmień hasło
        </Button>
      </Stack>
    </form>
  );
}
