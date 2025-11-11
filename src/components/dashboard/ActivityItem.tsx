import { ListItem } from "@/components/apple-hig";
import { Sparkles, FileText, GraduationCap } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils/date";
import type { ActivityViewModel } from "@/hooks/useDashboard";

export interface ActivityItemProps {
  activity: ActivityViewModel;
}

const ACTIVITY_ICONS = {
  generation: <Sparkles className="w-5 h-5" />,
  flashcard: <FileText className="w-5 h-5" />,
  session: <GraduationCap className="w-5 h-5" />,
} as const;

export function ActivityItem({ activity }: ActivityItemProps) {
  return (
    <ListItem
      title={activity.description}
      icon={ACTIVITY_ICONS[activity.type]}
      value={formatRelativeTime(activity.timestamp)}
      variant="inset"
    />
  );
}
