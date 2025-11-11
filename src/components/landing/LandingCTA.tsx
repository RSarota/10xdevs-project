import { Sparkles } from "lucide-react";
import { Container, Card, CardContent, Stack, Title1, Body, Button, Divider } from "../apple-hig";

interface LandingCTAProps {
  onRegister: () => void;
  onDemo: () => void;
}

export function LandingCTA({ onRegister, onDemo }: LandingCTAProps) {
  return (
    <>
      <Divider />
      <Container
        size="xl"
        className="py-[var(--apple-space-12)] sm:py-[var(--apple-space-16)] lg:py-[var(--apple-space-20)]"
      >
        <Card elevation="lg" padding="xl" variant="grouped" className="max-w-4xl mx-auto">
          <CardContent>
            <Stack
              direction="vertical"
              spacing="lg"
              align="center"
              className="text-center py-[var(--apple-space-6)] sm:py-[var(--apple-space-8)]"
            >
              <Stack direction="vertical" spacing="md" align="center" className="max-w-2xl">
                <Title1 className="text-3xl sm:text-4xl lg:text-5xl">Gotowy, aby zacząć?</Title1>
                <Body className="text-[hsl(var(--apple-label-secondary))] text-base sm:text-lg">
                  Dołącz do tysięcy studentów, którzy już uczą się mądrzej dzięki AI
                </Body>
              </Stack>
              <Stack direction="horizontal" spacing="md" className="flex-wrap justify-center mt-[var(--apple-space-2)]">
                <Button variant="filled" color="blue" size="large" onClick={onRegister}>
                  <Sparkles className="w-5 h-5" />
                  Utwórz darmowe konto
                </Button>
                <Button variant="default" color="blue" size="large" onClick={onDemo}>
                  Zobacz demo
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}
