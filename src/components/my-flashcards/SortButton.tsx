import { Button } from "@/components/apple-hig";
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
    <Button variant={isActive ? "filled" : "default"} color="blue" size="small" onClick={onClick}>
      <ArrowUpDown className="w-4 h-4" />
      {label}
      {isActive && <span className="ml-1">{sortOrder === "desc" ? "↓" : "↑"}</span>}
    </Button>
  );
}
