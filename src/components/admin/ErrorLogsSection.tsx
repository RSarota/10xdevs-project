import { Stack, Title2, EmptyState } from "@/components/apple-hig";
import { ErrorLogList } from "./ErrorLogList";
import { PaginationControls } from "../my-flashcards/PaginationControls";
import { AlertCircle } from "lucide-react";
import type { GenerationErrorDTO } from "@/types";

export interface ErrorLogsSectionProps {
  logs: GenerationErrorDTO[];
  totalPages: number;
  currentPage: number;
  onPageChange: (p: number) => void;
}

export function ErrorLogsSection({ logs, totalPages, currentPage, onPageChange }: ErrorLogsSectionProps) {
  if (logs.length === 0) {
    return (
      <Stack direction="vertical" spacing="md">
        <Title2>Logi błędów generacji</Title2>
        <EmptyState
          icon={<AlertCircle className="w-12 h-12" />}
          title="Brak błędów"
          description="Nie znaleziono żadnych błędów generacji"
        />
      </Stack>
    );
  }

  return (
    <Stack direction="vertical" spacing="md">
      <Title2>Logi błędów generacji</Title2>
      <ErrorLogList logs={logs} />
      <PaginationControls page={currentPage} totalPages={totalPages} onChange={onPageChange} />
    </Stack>
  );
}
