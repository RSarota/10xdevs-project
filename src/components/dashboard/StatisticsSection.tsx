import { Grid, Title2 } from "@/components/apple-hig";
import { StatisticsCard } from "./StatisticsCard";
import type { UserStatisticsDTO } from "@/types";
import type { StatisticConfig } from "@/lib/constants/statistics";

interface StatisticsSectionProps {
  title: string;
  statistics: StatisticConfig[];
  stats: UserStatisticsDTO;
}

export function StatisticsSection({ title, statistics, stats }: StatisticsSectionProps) {
  return (
    <>
      <Title2>{title}</Title2>
      <Grid columns={2} gap="md" className="sm:grid-cols-3">
        {statistics.map((stat) => {
          const Icon = stat.icon;
          return (
            <StatisticsCard
              key={stat.title}
              title={stat.title}
              value={stat.getValue(stats)}
              icon={<Icon className="w-5 h-5" />}
            />
          );
        })}
      </Grid>
    </>
  );
}
