import { Stack, Title2, Grid } from "@/components/apple-hig";
import { QuickActionButton } from "./QuickActionButton";
import { Sparkles, Plus, BookOpen, PlayCircle } from "lucide-react";
import type { ReactNode } from "react";

export interface QuickAction {
  label: string;
  path: string;
  icon?: ReactNode;
}

export interface QuickActionsPanelProps {
  actions: QuickAction[];
}

export function QuickActionsPanel({ actions }: QuickActionsPanelProps) {
  const handleNavigate = (path: string) => {
    window.location.href = path;
  };

  return (
    <Stack direction="vertical" spacing="md">
      <Title2>Szybkie akcje</Title2>
      <Grid columns={2} gap="md" className="sm:grid-cols-4">
        {actions.map((action) => (
          <QuickActionButton
            key={action.path}
            label={action.label}
            path={action.path}
            icon={action.icon}
            onClick={() => handleNavigate(action.path)}
          />
        ))}
      </Grid>
    </Stack>
  );
}

// Default quick actions
export const DEFAULT_QUICK_ACTIONS: QuickAction[] = [
  {
    label: "Generuj fiszki",
    path: "/generate-flashcards",
    icon: <Sparkles className="w-5 h-5" />,
  },
  {
    label: "Dodaj fiszkę",
    path: "/add-flashcard",
    icon: <Plus className="w-5 h-5" />,
  },
  {
    label: "Moje fiszki",
    path: "/my-flashcards",
    icon: <BookOpen className="w-5 h-5" />,
  },
  {
    label: "Rozpocznij naukę",
    path: "/session",
    icon: <PlayCircle className="w-5 h-5" />,
  },
];
