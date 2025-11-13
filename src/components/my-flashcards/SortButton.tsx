import { ArrowUpDown } from "lucide-react";

interface SortButtonProps {
  label: string;
  field: "created_at" | "updated_at";
  activeField: "created_at" | "updated_at";
  sortOrder: "asc" | "desc";
  onClick: () => void;
}

export function SortButton({ label, field, activeField, sortOrder, onClick }: SortButtonProps) {
  const isActive = activeField === field;

  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200
        ${
          isActive
            ? "bg-blue-500 dark:bg-blue-600 text-white shadow-md"
            : "bg-gray-100/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-100"
        }
      `}
    >
      <ArrowUpDown className="w-4 h-4" />
      {label}
      {isActive && <span className="ml-1">{sortOrder === "desc" ? "↓" : "↑"}</span>}
    </button>
  );
}
