import { Title2 } from "@/components/apple-hig";
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

  // Organize actions by importance
  const primaryActions = actions.slice(0, 2);
  const secondaryActions = actions.slice(2);

  return (
    <div className="space-y-6">
      <Title2 className="text-[hsl(var(--apple-label))]">Szybkie akcje</Title2>

      {/* Primary Actions - Large Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {primaryActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.path}
              onClick={() => handleNavigate(action.path)}
              className="group relative p-5 rounded-xl border border-[hsl(var(--apple-separator))]/20 
                bg-gradient-to-br from-[hsl(var(--apple-blue)/0.05)] to-[hsl(var(--apple-purple)/0.05)]
                hover:from-[hsl(var(--apple-blue)/0.08)] hover:to-[hsl(var(--apple-purple)/0.08)]
                hover:border-[hsl(var(--apple-blue))]/30 hover:shadow-lg
                transition-all duration-300 text-left"
            >
              <div className="flex items-start space-x-4">
                <div
                  className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[hsl(var(--apple-blue))] to-[hsl(var(--apple-purple))]
                  flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-300"
                >
                  {Icon && <Icon className="w-6 h-6" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[hsl(var(--apple-label))] group-hover:text-[hsl(var(--apple-blue))] transition-colors">
                    {action.label}
                  </h3>
                  <p className="text-sm text-[hsl(var(--apple-label-secondary))] mt-1">
                    {getActionDescription(action.path)}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Secondary Actions - Compact Row */}
      {secondaryActions.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {secondaryActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.path}
                onClick={() => handleNavigate(action.path)}
                className="group flex items-center space-x-3 p-4 rounded-lg border border-[hsl(var(--apple-separator))]/15
                  bg-[hsl(var(--apple-fill))]/5 hover:bg-[hsl(var(--apple-fill))]/10
                  hover:border-[hsl(var(--apple-separator))]/25 hover:shadow-md
                  transition-all duration-300"
              >
                <div
                  className="flex-shrink-0 w-8 h-8 rounded-lg bg-[hsl(var(--apple-blue))]/10
                  flex items-center justify-center text-[hsl(var(--apple-blue))]
                  group-hover:bg-[hsl(var(--apple-blue))]/15 transition-colors"
                >
                  {Icon && <Icon className="w-4 h-4" />}
                </div>
                <span className="font-medium text-sm text-[hsl(var(--apple-label))] group-hover:text-[hsl(var(--apple-blue))] transition-colors truncate">
                  {action.label}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Helper function for action descriptions
function getActionDescription(path: string): string {
  const descriptions: Record<string, string> = {
    "/generate-flashcards": "Automatycznie twórz fiszki z AI",
    "/add-flashcard": "Dodaj nową fiszkę ręcznie",
    "/my-flashcards": "Przeglądaj swoją kolekcję",
    "/study": "Rozpocznij sesję nauki",
  };
  return descriptions[path] || "";
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
