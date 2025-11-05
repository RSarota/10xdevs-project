interface ProgressBarProps {
  current: number;
  total: number;
  accepted: number;
}

export function ProgressBar({ current, total, accepted }: ProgressBarProps) {
  const reviewedPercentage = total > 0 ? (current / total) * 100 : 0;
  const acceptedPercentage = total > 0 ? (accepted / total) * 100 : 0;

  return (
    <div className="space-y-[var(--spacing-s)]">
      <div className="flex items-center justify-between text-[var(--font-size-300)]">
        <span className="text-muted-foreground">Postęp rewizji</span>
        <span className="font-[var(--font-weight-medium)] text-foreground">
          {current} / {total} zrewidowano
        </span>
      </div>
      <div className="relative h-[0.5rem] w-full overflow-hidden rounded-[var(--radius-circular)] bg-secondary">
        <div
          className="absolute h-full bg-primary/30 transition-all duration-[var(--duration-ultra-slow)] ease-[var(--curve-decelerate)]"
          style={{ width: `${reviewedPercentage}%` }}
        />
        <div
          className="absolute h-full bg-primary transition-all duration-[var(--duration-ultra-slow)] ease-[var(--curve-decelerate)]"
          style={{ width: `${acceptedPercentage}%` }}
        />
      </div>
      <div className="flex items-center gap-[var(--spacing-l)] text-[var(--font-size-200)] text-muted-foreground">
        <div className="flex items-center gap-[var(--spacing-xs)]">
          <div className="h-[0.5rem] w-[0.5rem] rounded-[var(--radius-circular)] bg-primary" />
          <span>{accepted} zaakceptowano</span>
        </div>
        <div className="flex items-center gap-[var(--spacing-xs)]">
          <div className="h-[0.5rem] w-[0.5rem] rounded-[var(--radius-circular)] bg-destructive" />
          <span>{total - current} oczekuje</span>
        </div>
      </div>
    </div>
  );
}
