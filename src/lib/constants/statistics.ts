import { FileText, Sparkles, CheckCircle2, Pencil, Target } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { UserStatisticsDTO } from "@/types";

export interface StatisticConfig {
  title: string;
  getValue: (stats: UserStatisticsDTO) => number | string;
  icon: LucideIcon;
}

export const FLASHCARD_STATISTICS: StatisticConfig[] = [
  {
    title: "Wszystkie fiszki",
    getValue: (stats) => stats.flashcards.total,
    icon: FileText,
  },
  {
    title: "Ręczne",
    getValue: (stats) => stats.flashcards.by_type.manual,
    icon: Pencil,
  },
  {
    title: "AI (pełne)",
    getValue: (stats) => stats.flashcards.by_type["ai-full"],
    icon: Sparkles,
  },
  {
    title: "AI (edytowane)",
    getValue: (stats) => stats.flashcards.by_type["ai-edited"],
    icon: CheckCircle2,
  },
];

export const GENERATION_STATISTICS: StatisticConfig[] = [
  {
    title: "Sesje generacji",
    getValue: (stats) => stats.generations.total_sessions,
    icon: Sparkles,
  },
  {
    title: "Wygenerowano",
    getValue: (stats) => stats.generations.total_generated,
    icon: FileText,
  },
  {
    title: "Zaakceptowano",
    getValue: (stats) => stats.generations.total_accepted,
    icon: CheckCircle2,
  },
  {
    title: "Wskaźnik akceptacji",
    getValue: (stats) => `${Math.round(stats.generations.acceptance_rate)}%`,
    icon: Target,
  },
  {
    title: "Wskaźnik edycji",
    getValue: (stats) => `${Math.round(stats.generations.edit_rate)}%`,
    icon: Pencil,
  },
];
