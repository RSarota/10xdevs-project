import { useCallback } from "react";
import type { FlashcardsFilters } from "@/hooks/useFlashcards";

export interface UseFilterSortOptions {
  filters: FlashcardsFilters;
  onChange: (filters: FlashcardsFilters) => void;
}

export function useFilterSort({ filters, onChange }: UseFilterSortOptions) {
  const handleTypeChange = useCallback(
    (value: string) => {
      onChange({
        ...filters,
        type: value === "all" ? undefined : (value as FlashcardsFilters["type"]),
        page: 1, // Reset to first page
      });
    },
    [filters, onChange]
  );

  const handleSortChange = useCallback(
    (field: "created_at" | "updated_at") => {
      // Toggle sort order if same field, otherwise default to desc
      const newOrder = filters.sort_by === field ? (filters.sort_order === "desc" ? "asc" : "desc") : "desc";

      onChange({
        ...filters,
        sort_by: field,
        sort_order: newOrder,
        page: 1,
      });
    },
    [filters, onChange]
  );

  return {
    handleTypeChange,
    handleSortChange,
  };
}
