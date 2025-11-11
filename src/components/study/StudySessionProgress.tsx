import { Body, Progress, Stack } from "@/components/apple-hig";

interface StudySessionProgressProps {
  current: number;
  total: number;
}

export function StudySessionProgress({ current, total }: StudySessionProgressProps) {
  const safeTotal = Math.max(total, 1);
  const value = Math.min(current + 1, safeTotal);
  const progressLabel = total > 0 ? `${Math.min(current + 1, total)}/${total}` : "0/0";

  return (
    <Stack direction="vertical" spacing="xs" className="w-full" data-testid="study-session-progress">
      <div className="flex items-center justify-between">
        <Body className="text-[hsl(var(--apple-label-secondary))]">Postęp</Body>
        <Body className="text-[hsl(var(--apple-label-tertiary))]">{progressLabel}</Body>
      </div>
      <Progress value={value} max={safeTotal} size="lg" color="blue" />
    </Stack>
  );
}
