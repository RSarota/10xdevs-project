import { ThemeToggle } from "../ThemeToggle";

export function LandingFooter() {
  return (
    <footer className="w-full border-t border-[hsl(var(--apple-separator-opaque))] bg-[hsl(var(--apple-grouped-bg-secondary))] mt-[var(--apple-space-8)]">
      <div className="max-w-7xl mx-auto px-[var(--apple-space-5)] py-[var(--apple-space-3)]">
        <div className="flex items-center justify-center gap-3">
          <p className="text-center text-[var(--apple-font-footnote)] text-[hsl(var(--apple-label-tertiary))]">
            © 2025 10xCards. Wszystkie prawa zastrzeżone.
          </p>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
