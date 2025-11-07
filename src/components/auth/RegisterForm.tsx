import { useState } from "react";
import { Mail, Lock, User, AlertCircle, CheckCircle } from "lucide-react";
import { Button, Stack, Input, Divider, Body } from "../apple-hig";

interface RegisterFormProps {
  onSuccess?: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    name?: string;
    general?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

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
    const newErrors: {
      email?: string;
      password?: string;
      confirmPassword?: string;
      name?: string;
    } = {};

    // Name validation
    if (!name.trim()) {
      newErrors.name = "Imię jest wymagane";
    } else if (name.trim().length < 2) {
      newErrors.name = "Imię musi zawierać przynajmniej 2 znaki";
    }

    // Email validation
    if (!email) {
      newErrors.email = "Adres e-mail jest wymagany";
    } else if (!validateEmail(email)) {
      newErrors.email = "Podaj poprawny adres e-mail";
    }

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

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name: name.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error?.includes("już istnieje") || data.error?.includes("already")) {
          setErrors({ email: "Ten adres e-mail jest już zarejestrowany" });
        } else {
          setErrors({ general: data.error || "Wystąpił błąd podczas rejestracji" });
        }
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
            <Body className="text-[hsl(var(--apple-label))] text-lg font-medium">Rejestracja zakończona!</Body>
            <Body className="text-[hsl(var(--apple-label-secondary))] text-sm max-w-md">
              Wysłaliśmy link aktywacyjny na adres <strong>{email}</strong>. Sprawdź swoją skrzynkę e-mail i kliknij w
              link, aby aktywować konto.
            </Body>
          </Stack>
          <Button variant="default" color="blue" size="medium" onClick={() => (window.location.href = "/auth/login")}>
            Przejdź do logowania
          </Button>
        </Stack>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <Stack direction="vertical" spacing="lg">
        {/* General Error */}
        {errors.general && (
          <div className="flex items-start gap-3 p-4 bg-[hsl(var(--apple-red))]/10 border border-[hsl(var(--apple-red))]/20 rounded-[var(--apple-radius-medium)]">
            <AlertCircle className="w-5 h-5 text-[hsl(var(--apple-red))] flex-shrink-0 mt-0.5" />
            <Body className="text-[hsl(var(--apple-red))] text-sm">{errors.general}</Body>
          </div>
        )}

        {/* Name Input */}
        <Input
          type="text"
          label="Imię"
          placeholder="Jan Kowalski"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          icon={<User className="w-5 h-5" />}
          disabled={isLoading}
          autoComplete="name"
          required
        />

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

        {/* Password Input */}
        <Input
          type="password"
          label="Hasło"
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
          label="Potwierdź hasło"
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
