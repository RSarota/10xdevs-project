import { Sidebar, SidebarItem } from "../apple-hig";
import { NAV_ITEMS, ADMIN_NAV_ITEMS, type NavItem } from "@/lib/constants/navigation";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarUserSection } from "./SidebarUserSection";
import type { UserInfo } from "@/lib/services/userService";

interface DesktopSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  activePath: string;
  onNavigate: (path: string) => void;
  onLogout: () => void;
  userInfo: UserInfo | null;
  loadingUser: boolean;
  isAdmin?: boolean;
}

export function DesktopSidebar({
  isCollapsed,
  onToggle,
  activePath,
  onNavigate,
  onLogout,
  userInfo,
  loadingUser,
  isAdmin = false,
}: DesktopSidebarProps) {
  const allNavItems: NavItem[] = isAdmin ? [...NAV_ITEMS, ...ADMIN_NAV_ITEMS] : NAV_ITEMS;

  return (
    <div
      className={`hidden lg:block fixed left-0 top-0 bottom-0 z-30 ${isCollapsed ? "w-16" : "w-64"} transition-all duration-300`}
    >
      <Sidebar
        collapsed={isCollapsed}
        header={<SidebarHeader isCollapsed={isCollapsed} onToggle={onToggle} onNavigate={onNavigate} />}
        footer={
          <SidebarUserSection
            isCollapsed={isCollapsed}
            userInfo={userInfo}
            loadingUser={loadingUser}
            onLogout={onLogout}
          />
        }
      >
        <div className="space-y-[var(--apple-space-1)]">
          {allNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <SidebarItem
                key={item.id}
                icon={<Icon className="w-5 h-5" />}
                label={item.label}
                active={activePath === item.path}
                onClick={() => onNavigate(item.path)}
                collapsed={isCollapsed}
              />
            );
          })}
        </div>
      </Sidebar>
    </div>
  );
}
