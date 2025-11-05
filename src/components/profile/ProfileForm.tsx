import { useState, useEffect } from "react";
import { Card, CardContent, Stack, Input, Button, Title2, FormField, Footnote } from "@/components/apple-hig";
import type { ProfileFormData, UserProfileDTO } from "@/hooks/useProfile";

export interface ProfileFormProps {
  profile: UserProfileDTO;
  onSubmit: (data: ProfileFormData) => void;
  loading?: boolean;
}

export function ProfileForm({ profile, onSubmit, loading = false }: ProfileFormProps) {
  const [email, setEmail] = useState(profile.email);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof ProfileFormData, string>>>({});

  useEffect(() => {
    setEmail(profile.email);
  }, [profile]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ProfileFormData, string>> = {};

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = "Wprowadź poprawny adres e-mail";
    }

    // Validate password if provided
    if (password.trim().length > 0) {
      if (password.length < 8) {
        newErrors.password = "Hasło musi mieć co najmniej 8 znaków";
      } else if (!/[A-Z]/.test(password)) {
        newErrors.password = "Hasło musi zawierać co najmniej jedną wielką literę";
      } else if (!/[0-9]/.test(password)) {
        newErrors.password = "Hasło musi zawierać co najmniej jedną cyfrę";
      }

      // Validate password confirmation
      if (password !== confirmPassword) {
        newErrors.confirmPassword = "Hasła nie są zgodne";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit({
      email,
      password: password.trim().length > 0 ? password : undefined,
      confirmPassword: confirmPassword.trim().length > 0 ? confirmPassword : undefined,
    });
  };

  const hasChanges = email !== profile.email || password.trim().length > 0;

  return (
    <Card elevation="md" padding="lg" variant="grouped">
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Stack direction="vertical" spacing="lg">
            <Title2>Dane konta</Title2>

            {/* Email field */}
            <Stack direction="vertical" spacing="xs">
              <FormField
                label="Adres e-mail"
                description={errors.email}
                control={
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="twoj@email.com"
                    disabled={loading}
                  />
                }
              />
            </Stack>

            {/* Password field */}
            <Stack direction="vertical" spacing="xs">
              <FormField
                label="Nowe hasło"
                description={errors.password}
                control={
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Pozostaw puste, jeśli nie chcesz zmieniać"
                    disabled={loading}
                  />
                }
              />
              <Footnote className="text-[hsl(var(--apple-label-tertiary))]">
                Min. 8 znaków, jedna wielka litera i jedna cyfra
              </Footnote>
            </Stack>

            {/* Confirm Password field */}
            {password.trim().length > 0 && (
              <Stack direction="vertical" spacing="xs">
                <FormField
                  label="Potwierdź hasło"
                  description={errors.confirmPassword}
                  control={
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Powtórz hasło"
                      disabled={loading}
                    />
                  }
                />
              </Stack>
            )}

            {/* Submit button */}
            <Button
              type="submit"
              variant="filled"
              color="blue"
              size="large"
              disabled={!hasChanges || loading}
              isLoading={loading}
              className="w-full"
            >
              {loading ? "Zapisywanie..." : "Zapisz zmiany"}
            </Button>
          </Stack>
        </form>
      </CardContent>
    </Card>
  );
}
