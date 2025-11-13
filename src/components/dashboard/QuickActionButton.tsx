import { Button } from "@/components/apple-hig";
import type { ReactNode } from "react";

export interface QuickActionButtonProps {
  label: string;
  path: string;
  icon?: ReactNode;
  onClick: () => void;
}

export function QuickActionButton({ label, icon, onClick }: QuickActionButtonProps) {
  return (
    <Button
      variant="filled"
      color="blue"
      size="large"
      onClick={onClick}
      className="w-full group relative overflow-hidden hover:shadow-md transition-all duration-300"
    >
      {/* Very subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative flex items-center justify-center gap-2">
        {icon && <span className="transition-transform duration-300">{icon}</span>}
        <span className="font-medium">{label}</span>
      </div>
    </Button>
  );
}
