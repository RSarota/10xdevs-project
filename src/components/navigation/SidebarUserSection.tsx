import { User, LogOut } from "lucide-react";
import { Body, Footnote } from "../apple-hig";
import type { UserInfo } from "@/lib/services/userService";

interface SidebarUserSectionProps {
  isCollapsed: boolean;
  userInfo: UserInfo | null;
  loadingUser: boolean;
  onLogout: () => void;
}

export function SidebarUserSection({ isCollapsed, userInfo, loadingUser, onLogout }: SidebarUserSectionProps) {
  if (loadingUser || !userInfo) {
    return null;
  }

  if (isCollapsed) {
    return (
      <div className="px-[var(--apple-space-2)] py-[var(--apple-space-4)] space-y-3">
        {/* User Avatar */}
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[hsl(var(--apple-blue)/0.1)] to-[hsl(var(--apple-purple)/0.1)] flex items-center justify-center relative group">
            <User className="w-6 h-6 text-[hsl(var(--apple-blue))]" />
            {/* Tooltip on hover */}
            <div className="absolute left-full ml-3 px-3 py-2 bg-[hsl(var(--apple-label))] text-[hsl(var(--apple-grouped-bg))] text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 shadow-xl">
              <div className="font-[var(--apple-weight-semibold)]">{userInfo.name}</div>
              <div className="text-[10px] opacity-90 mt-0.5">{userInfo.email}</div>
            </div>
          </div>
        </div>
        
        {/* Logout Button */}
        <div className="flex justify-center">
          <button
            onClick={onLogout}
            className="p-3 rounded-[var(--apple-radius-large)] hover:bg-[hsl(var(--apple-fill))]/10 text-[hsl(var(--apple-label-tertiary))] hover:text-[hsl(var(--apple-red))] transition-all duration-200 group relative"
            title="Wyloguj się"
          >
            <LogOut className="w-5 h-5 group-hover:scale-95 transition-transform" />
            {/* Tooltip */}
            <div className="absolute left-full ml-3 px-2 py-1 bg-[hsl(var(--apple-label))] text-[hsl(var(--apple-grouped-bg))] text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 shadow-lg">
              Wyloguj się
            </div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-[var(--apple-space-4)] py-[var(--apple-space-4)]">
      {/* User Info Card */}
      <div className="bg-gradient-to-r from-[hsl(var(--apple-grouped-bg-secondary))] to-[hsl(var(--apple-grouped-bg-tertiary))] rounded-[var(--apple-radius-large)] p-4 mb-3 border border-[hsl(var(--apple-separator-opaque))]/50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[hsl(var(--apple-blue)/0.1)] to-[hsl(var(--apple-purple)/0.1)] flex items-center justify-center flex-shrink-0">
            <User className="w-6 h-6 text-[hsl(var(--apple-blue))]" />
          </div>
          <div className="flex-1 min-w-0">
            <Body className="text-[hsl(var(--apple-label))] font-[var(--apple-weight-semibold)] truncate mb-1">
              {userInfo.name}
            </Body>
            <Footnote className="text-[hsl(var(--apple-label-secondary))] truncate">
              {userInfo.email}
            </Footnote>
          </div>
        </div>
      </div>
      
      {/* Logout Button */}
      <button
        onClick={onLogout}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-[var(--apple-radius-large)] hover:bg-[hsl(var(--apple-fill))]/10 text-[hsl(var(--apple-label-secondary))] hover:text-[hsl(var(--apple-red))] transition-all duration-200 group"
      >
        <LogOut className="w-5 h-5 group-hover:scale-95 transition-transform" />
        <span className="font-[var(--apple-weight-medium)]">Wyloguj się</span>
      </button>
    </div>
  );
}