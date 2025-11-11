import { Stack, Divider } from "@/components/apple-hig";
import { StatisticsSection } from "./StatisticsSection";
import type { UserStatisticsDTO } from "@/types";
import { FLASHCARD_STATISTICS, GENERATION_STATISTICS } from "@/lib/constants/statistics";

export interface StatisticsOverviewProps {
  statistics: UserStatisticsDTO;
}

export function StatisticsOverview({ statistics }: StatisticsOverviewProps) {
  return (
    <Stack direction="vertical" spacing="lg">
      <StatisticsSection title="Twoje statystyki" statistics={FLASHCARD_STATISTICS} stats={statistics} />

      <Divider />

      <Stack direction="vertical" spacing="md">
        <StatisticsSection title="Generacje AI" statistics={GENERATION_STATISTICS} stats={statistics} />
      </Stack>
    </Stack>
  );
}
