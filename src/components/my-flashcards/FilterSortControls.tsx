import { Card, CardContent, Stack, SegmentedControl } from "@/components/apple-hig";
import type { FlashcardsFilters } from "@/hooks/useFlashcards";
import { useFilterSort } from "@/hooks/useFilterSort";
import { FLASHCARD_TYPE_OPTIONS } from "@/lib/constants/flashcardFilters";
import { SortButton } from "./SortButton";

export interface FilterSortProps {
  filters: FlashcardsFilters;
  onChange: (f: FlashcardsFilters) => void;
}

export function FilterSortControls({ filters, onChange }: FilterSortProps) {
  const { handleTypeChange, handleSortChange } = useFilterSort({ filters, onChange });

  return (
    <Card elevation="md" padding="lg" variant="grouped">
      <CardContent>
        <Stack direction="vertical" spacing="md">
          {/* Type Filter */}
          <Stack direction="vertical" spacing="xs">
            <div className="text-[var(--apple-font-body)] text-[hsl(var(--apple-label))] font-medium mb-2">
              Typ fiszki
            </div>
            <SegmentedControl
              value={filters.type || "all"}
              onChange={handleTypeChange}
              fullWidth
              options={FLASHCARD_TYPE_OPTIONS}
            />
          </Stack>

          {/* Sort Controls */}
          <Stack direction="vertical" spacing="xs">
            <div className="text-[var(--apple-font-body)] text-[hsl(var(--apple-label))] font-medium mb-2">
              Sortowanie
            </div>
            <Stack direction="horizontal" spacing="sm">
              <SortButton
                label="Data dodania"
                field="created_at"
                activeField={filters.sort_by}
                sortOrder={filters.sort_order}
                onClick={() => handleSortChange("created_at")}
              />
              <SortButton
                label="Data edycji"
                field="updated_at"
                activeField={filters.sort_by}
                sortOrder={filters.sort_order}
                onClick={() => handleSortChange("updated_at")}
              />
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
