import { ListItem } from "@/components/apple-hig";
import { Sparkles, FileText, GraduationCap } from "lucide-react";
import type { ActivityViewModel } from "@/hooks/useDashboard";

export interface ActivityItemProps {
  activity: ActivityViewModel;
}

export function ActivityItem({ activity }: ActivityItemProps) {
  const getIcon = () => {
    switch (activity.type) {
      case "generation":
        return <Sparkles className="w-5 h-5" />;
      case "flashcard":
        return <FileText className="w-5 h-5" />;
      case "session":
        return <GraduationCap className="w-5 h-5" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 1000 / 60);

    if (diffInMinutes < 1) return "Przed chwilą";
    if (diffInMinutes < 60) return `${diffInMinutes} min temu`;
    if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} ${hours === 1 ? "godz" : "godz"} temu`;
    }
    return date.toLocaleDateString("pl-PL", { day: "numeric", month: "short" });
  };

  return (
    <ListItem
      title={activity.description}
      icon={getIcon()}
      value={formatTimestamp(activity.timestamp)}
      variant="inset"
    />
  );
}
