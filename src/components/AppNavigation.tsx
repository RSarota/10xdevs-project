import { useEffect, useState } from "react";
import { TabBar, TabBarItem, Sidebar, SidebarItem } from "./apple-hig";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { LayoutDashboard, Sparkles, Plus, BookOpen, User, ShieldAlert, LogOut } from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  adminOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
    path: "/dashboard",
  },
  {
    id: "generate",
    label: "Generuj",
    icon: <Sparkles className="w-5 h-5" />,
    path: "/generate-flashcards",
  },
  {
    id: "add",
    label: "Dodaj",
    icon: <Plus className="w-5 h-5" />,
    path: "/add-flashcard",
  },
  {
    id: "flashcards",
    label: "Moje fiszki",
    icon: <BookOpen className="w-5 h-5" />,
    path: "/my-flashcards",
  },
  {
    id: "profile",
    label: "Profil",
    icon: <User className="w-5 h-5" />,
    path: "/profile",
  },
];

const ADMIN_NAV_ITEMS: NavItem[] = [
  {
    id: "admin",
    label: "Admin",
    icon: <ShieldAlert className="w-5 h-5" />,
    path: "/admin",
    adminOnly: true,
  },
];

interface AppNavigationProps {
  currentPath?: string;
  isAdmin?: boolean;
}

export default function AppNavigation({ currentPath = "/dashboard", isAdmin = false }: AppNavigationProps) {
  const [activePath, setActivePath] = useState(currentPath);

  useEffect(() => {
    setActivePath(currentPath);
  }, [currentPath]);

  const handleNavigate = (path: string) => {
    window.location.href = path;
  };

  const handleLogout = () => {
    // TODO: Implement logout logic
    window.location.href = "/login";
  };

  const allNavItems = isAdmin ? [...NAV_ITEMS, ...ADMIN_NAV_ITEMS] : NAV_ITEMS;

  return (
    <>
      {/* Mobile Navigation - TabBar */}
      <div className="lg:hidden">
        <TabBar blur>
          {NAV_ITEMS.slice(0, 5).map((item) => (
            <TabBarItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={activePath === item.path}
              onClick={() => handleNavigate(item.path)}
            />
          ))}
        </TabBar>
      </div>

      {/* Desktop Navigation - Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          header={
            <div className="px-[var(--apple-space-4)] py-[var(--apple-space-5)] border-b border-[hsl(var(--apple-separator-opaque))]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Logo size={32} variant="default" />
                  <h2 className="text-[var(--apple-font-title2)] font-[var(--apple-weight-bold)] text-[hsl(var(--apple-label))]">
                    10xCards
                  </h2>
                </div>
                <ThemeToggle />
              </div>
            </div>
          }
          footer={
            <div className="border-t border-[hsl(var(--apple-separator-opaque))] pt-[var(--apple-space-3)]">
              <SidebarItem icon={<LogOut className="w-5 h-5" />} label="Wyloguj się" onClick={handleLogout} />
            </div>
          }
        >
          <div className="space-y-[var(--apple-space-1)] px-[var(--apple-space-3)] py-[var(--apple-space-4)]">
            {allNavItems.map((item) => (
              <SidebarItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                active={activePath === item.path}
                onClick={() => handleNavigate(item.path)}
              />
            ))}
          </div>
        </Sidebar>
      </div>
    </>
  );
}
