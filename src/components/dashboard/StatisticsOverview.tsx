import { Grid, Stack, Title2, Divider } from "@/components/apple-hig";
import { StatisticsCard } from "./StatisticsCard";
import type { UserStatisticsDTO } from "@/types";
import { FileText, Sparkles, CheckCircle2, Pencil, Target } from "lucide-react";

export interface StatisticsOverviewProps {
  statistics: UserStatisticsDTO;
}

export function StatisticsOverview({ statistics }: StatisticsOverviewProps) {
  const formatPercentage = (value: number) => `${Math.round(value)}%`;

  return (
    <Stack direction="vertical" spacing="lg">
      <Title2>Twoje statystyki</Title2>

      {/* Fiszki Section */}
      <Grid columns={2} gap="md" className="sm:grid-cols-3">
        <StatisticsCard
          title="Wszystkie fiszki"
          value={statistics.flashcards.total}
          icon={<FileText className="w-5 h-5" />}
        />
        <StatisticsCard
          title="Ręczne"
          value={statistics.flashcards.by_type.manual}
          icon={<Pencil className="w-5 h-5" />}
        />
        <StatisticsCard
          title="AI (pełne)"
          value={statistics.flashcards.by_type["ai-full"]}
          icon={<Sparkles className="w-5 h-5" />}
        />
        <StatisticsCard
          title="AI (edytowane)"
          value={statistics.flashcards.by_type["ai-edited"]}
          icon={<CheckCircle2 className="w-5 h-5" />}
        />
      </Grid>

      <Divider />

      {/* Generacje AI Section */}
      <Stack direction="vertical" spacing="md">
        <Title2>Generacje AI</Title2>
        <Grid columns={2} gap="md" className="sm:grid-cols-3">
          <StatisticsCard
            title="Sesje generacji"
            value={statistics.generations.total_sessions}
            icon={<Sparkles className="w-5 h-5" />}
          />
          <StatisticsCard
            title="Wygenerowano"
            value={statistics.generations.total_generated}
            icon={<FileText className="w-5 h-5" />}
          />
          <StatisticsCard
            title="Zaakceptowano"
            value={statistics.generations.total_accepted}
            icon={<CheckCircle2 className="w-5 h-5" />}
          />
          <StatisticsCard
            title="Wskaźnik akceptacji"
            value={formatPercentage(statistics.generations.acceptance_rate)}
            icon={<Target className="w-5 h-5" />}
          />
          <StatisticsCard
            title="Wskaźnik edycji"
            value={formatPercentage(statistics.generations.edit_rate)}
            icon={<Pencil className="w-5 h-5" />}
          />
        </Grid>
      </Stack>
    </Stack>
  );
}
