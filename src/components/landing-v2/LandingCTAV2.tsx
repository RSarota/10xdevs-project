import { Sparkles, ArrowRight, Zap } from "lucide-react";
import { Container, Stack, Title1, Body, Button, Card, CardContent, Divider } from "../apple-hig";

interface LandingCTAV2Props {
  onRegister: () => void;
}

export function LandingCTAV2({ onRegister }: LandingCTAV2Props) {
  return (
    <>
      <Divider />
      <div className="relative overflow-hidden mb-16 sm:mb-20 lg:mb-24">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(var(--apple-blue)/0.03)] to-transparent" />

        {/* Subtle gradient accents - much more subtle */}
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-[hsl(var(--apple-blue)/0.05)] rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-[hsl(var(--apple-purple)/0.05)] rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />

        <Container
          size="xl"
          className="relative py-[var(--apple-space-20)] sm:py-[var(--apple-space-24)] lg:py-[var(--apple-space-28)]"
        >
          <Card
            elevation="lg"
            padding="xl"
            variant="grouped"
            className="border border-[hsl(var(--apple-separator-opaque))] bg-[hsl(var(--apple-grouped-bg-secondary))]"
          >
            <CardContent>
              <Stack direction="vertical" spacing="xl" align="center" className="text-center max-w-3xl mx-auto">
                {/* Icon */}
                <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-br from-[hsl(var(--apple-blue))] to-[hsl(var(--apple-purple))] shadow-lg">
                  <Zap className="w-10 h-10 text-white" />
                </div>

                {/* Headline */}
                <Title1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
                  Gotowy na{" "}
                  <span className="bg-gradient-to-r from-[hsl(var(--apple-blue))] to-[hsl(var(--apple-purple))] bg-clip-text text-transparent">
                    szybszą naukę?
                  </span>
                </Title1>

                {/* Description */}
                <Body className="text-[hsl(var(--apple-label-secondary))] text-lg sm:text-xl max-w-2xl">
                  Dołącz do tysięcy użytkowników, którzy już oszczędzają czas i uczą się efektywniej z 10xCards
                </Body>

                {/* CTA Buttons */}
                <Stack
                  direction="horizontal"
                  spacing="md"
                  className="mt-[var(--apple-space-6)] flex-wrap justify-center"
                >
                  <Button
                    variant="filled"
                    color="blue"
                    size="large"
                    onClick={onRegister}
                    className="group shadow-lg hover:shadow-xl transition-all duration-300 min-w-[200px]"
                  >
                    <Sparkles className="w-5 h-5" />
                    Rozpocznij za darmo
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Stack>

                {/* Trust indicators */}
                <Body className="text-[hsl(var(--apple-label-tertiary))] text-sm mt-[var(--apple-space-4)]">
                  ✓ Bezpłatne konto • ✓ Bez karty kredytowej • ✓ Natychmiastowy dostęp
                </Body>
              </Stack>
            </CardContent>
          </Card>
        </Container>
      </div>
    </>
  );
}
