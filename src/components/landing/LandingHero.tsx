import { Sparkles } from "lucide-react";
import { Button, Stack, Badge, LargeTitle, Title2, Body, Container } from "../apple-hig";

interface LandingHeroProps {
  onRegister: () => void;
  onLogin: () => void;
}

export function LandingHero({ onRegister, onLogin }: LandingHeroProps) {
  return (
    <Container
      size="xl"
      className="py-[var(--apple-space-12)] sm:py-[var(--apple-space-16)] lg:py-[var(--apple-space-20)]"
    >
      <Stack direction="vertical" spacing="xl" align="center" className="text-center">
        <Stack direction="vertical" spacing="lg" align="center" className="max-w-4xl">
          <Badge color="blue" variant="filled" size="lg">
            <Sparkles className="w-4 h-4" />
            Powered by AI
          </Badge>

          <LargeTitle className="text-[hsl(var(--apple-label))] text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
            Ucz się mądrzej,
            <br />
            nie dłużej
          </LargeTitle>

          <Title2 className="text-[hsl(var(--apple-label-secondary))] font-normal max-w-2xl text-base sm:text-lg lg:text-xl">
            Przekształć dowolny tekst w fiszki do nauki za pomocą sztucznej inteligencji. Oszczędź czas i ucz się
            efektywniej.
          </Title2>

          {/* CTA Buttons */}
          <Stack direction="horizontal" spacing="md" className="mt-[var(--apple-space-4)] flex-wrap justify-center">
            <Button variant="filled" color="blue" size="large" onClick={onRegister}>
              <Sparkles className="w-5 h-5" />
              Rozpocznij za darmo
            </Button>
            <Button variant="default" color="blue" size="large" onClick={onLogin}>
              Zaloguj się
            </Button>
          </Stack>

          <Body className="text-[hsl(var(--apple-label-tertiary))] text-sm mt-[var(--apple-space-4)]">
            Bez karty kredytowej • Bez zobowiązań
          </Body>
        </Stack>
      </Stack>
    </Container>
  );
}
