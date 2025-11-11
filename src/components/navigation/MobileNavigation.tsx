import { LogOut } from "lucide-react";
import { Logo } from "../Logo";
import { logout } from "@/lib/services/authService";

interface MobileNavigationProps {
  onNavigate: (path: string) => void;
}

export function MobileNavigation({ onNavigate }: MobileNavigationProps) {
  const handleLogout = async () => {
    await logout();
    window.location.href = "/auth/login";
  };

  return (
    <>
      {/* Mobile Navigation - Header with Logout */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[hsl(var(--apple-grouped-bg-secondary))]/80 backdrop-blur-[var(--apple-blur-amount)] border-b border-[hsl(var(--apple-separator-opaque))]">
        <div className="flex items-center justify-between px-[var(--apple-space-4)] py-[var(--apple-space-3)]">
          <button
            onClick={() => onNavigate("/")}
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
    </>
  );
}
