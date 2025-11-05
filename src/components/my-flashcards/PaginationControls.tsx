import { Stack, Button, Body } from "@/components/apple-hig";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
}

export function PaginationControls({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;

  return (
    <Stack direction="horizontal" justify="center" align="center" spacing="md">
      <Button variant="default" color="blue" size="medium" onClick={() => onChange(page - 1)} disabled={!canGoPrev}>
        <ChevronLeft className="w-4 h-4" />
        Poprzednia
      </Button>

      <Body className="text-[hsl(var(--apple-label-secondary))]">
        Strona {page} z {totalPages}
      </Body>

      <Button variant="default" color="blue" size="medium" onClick={() => onChange(page + 1)} disabled={!canGoNext}>
        Następna
        <ChevronRight className="w-4 h-4" />
      </Button>
    </Stack>
  );
}
