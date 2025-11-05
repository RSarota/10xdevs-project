import { ListItem } from "@/components/apple-hig";
import { AlertCircle } from "lucide-react";
import type { GenerationErrorDTO } from "@/types";

export interface ErrorLogItemProps {
  log: GenerationErrorDTO;
}

export function ErrorLogItem({ log }: ErrorLogItemProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("pl-PL", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <ListItem
      title={`Kod błędu: ${log.error_code}`}
      subtitle={log.error_message}
      icon={<AlertCircle className="w-5 h-5 text-[hsl(var(--apple-red))]" />}
      value={formatDate(log.created_at)}
      variant="inset"
    />
  );
}
