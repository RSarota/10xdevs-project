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
    <Button variant="filled" color="blue" size="large" onClick={onClick} className="w-full">
      {icon && <span className="mr-2">{icon}</span>}
      {label}
    </Button>
  );
}
