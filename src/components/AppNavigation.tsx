import { useEffect, useState } from "react";
import { TabBar, TabBarItem, Sidebar, SidebarItem } from "./apple-hig";
import { Logo } from "./Logo";
import {
  LayoutDashboard,
  Sparkles,
  Plus,
  BookOpen,
  User,
  ShieldAlert,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Body, Footnote } from "./apple-hig";

// Navigation helper functions defined outside component
const navigateTo = (path: string) => {
  window.location.href = path;
};

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
  const [userInfo, setUserInfo] = useState<{ email: string; name: string } | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    // Load from localStorage if available
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sidebar-collapsed");
      return saved === "true";
    }
    return false;
  });

  useEffect(() => {
    setActivePath(currentPath);
  }, [currentPath]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch("/api/users/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserInfo({
            email: data.email || "",
            name: data.name || data.email?.split("@")[0] || "Użytkownik",
          });
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to fetch user info:", error);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleNavigate = (path: string) => {
    navigateTo(path);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Redirect to login after successful logout
        window.location.href = "/auth/login";
      } else {
        // Even if logout fails, redirect to login
        // The middleware will handle authentication check
        // eslint-disable-next-line no-console
        console.error("Logout failed:", await response.text());
        window.location.href = "/auth/login";
      }
    } catch (error) {
      // On error, still redirect to login
      // eslint-disable-next-line no-console
      console.error("Logout error:", error);
      window.location.href = "/auth/login";
    }
  };

  const handleToggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebar-collapsed", String(newState));
      // Update CSS variable for sidebar width
      document.documentElement.style.setProperty("--sidebar-width", newState ? "64px" : "256px");
    }
  };

  useEffect(() => {
    // Update CSS variable and main content margin on mount and when collapsed state changes
    if (typeof window !== "undefined") {
      document.documentElement.style.setProperty("--sidebar-width", isCollapsed ? "64px" : "256px");
      const mainContent = document.querySelector("main");
      if (mainContent) {
        if (isCollapsed) {
          mainContent.classList.remove("lg:ml-64");
          mainContent.classList.add("lg:ml-16");
        } else {
          mainContent.classList.remove("lg:ml-16");
          mainContent.classList.add("lg:ml-64");
        }
      }
    }
  }, [isCollapsed]);

  const allNavItems = isAdmin ? [...NAV_ITEMS, ...ADMIN_NAV_ITEMS] : NAV_ITEMS;

  return (
    <>
      {/* Mobile Navigation - Header with Logout */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[hsl(var(--apple-grouped-bg-secondary))]/80 backdrop-blur-[var(--apple-blur-amount)] border-b border-[hsl(var(--apple-separator-opaque))]">
        <div className="flex items-center justify-between px-[var(--apple-space-4)] py-[var(--apple-space-3)]">
          <button
            onClick={() => handleNavigate("/")}
            className="flex items-center gap-2 group hover:opacity-70 transition-opacity"
          >
            <Logo size={28} variant="default" />
            <h2 className="text-[var(--apple-font-title3)] font-[var(--apple-weight-bold)] text-[hsl(var(--apple-label))]">
              10xCards
            </h2>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-[var(--apple-space-3)] py-[var(--apple-space-2)] rounded-[var(--apple-radius-medium)] text-[hsl(var(--apple-label-secondary))] hover:bg-[hsl(var(--apple-fill))]/10 hover:text-[hsl(var(--apple-label))] transition-all duration-200 active:scale-95"
            title="Wyloguj się"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-[var(--apple-font-body)] font-[var(--apple-weight-medium)] hidden sm:inline">
              Wyloguj
            </span>
          </button>
        </div>
      </div>

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
      <div
        className={`hidden lg:block fixed left-0 top-0 bottom-0 z-30 ${isCollapsed ? "w-16" : "w-64"} transition-all duration-300`}
      >
        <Sidebar
          collapsed={isCollapsed}
          header={
            <div
              className={`${isCollapsed ? "px-[var(--apple-space-2)]" : "px-[var(--apple-space-4)]"} py-[var(--apple-space-5)]`}
            >
              <div
                className={`flex items-center ${isCollapsed ? "justify-center flex-col gap-2" : "justify-between"} mb-[var(--apple-space-4)]`}
              >
                <button
                  onClick={() => handleNavigate("/")}
                  className="flex items-center gap-2 group hover:opacity-70 transition-opacity"
                >
                  <Logo size={32} variant="default" />
                  {!isCollapsed && (
                    <h2 className="text-[var(--apple-font-title2)] font-[var(--apple-weight-bold)] text-[hsl(var(--apple-label))] group-hover:text-[hsl(var(--apple-blue))] transition-colors">
                      10xCards
                    </h2>
                  )}
                </button>
                {!isCollapsed && (
                  <button
                    onClick={handleToggleSidebar}
                    className="p-1.5 rounded-[var(--apple-radius-medium)] hover:bg-[hsl(var(--apple-fill))]/10 text-[hsl(var(--apple-label-secondary))] hover:text-[hsl(var(--apple-label))] transition-all duration-200"
                    title="Zwiń sidebar"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                )}
                {isCollapsed && (
                  <button
                    onClick={handleToggleSidebar}
                    className="p-1.5 rounded-[var(--apple-radius-medium)] hover:bg-[hsl(var(--apple-fill))]/10 text-[hsl(var(--apple-label-secondary))] hover:text-[hsl(var(--apple-label))] transition-all duration-200"
                    title="Rozwiń sidebar"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
              {/* User Info */}
              {!loadingUser && userInfo && !isCollapsed && (
                <div className="pt-[var(--apple-space-4)] border-t border-[hsl(var(--apple-separator-opaque))]">
                  <div className="flex items-center gap-[var(--apple-space-3)]">
                    <div className="w-10 h-10 rounded-full bg-[hsl(var(--apple-blue))]/10 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-[hsl(var(--apple-blue))]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Body className="text-[hsl(var(--apple-label))] font-[var(--apple-weight-medium)] truncate">
                        {userInfo.name}
                      </Body>
                      <Footnote className="text-[hsl(var(--apple-label-secondary))] truncate">
                        {userInfo.email}
                      </Footnote>
                    </div>
                  </div>
                </div>
              )}
              {!loadingUser && userInfo && isCollapsed && (
                <div className="pt-[var(--apple-space-4)] border-t border-[hsl(var(--apple-separator-opaque))] flex justify-center">
                  <div className="w-10 h-10 rounded-full bg-[hsl(var(--apple-blue))]/10 flex items-center justify-center flex-shrink-0 relative group">
                    <User className="w-5 h-5 text-[hsl(var(--apple-blue))]" />
                    <div className="absolute left-full ml-2 px-2 py-1.5 bg-[hsl(var(--apple-label))] dark:bg-[hsl(var(--apple-label))] text-[hsl(var(--apple-grouped-bg))] text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 shadow-lg">
                      <div className="font-[var(--apple-weight-semibold)]">{userInfo.name}</div>
                      <div className="text-[10px] opacity-90 mt-0.5">{userInfo.email}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          }
          footer={
            <div
              className={`${isCollapsed ? "px-[var(--apple-space-2)]" : "px-[var(--apple-space-4)]"} py-[var(--apple-space-2)]`}
            >
              <SidebarItem
                icon={<LogOut className="w-5 h-5" />}
                label="Wyloguj się"
                onClick={handleLogout}
                collapsed={isCollapsed}
              />
            </div>
          }
        >
          <div className="space-y-[var(--apple-space-1)]">
            {allNavItems.map((item) => (
              <SidebarItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                active={activePath === item.path}
                onClick={() => handleNavigate(item.path)}
                collapsed={isCollapsed}
              />
            ))}
          </div>
        </Sidebar>
      </div>
    </>
  );
}
