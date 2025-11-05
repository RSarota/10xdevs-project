import { Stack, Title2, List, EmptyState } from "@/components/apple-hig";
import { ActivityItem } from "./ActivityItem";
import { Activity } from "lucide-react";
import type { ActivityViewModel } from "@/hooks/useDashboard";

export interface RecentActivityFeedProps {
  activities: ActivityViewModel[];
}

export function RecentActivityFeed({ activities }: RecentActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <Stack direction="vertical" spacing="md">
        <Title2>Ostatnia aktywność</Title2>
        <EmptyState
          icon={<Activity className="w-12 h-12" />}
          title="Brak ostatnich aktywności"
          description="Twoja aktywność pojawi się tutaj"
        />
      </Stack>
    );
  }

  return (
    <Stack direction="vertical" spacing="md">
      <Title2>Ostatnia aktywność</Title2>
      <List variant="inset">
        {activities.map((activity) => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </List>
    </Stack>
  );
}
