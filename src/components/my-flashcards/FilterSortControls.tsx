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
    <div className="bg-white/60 dark:bg-black/15 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg p-6">
      <div className="space-y-6">
        {/* Type Filter */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">Typ fiszki</div>
          <div className="inline-flex bg-gray-100/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-1 w-full">
            {FLASHCARD_TYPE_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleTypeChange(option.value)}
                className={`
                  flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200
                  ${
                    filters.type === option.value || (!filters.type && option.value === "all")
                      ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                      : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                  }
                `}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sort Controls */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">Sortowanie</div>
          <div className="flex gap-2">
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
          </div>
        </div>
      </div>
    </div>
  );
}
