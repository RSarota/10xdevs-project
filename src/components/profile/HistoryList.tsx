import { Stack, Title2, List, EmptyState } from "@/components/apple-hig";
import { HistoryItem } from "./HistoryItem";
import { History } from "lucide-react";
import type { HistoryItemViewModel } from "@/hooks/useProfile";

export interface HistoryListProps {
  items: HistoryItemViewModel[];
}

export function HistoryList({ items }: HistoryListProps) {
  if (items.length === 0) {
    return (
      <Stack direction="vertical" spacing="md">
        <Title2>Historia</Title2>
        <EmptyState
          icon={<History className="w-12 h-12" />}
          title="Brak historii"
          description="Twoja historia aktywności pojawi się tutaj"
        />
      </Stack>
    );
  }

  return (
    <Stack direction="vertical" spacing="md">
      <Title2>Historia</Title2>
      <List variant="inset">
        {items.map((item) => (
          <HistoryItem key={item.id} item={item} />
        ))}
      </List>
    </Stack>
  );
}
