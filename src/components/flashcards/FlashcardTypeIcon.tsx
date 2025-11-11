import { FileText, Sparkles, CheckCircle2 } from "lucide-react";
import type { FlashcardType } from "@/types";

interface FlashcardTypeIconProps {
  type: FlashcardType;
  className?: string;
}

export function FlashcardTypeIcon({ type, className = "w-4 h-4" }: FlashcardTypeIconProps) {
  switch (type) {
    case "manual":
      return <FileText className={className} />;
    case "ai-full":
      return <Sparkles className={className} />;
    case "ai-edited":
      return <CheckCircle2 className={className} />;
  }
}
