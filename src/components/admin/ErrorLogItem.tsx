import { ListItem } from "@/components/apple-hig";
import { AlertCircle } from "lucide-react";
import { formatDateTime } from "@/lib/utils/date";
import type { GenerationErrorDTO } from "@/types";

export interface ErrorLogItemProps {
  log: GenerationErrorDTO;
}

export function ErrorLogItem({ log }: ErrorLogItemProps) {
  return (
    <ListItem
      title={`Kod błędu: ${log.error_code}`}
      subtitle={log.error_message}
      icon={<AlertCircle className="w-5 h-5 text-[hsl(var(--apple-red))]" />}
      value={formatDateTime(log.created_at)}
      variant="inset"
    />
  );
}
