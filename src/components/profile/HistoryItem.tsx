import { ListItem } from "@/components/apple-hig";
import { Sparkles, GraduationCap } from "lucide-react";
import type { HistoryItemViewModel } from "@/hooks/useProfile";

export interface HistoryItemProps {
  item: HistoryItemViewModel;
}

export function HistoryItem({ item }: HistoryItemProps) {
  const getIcon = () => {
    switch (item.type) {
      case "generation":
        return <Sparkles className="w-5 h-5" />;
      case "session":
        return <GraduationCap className="w-5 h-5" />;
    }
  };

  const getDescription = () => {
    switch (item.type) {
      case "generation":
        return `Wygenerowano ${item.count} fiszek`;
      case "session":
        return `Sesja nauki - ${item.count} fiszek`;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pl-PL", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const subtitle = item.score !== undefined ? `Wynik: ${Math.round(item.score)}%` : undefined;

  return (
    <ListItem
      title={getDescription()}
      subtitle={subtitle}
      icon={getIcon()}
      value={formatDate(item.date)}
      variant="inset"
    />
  );
}
