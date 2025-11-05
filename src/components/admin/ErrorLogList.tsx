import { List } from "@/components/apple-hig";
import { ErrorLogItem } from "./ErrorLogItem";
import type { GenerationErrorDTO } from "@/types";

export interface ErrorLogListProps {
  logs: GenerationErrorDTO[];
}

export function ErrorLogList({ logs }: ErrorLogListProps) {
  return (
    <List variant="inset">
      {logs.map((log) => (
        <ErrorLogItem key={log.id} log={log} />
      ))}
    </List>
  );
}
