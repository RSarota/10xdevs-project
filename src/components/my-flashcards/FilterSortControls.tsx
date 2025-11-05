import { Card, CardContent, Stack, Button, SegmentedControl } from "@/components/apple-hig";
import type { FlashcardsFilters } from "@/hooks/useFlashcards";
import { ArrowUpDown } from "lucide-react";

export interface FilterSortProps {
  filters: FlashcardsFilters;
  onChange: (f: FlashcardsFilters) => void;
}

export function FilterSortControls({ filters, onChange }: FilterSortProps) {
  const handleTypeChange = (value: string) => {
    onChange({
      ...filters,
      type: value === "all" ? undefined : (value as any),
      page: 1, // Reset to first page
    });
  };

  const handleSortChange = (field: "created_at" | "updated_at") => {
    // Toggle sort order if same field, otherwise default to desc
    const newOrder = filters.sort_by === field ? (filters.sort_order === "desc" ? "asc" : "desc") : "desc";

    onChange({
      ...filters,
      sort_by: field,
      sort_order: newOrder,
      page: 1,
    });
  };

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
              options={[
                { value: "all", label: "Wszystkie" },
                { value: "manual", label: "Ręczne" },
                { value: "ai-full", label: "AI (pełne)" },
                { value: "ai-edited", label: "AI (edytowane)" },
              ]}
            />
          </Stack>

          {/* Sort Controls */}
          <Stack direction="vertical" spacing="xs">
            <div className="text-[var(--apple-font-body)] text-[hsl(var(--apple-label))] font-medium mb-2">
              Sortowanie
            </div>
            <Stack direction="horizontal" spacing="sm">
              <Button
                variant={filters.sort_by === "created_at" ? "filled" : "default"}
                color="blue"
                size="small"
                onClick={() => handleSortChange("created_at")}
              >
                <ArrowUpDown className="w-4 h-4" />
                Data dodania
                {filters.sort_by === "created_at" && (
                  <span className="ml-1">{filters.sort_order === "desc" ? "↓" : "↑"}</span>
                )}
              </Button>
              <Button
                variant={filters.sort_by === "updated_at" ? "filled" : "default"}
                color="blue"
                size="small"
                onClick={() => handleSortChange("updated_at")}
              >
                <ArrowUpDown className="w-4 h-4" />
                Data edycji
                {filters.sort_by === "updated_at" && (
                  <span className="ml-1">{filters.sort_order === "desc" ? "↓" : "↑"}</span>
                )}
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
