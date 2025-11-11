import { useState } from "react";
import { Card, CardHeader, Stack, Input, Button } from "@/components/apple-hig";
import { Mail } from "lucide-react";
import { profileUpdateSchema, type ProfileUpdateInput } from "@/lib/schemas/profile.schema";
import { PasswordChangeFields } from "./PasswordChangeFields";
import type { ProfileFormData, UserProfileDTO } from "@/hooks/useProfile";
import { useFormValidation } from "@/hooks/useFormValidation";
import { useFormReady } from "@/hooks/useFormReady";

export interface ProfileFormProps {
  profile: UserProfileDTO;
  onSubmit: (data: ProfileFormData) => void;
  loading?: boolean;
}

export function ProfileForm({ profile, onSubmit, loading = false }: ProfileFormProps) {
  const [formData, setFormData] = useState<ProfileUpdateInput>({
    email: profile.email,
    password: "",
    confirmPassword: "",
  });
  const { isReady } = useFormReady();
  const { errors, setErrors, validateForm, clearFieldError } = useFormValidation({
    schema: profileUpdateSchema,
  });

  const handleFieldChange = <K extends keyof ProfileUpdateInput>(field: K, value: ProfileUpdateInput[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      clearFieldError(field);
    }
  };

  const validateFormConditionally = (): boolean => {
    // Jeśli hasło nie jest podane, nie walidujemy
    if (formData.password?.trim().length === 0) {
      setErrors({});
      return true;
    }
    return validateForm(formData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Only validate if password is being changed
    if (formData.password?.trim().length === 0) {
      // No password change, submit without validation
      onSubmit({
        email: profile.email,
        password: undefined,
        confirmPassword: undefined,
      });
      return;
    }

    if (!validateFormConditionally()) {
      return;
    }

    onSubmit({
      email: profile.email,
      password: formData.password ?? undefined,
      confirmPassword: formData.confirmPassword ?? undefined,
    });
  };

  const hasChanges = (formData.password?.trim().length ?? 0) > 0;

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

            {/* Password fields */}
            <PasswordChangeFields
              password={formData.password ?? ""}
              confirmPassword={formData.confirmPassword ?? ""}
              onPasswordChange={(value) => handleFieldChange("password", value)}
              onConfirmPasswordChange={(value) => handleFieldChange("confirmPassword", value)}
              passwordError={errors.password}
              confirmPasswordError={errors.confirmPassword}
              disabled={loading}
            />

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
