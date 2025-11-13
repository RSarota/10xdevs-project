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
    <Card
      elevation="md"
      padding="lg"
      variant="grouped"
      className="group hover:shadow-md transition-all duration-300 relative overflow-hidden"
    >
      <CardContent>
        {/* Subtle gradient overlay - much more subtle */}
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--apple-blue)/0.005)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <Stack direction="vertical" spacing="md" className="relative">
          <Stack direction="horizontal" justify="between" align="center">
            <Footnote className="text-[hsl(var(--apple-label-secondary))] uppercase tracking-wide font-medium">
              {title}
            </Footnote>
            {icon && (
              <div className="text-[hsl(var(--apple-blue))] bg-[hsl(var(--apple-blue)/0.08)] rounded-lg p-2 group-hover:bg-[hsl(var(--apple-blue)/0.12)] transition-colors">
                {icon}
              </div>
            )}
          </Stack>
          <LargeTitle className="bg-gradient-to-r from-[hsl(var(--apple-label))] to-[hsl(var(--apple-label-secondary))] bg-clip-text text-transparent">
            {value}
          </LargeTitle>
          {trend && <Footnote className="text-[hsl(var(--apple-label-tertiary))]">{trend}</Footnote>}
        </Stack>
      </CardContent>
    </Card>
  );
}
