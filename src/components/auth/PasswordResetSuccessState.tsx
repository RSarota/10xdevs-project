import { CheckCircle } from "lucide-react";
import { Button, Stack, Body } from "../apple-hig";

interface PasswordResetSuccessStateProps {
  onGoToLogin: () => void;
}

export function PasswordResetSuccessState({ onGoToLogin }: PasswordResetSuccessStateProps) {
  return (
    <div className="w-full" data-testid="password-reset-success-message">
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
        <Button
          variant="default"
          color="blue"
          size="medium"
          onClick={onGoToLogin}
          data-testid="password-reset-go-to-login-button"
        >
          Przejdź do logowania
        </Button>
      </Stack>
    </div>
  );
}
