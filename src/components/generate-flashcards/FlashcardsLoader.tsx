import { Card, CardContent } from "@/components/ui/card";

interface FlashcardsLoaderProps {
  loading: boolean;
}

export function FlashcardsLoader({ loading }: FlashcardsLoaderProps) {
  if (!loading) {
    return null;
  }

  return (
    <Card className="mt-[var(--spacing-xxxl)]">
      <CardContent className="pt-[var(--spacing-xl)]">
        <div className="flex flex-col items-center justify-center py-[var(--spacing-xxxl)] space-y-[var(--spacing-l)]">
          <div className="relative">
            <div className="animate-spin rounded-[var(--radius-circular)] h-16 w-16 border-b-2 border-t-2 border-primary"></div>
            <div className="absolute top-0 left-0 animate-ping rounded-[var(--radius-circular)] h-16 w-16 border border-primary opacity-20"></div>
          </div>
          <div className="text-center space-y-[var(--spacing-s)]">
            <p className="text-[var(--font-size-700)] font-[var(--font-weight-medium)] text-foreground">
              Generowanie fiszek...
            </p>
            <p className="text-[var(--font-size-300)] text-muted-foreground">
              AI analizuje tekst i tworzy propozycje fiszek
            </p>
          </div>
          <div className="flex space-x-[var(--spacing-xxs)]">
            <div className="h-[0.5rem] w-[0.5rem] bg-primary rounded-[var(--radius-circular)] animate-bounce [animation-delay:-0.3s]"></div>
            <div className="h-[0.5rem] w-[0.5rem] bg-primary rounded-[var(--radius-circular)] animate-bounce [animation-delay:-0.15s]"></div>
            <div className="h-[0.5rem] w-[0.5rem] bg-primary rounded-[var(--radius-circular)] animate-bounce"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
