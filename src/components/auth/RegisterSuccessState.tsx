import { CheckCircle } from "lucide-react";
import { Button, Stack, Body } from "../apple-hig";

interface RegisterSuccessStateProps {
  email: string;
  onGoToLogin: () => void;
}

export function RegisterSuccessState({ email, onGoToLogin }: RegisterSuccessStateProps) {
  return (
    <div className="w-full" data-testid="register-success-message">
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
        <Button
          variant="default"
          color="blue"
          size="medium"
          onClick={onGoToLogin}
          data-testid="register-go-to-login-button"
        >
          Przejdź do logowania
        </Button>
      </Stack>
    </div>
  );
}
