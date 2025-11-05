import { Sparkles } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-[var(--spacing-xxxl)] text-center">
      <div className="mb-[var(--spacing-l)] rounded-[var(--radius-circular)] bg-primary/10 p-[var(--spacing-l)]">
        <Sparkles className="h-12 w-12 text-primary" />
      </div>
      <h3 className="mb-[var(--spacing-s)] text-[var(--font-size-600)] font-[var(--font-weight-semibold)] text-foreground">
        Gotowy do generowania?
      </h3>
      <p className="max-w-md text-[var(--font-size-300)] text-muted-foreground">
        Wklej materiał do nauki w pole powyżej, a AI przeanalizuje go i stworzy dla Ciebie zestaw fiszek edukacyjnych.
      </p>
      <div className="mt-[var(--spacing-xl)] flex items-center gap-[var(--spacing-s)] text-[var(--font-size-200)] text-muted-foreground">
        <div className="flex items-center gap-[var(--spacing-xxs)]">
          <div className="h-[0.375rem] w-[0.375rem] rounded-[var(--radius-circular)] bg-success" />
          <span>Szybkie generowanie</span>
        </div>
        <span>•</span>
        <div className="flex items-center gap-[var(--spacing-xxs)]">
          <div className="h-[0.375rem] w-[0.375rem] rounded-[var(--radius-circular)] bg-brand-80" />
          <span>Edycja propozycji</span>
        </div>
        <span>•</span>
        <div className="flex items-center gap-[var(--spacing-xxs)]">
          <div className="h-[0.375rem] w-[0.375rem] rounded-[var(--radius-circular)] bg-accent" />
          <span>Pełna kontrola</span>
        </div>
      </div>
    </div>
  );
}
