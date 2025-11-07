import { useState } from "react";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { Button, Stack, Input, Divider, Body } from "../apple-hig";

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = "Adres e-mail jest wymagany";
    } else if (!validateEmail(email)) {
      newErrors.email = "Podaj poprawny adres e-mail";
    }

    if (!password) {
      newErrors.password = "Hasło jest wymagane";
    } else if (password.length < 6) {
      newErrors.password = "Hasło musi zawierać minimum 6 znaków";
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
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle email not confirmed error
        if (data.code === "email_not_confirmed") {
          setErrors({
            general: data.error || "Adres e-mail nie został potwierdzony. Sprawdź swoją skrzynkę e-mail.",
          });
          return;
        }

        // Handle other errors
        setErrors({ general: data.error || "Nieprawidłowy e-mail lub hasło" });
        return;
      }

      // Success - redirect or call callback
      if (onSuccess) {
        onSuccess();
      } else {
        window.location.href = "/dashboard";
      }
    } catch {
      setErrors({ general: "Wystąpił błąd połączenia. Spróbuj ponownie." });
    } finally {
      setIsLoading(false);
    }
  };

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
          placeholder="Wprowadź hasło"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          icon={<Lock className="w-5 h-5" />}
          disabled={isLoading}
          autoComplete="current-password"
          required
        />

        {/* Forgot Password Link */}
        <div className="flex justify-end">
          <a
            href="/auth/forgot-password"
            className="text-[var(--apple-font-footnote)] text-[hsl(var(--apple-blue))] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--apple-blue))] rounded-sm"
          >
            Zapomniałeś hasła?
          </a>
        </div>

        {/* Submit Button */}
        <Button type="submit" variant="filled" color="blue" size="large" fullWidth isLoading={isLoading}>
          Zaloguj się
        </Button>

        <Divider />

        {/* Register Link */}
        <div className="text-center">
          <Body className="text-[hsl(var(--apple-label-secondary))] text-sm">
            Nie masz jeszcze konta?{" "}
            <a
              href="/auth/register"
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
