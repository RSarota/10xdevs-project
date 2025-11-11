import { LayoutDashboard, Sparkles, Plus, BookOpen, User, ShieldAlert } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
  adminOnly?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    id: "generate",
    label: "Generuj",
    icon: Sparkles,
    path: "/generate-flashcards",
  },
  {
    id: "add",
    label: "Dodaj",
    icon: Plus,
    path: "/add-flashcard",
  },
  {
    id: "flashcards",
    label: "Moje fiszki",
    icon: BookOpen,
    path: "/my-flashcards",
  },
  {
    id: "profile",
    label: "Profil",
    icon: User,
    path: "/profile",
  },
];

export const ADMIN_NAV_ITEMS: NavItem[] = [
  {
    id: "admin",
    label: "Admin",
    icon: ShieldAlert,
    path: "/admin",
    adminOnly: true,
  },
];
