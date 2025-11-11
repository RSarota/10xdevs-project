import { Card, CardContent, Stack, Body, Title3, ActivityIndicator } from "@/components/apple-hig";

interface FlashcardsLoaderProps {
  loading: boolean;
  title?: string;
  description?: string;
}

export function FlashcardsLoader({
  loading,
  title = "Generowanie fiszek...",
  description = "AI analizuje tekst i tworzy propozycje fiszek",
}: FlashcardsLoaderProps) {
  if (!loading) {
    return null;
  }

  return (
    <Card elevation="md" padding="xl" variant="grouped" data-testid="flashcards-loader">
      <CardContent>
        <Stack direction="vertical" spacing="lg" align="center" className="py-[var(--apple-space-12)]">
          <ActivityIndicator size="lg" color="blue" />
          <Stack direction="vertical" spacing="sm" align="center">
            <Title3 className="text-[hsl(var(--apple-label))]">{title}</Title3>
            <Body className="text-[hsl(var(--apple-label-secondary))]">{description}</Body>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
