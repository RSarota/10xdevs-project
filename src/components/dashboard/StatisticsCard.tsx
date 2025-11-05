import { Card, CardContent, Stack, LargeTitle, Footnote } from "@/components/apple-hig";
import type { ReactNode } from "react";

export interface StatisticsCardProps {
  title: string;
  value: number | string;
  icon?: ReactNode;
  trend?: string;
}

export function StatisticsCard({ title, value, icon, trend }: StatisticsCardProps) {
  return (
    <Card elevation="md" padding="lg" variant="grouped">
      <CardContent>
        <Stack direction="vertical" spacing="md">
          <Stack direction="horizontal" justify="between" align="center">
            <Footnote className="text-[hsl(var(--apple-label-secondary))] uppercase tracking-wide">{title}</Footnote>
            {icon && <div className="text-[hsl(var(--apple-blue))]">{icon}</div>}
          </Stack>
          <LargeTitle className="text-[hsl(var(--apple-label))]">{value}</LargeTitle>
          {trend && <Footnote className="text-[hsl(var(--apple-label-tertiary))]">{trend}</Footnote>}
        </Stack>
      </CardContent>
    </Card>
  );
}
