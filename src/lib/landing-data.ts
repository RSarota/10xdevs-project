import type { LucideIcon } from "lucide-react";
import { Sparkles, Brain, Zap, BookOpen, Target, TrendingUp } from "lucide-react";

export interface LandingFeature {
  icon: LucideIcon;
  title: string;
  description: string;
  badge: string;
}

export interface LandingStat {
  value: string;
  label: string;
}

export interface LandingStep {
  icon: LucideIcon;
  title: string;
  description: string;
  color: "blue" | "green" | "purple";
}

export const LANDING_FEATURES: LandingFeature[] = [
  {
    icon: Sparkles,
    title: "Generowanie AI",
    description: "Wklej tekst, a sztuczna inteligencja automatycznie wygeneruje fiszki do nauki",
    badge: "AI",
  },
  {
    icon: Brain,
    title: "Inteligentna nauka",
    description: "System dostosowuje się do Twojego postępu i skupia na trudniejszych materiałach",
    badge: "Smart",
  },
  {
    icon: Zap,
    title: "Szybkie tworzenie",
    description: "Dodawaj fiszki ręcznie lub generuj dziesiątki w kilka sekund",
    badge: "Fast",
  },
];

export const LANDING_STATS: LandingStat[] = [
  { value: "10,000+", label: "Fiszek wygenerowanych" },
  { value: "75%", label: "Fiszek zaakceptowanych z AI" },
  { value: "< 30s", label: "Średni czas generacji" },
];

export const LANDING_STEPS: LandingStep[] = [
  {
    icon: BookOpen,
    title: "1. Wklej tekst",
    description: "Skopiuj materiał do nauki - notatkę, artykuł lub fragment książki",
    color: "blue",
  },
  {
    icon: Target,
    title: "2. Przejrzyj fiszki",
    description: "AI wygeneruje fiszki - akceptuj, edytuj lub odrzuć każdą z nich",
    color: "green",
  },
  {
    icon: TrendingUp,
    title: "3. Rozpocznij naukę",
    description: "Ucz się w swoim tempie i śledź postępy w czasie rzeczywistym",
    color: "purple",
  },
];
