import { CheckCircle } from "lucide-react";
import { Button, Stack, Body } from "../apple-hig";

interface EmailSentSuccessStateProps {
  email: string;
  onGoToLogin: () => void;
  onResend: () => void;
}

export function EmailSentSuccessState({ email, onGoToLogin, onResend }: EmailSentSuccessStateProps) {
  return (
    <div className="w-full" data-testid="email-sent-success-message">
      <Stack direction="vertical" spacing="lg" align="center" className="text-center py-8">
        <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[hsl(var(--apple-green))]/10">
          <CheckCircle className="w-10 h-10 text-[hsl(var(--apple-green))]" />
        </div>
        <Stack direction="vertical" spacing="sm">
          <Body className="text-[hsl(var(--apple-label))] text-lg font-medium">E-mail został wysłany!</Body>
          <Body className="text-[hsl(var(--apple-label-secondary))] text-sm max-w-md">
            Wysłaliśmy link resetujący hasło na adres <strong>{email}</strong>. Sprawdź swoją skrzynkę e-mail i kliknij
            w link, aby ustawić nowe hasło.
          </Body>
          <Body className="text-[hsl(var(--apple-label-tertiary))] text-xs mt-2">
            Nie otrzymałeś e-maila? Sprawdź folder spam lub spróbuj ponownie za kilka minut.
          </Body>
        </Stack>
        <Stack direction="vertical" spacing="sm" className="w-full">
          <Button variant="default" color="blue" size="medium" onClick={onGoToLogin}>
            Wróć do logowania
          </Button>
          <Button variant="plain" color="gray" size="medium" onClick={onResend}>
            Wyślij ponownie
          </Button>
        </Stack>
      </Stack>
    </div>
  );
}
