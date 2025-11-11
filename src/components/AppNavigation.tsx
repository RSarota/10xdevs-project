import { useNavigation } from "@/hooks/useNavigation";
import { useSidebar } from "@/hooks/useSidebar";
import { useUserInfo } from "@/hooks/useUserInfo";
import { logout } from "@/lib/services/authService";
import { MobileNavigation } from "./navigation/MobileNavigation";
import { MobileTabBar } from "./navigation/MobileTabBar";
import { DesktopSidebar } from "./navigation/DesktopSidebar";

interface AppNavigationProps {
  currentPath?: string;
  isAdmin?: boolean;
}

export default function AppNavigation({ currentPath = "/dashboard", isAdmin = false }: AppNavigationProps) {
  const { activePath, navigate } = useNavigation(currentPath);
  const { isCollapsed, toggle } = useSidebar();
  const { userInfo, loading: loadingUser } = useUserInfo();

  const handleLogout = async () => {
    await logout();
    window.location.href = "/auth/login";
  };

  return (
    <>
      <MobileNavigation onNavigate={navigate} />
      <MobileTabBar activePath={activePath} onNavigate={navigate} />
      <DesktopSidebar
        isCollapsed={isCollapsed}
        onToggle={toggle}
        activePath={activePath}
        onNavigate={navigate}
        onLogout={handleLogout}
        userInfo={userInfo}
        loadingUser={loadingUser}
        isAdmin={isAdmin}
      />
    </>
  );
}
