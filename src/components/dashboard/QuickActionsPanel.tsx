import { Stack, Title2, Grid } from "@/components/apple-hig";
import { QuickActionButton } from "./QuickActionButton";
import { Sparkles, Plus, BookOpen, PlayCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Navigation helper function defined outside component
const navigateTo = (path: string) => {
  window.location.href = path;
};

export interface QuickAction {
  label: string;
  path: string;
  icon?: LucideIcon;
}

export interface QuickActionsPanelProps {
  actions: QuickAction[];
}

export function QuickActionsPanel({ actions }: QuickActionsPanelProps) {
  const handleNavigate = (path: string) => {
    navigateTo(path);
  };

  return (
    <Stack direction="vertical" spacing="md">
      <Title2>Szybkie akcje</Title2>
      <Grid columns={2} gap="md" className="sm:grid-cols-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <QuickActionButton
              key={action.path}
              label={action.label}
              path={action.path}
              icon={Icon ? <Icon className="w-5 h-5" /> : undefined}
              onClick={() => handleNavigate(action.path)}
            />
          );
        })}
      </Grid>
    </Stack>
  );
}

// Default quick actions
export const DEFAULT_QUICK_ACTIONS: QuickAction[] = [
  {
    label: "Generuj fiszki",
    path: "/generate-flashcards",
    icon: Sparkles,
  },
  {
    label: "Dodaj fiszkę",
    path: "/add-flashcard",
    icon: Plus,
  },
  {
    label: "Moje fiszki",
    path: "/my-flashcards",
    icon: BookOpen,
  },
  {
    label: "Rozpocznij naukę",
    path: "/study",
    icon: PlayCircle,
  },
];
