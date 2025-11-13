import { useCallback, useMemo } from "react";
import type { FlashcardsFilters } from "@/hooks/useFlashcards";

export interface UseFilterSortOptions {
  filters: FlashcardsFilters;
  onChange: (filters: FlashcardsFilters) => void;
}

export function useFilterSort({ filters, onChange }: UseFilterSortOptions) {
  // Memoize current filter values to prevent unnecessary re-renders
  const currentType = useMemo(() => filters.type, [filters.type]);
  const currentSortBy = useMemo(() => filters.sort_by, [filters.sort_by]);
  const currentSortOrder = useMemo(() => filters.sort_order, [filters.sort_order]);

  const handleTypeChange = useCallback(
    (value: string) => {
      const newType = value === "all" ? undefined : (value as FlashcardsFilters["type"]);

      // Only change if different to prevent unnecessary updates
      if (newType !== currentType) {
        onChange({
          ...filters,
          type: newType,
          page: 1, // Reset to first page
        });
      }
    },
    [filters, onChange, currentType]
  );

  const handleSortChange = useCallback(
    (field: "created_at" | "updated_at") => {
      // Toggle sort order if same field, otherwise default to desc
      const newOrder = currentSortBy === field ? (currentSortOrder === "desc" ? "asc" : "desc") : "desc";

      // Only change if different
      if (field !== currentSortBy || newOrder !== currentSortOrder) {
        onChange({
          ...filters,
          sort_by: field,
          sort_order: newOrder,
          page: 1,
        });
      }
    },
    [filters, onChange, currentSortBy, currentSortOrder]
  );

  return {
    handleTypeChange,
    handleSortChange,
  };
}
