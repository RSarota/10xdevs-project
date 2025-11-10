import { useEffect, useState } from "react";
import { Card, CardHeader, Stack, Input, Button, Footnote } from "@/components/apple-hig";
import { Mail, Lock } from "lucide-react";
import type { ProfileFormData, UserProfileDTO } from "@/hooks/useProfile";

export interface ProfileFormProps {
  profile: UserProfileDTO;
  onSubmit: (data: ProfileFormData) => void;
  loading?: boolean;
}

export function ProfileForm({ profile, onSubmit, loading = false }: ProfileFormProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof ProfileFormData, string>>>({});
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ProfileFormData, string>> = {};

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

    // Only validate if password is being changed
    if (password.trim().length > 0 && !validateForm()) {
      return;
    }

    onSubmit({
      email: profile.email, // Email is read-only, always use original
      password: password.trim().length > 0 ? password : undefined,
      confirmPassword: confirmPassword.trim().length > 0 ? confirmPassword : undefined,
    });
  };

  const hasChanges = password.trim().length > 0;

  return (
    <Card elevation="md" padding="xl" variant="grouped">
      <Stack direction="vertical" spacing="xl">
        <CardHeader title="Dane konta" subtitle="Zarządzaj danymi swojego konta" />

        <form
          onSubmit={handleSubmit}
          data-testid="profile-form"
          data-ready={isReady ? "true" : "false"}
          aria-busy={!isReady}
        >
          <Stack direction="vertical" spacing="lg">
            {/* Email field - read only */}
            <Input
              type="email"
              label="Adres e-mail"
              value={profile.email}
              placeholder="twoj@email.com"
              disabled={true}
              icon={<Mail className="w-5 h-5" />}
              data-testid="profile-email-input"
            />

            {/* Password field */}
            <Stack direction="vertical" spacing="xs">
              <Input
                type="password"
                label="Nowe hasło"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Pozostaw puste, jeśli nie chcesz zmieniać"
                disabled={loading}
                error={errors.password}
                icon={<Lock className="w-5 h-5" />}
                data-testid="profile-password-input"
              />
              <Footnote className="text-[hsl(var(--apple-label-tertiary))]">
                Min. 8 znaków, jedna wielka litera i jedna cyfra
              </Footnote>
            </Stack>

            {/* Confirm Password field */}
            {password.trim().length > 0 && (
              <Input
                type="password"
                label="Potwierdź hasło"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Powtórz hasło"
                disabled={loading}
                error={errors.confirmPassword}
                icon={<Lock className="w-5 h-5" />}
                data-testid="profile-confirm-password-input"
              />
            )}

            {/* Submit button */}
            <div className="pt-[var(--apple-space-4)]">
              <Button
                type="submit"
                variant="filled"
                color="blue"
                size="large"
                fullWidth
                disabled={!hasChanges || loading}
                isLoading={loading}
                data-testid="profile-save-button"
              >
                {loading ? "Zapisywanie..." : "Zapisz zmiany"}
              </Button>
            </div>
          </Stack>
        </form>
      </Stack>
    </Card>
  );
}
