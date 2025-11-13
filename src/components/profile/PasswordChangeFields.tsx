import { Lock } from "lucide-react";
import { Stack, Input, Footnote } from "@/components/apple-hig";

interface PasswordChangeFieldsProps {
  password: string;
  confirmPassword: string;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  passwordError?: string;
  confirmPasswordError?: string;
  disabled?: boolean;
  required?: boolean; // If true, password is required (e.g., password reset)
}

export function PasswordChangeFields({
  password,
  confirmPassword,
  onPasswordChange,
  onConfirmPasswordChange,
  passwordError,
  confirmPasswordError,
  disabled,
  required = false,
}: PasswordChangeFieldsProps) {
  const showConfirmPassword = password.trim().length > 0 || required;

  return (
    <>
      {/* Password field */}
      <Stack direction="vertical" spacing="xs">
        <Input
          type="password"
          label="Nowe hasło"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          placeholder={required ? "Wprowadź nowe hasło" : "Pozostaw puste, jeśli nie chcesz zmieniać"}
          disabled={disabled}
          error={passwordError}
          icon={<Lock className="w-5 h-5" />}
          required={required}
          data-testid="profile-password-input"
        />
        <Footnote className="text-[hsl(var(--apple-label-tertiary))]">
          Min. 8 znaków, jedna wielka litera i jedna cyfra
        </Footnote>
      </Stack>

      {/* Confirm Password field */}
      {showConfirmPassword && (
        <Input
          type="password"
          label="Potwierdź hasło"
          value={confirmPassword}
          onChange={(e) => onConfirmPasswordChange(e.target.value)}
          placeholder="Powtórz hasło"
          disabled={disabled}
          error={confirmPasswordError}
          icon={<Lock className="w-5 h-5" />}
          data-testid="profile-confirm-password-input"
        />
      )}
    </>
  );
}
