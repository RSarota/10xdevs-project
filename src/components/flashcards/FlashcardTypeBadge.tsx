import { Badge } from "@/components/apple-hig";
import type { FlashcardType } from "@/types";

interface FlashcardTypeBadgeProps {
  type: FlashcardType;
}

const TYPE_CONFIG = {
  manual: { color: "gray" as const, label: "Ręczne" },
  "ai-full": { color: "blue" as const, label: "AI" },
  "ai-edited": { color: "green" as const, label: "AI (edytowane)" },
} as const;

export function FlashcardTypeBadge({ type }: FlashcardTypeBadgeProps) {
  const config = TYPE_CONFIG[type];
  return (
    <Badge color={config.color} variant="filled" size="sm">
      {config.label}
    </Badge>
  );
}
