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
    <div className="bg-white/60 dark:bg-black/15 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg p-6">
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => onChange(page - 1)}
          disabled={!canGoPrev}
          className={`
            flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200
            ${
              canGoPrev
                ? "bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700 shadow-md"
                : "bg-gray-100/50 dark:bg-gray-800/50 text-gray-400 dark:text-gray-600 cursor-not-allowed"
            }
          `}
        >
          <ChevronLeft className="w-4 h-4" />
          Poprzednia
        </button>

        <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
          Strona {page} z {totalPages}
        </span>

        <button
          onClick={() => onChange(page + 1)}
          disabled={!canGoNext}
          className={`
            flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200
            ${
              canGoNext
                ? "bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700 shadow-md"
                : "bg-gray-100/50 dark:bg-gray-800/50 text-gray-400 dark:text-gray-600 cursor-not-allowed"
            }
          `}
        >
          Następna
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
