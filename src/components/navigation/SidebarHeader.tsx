import { ChevronLeft, ChevronRight, User } from "lucide-react";
import { Logo } from "../Logo";
import { Body, Footnote } from "../apple-hig";
import type { UserInfo } from "@/lib/services/userService";

interface SidebarHeaderProps {
  isCollapsed: boolean;
  onToggle: () => void;
  onNavigate: (path: string) => void;
  userInfo: UserInfo | null;
  loadingUser: boolean;
}

export function SidebarHeader({ isCollapsed, onToggle, onNavigate, userInfo, loadingUser }: SidebarHeaderProps) {
  return (
    <div
      className={`${isCollapsed ? "px-[var(--apple-space-2)]" : "px-[var(--apple-space-4)]"} py-[var(--apple-space-5)]`}
    >
      <div
        className={`flex items-center ${isCollapsed ? "justify-center flex-col gap-2" : "justify-between"} mb-[var(--apple-space-4)]`}
      >
        <button
          onClick={() => onNavigate("/")}
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
            onClick={onToggle}
            className="p-1.5 rounded-[var(--apple-radius-medium)] hover:bg-[hsl(var(--apple-fill))]/10 text-[hsl(var(--apple-label-secondary))] hover:text-[hsl(var(--apple-label))] transition-all duration-200"
            title="Zwiń sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
        {isCollapsed && (
          <button
            onClick={onToggle}
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
              <Footnote className="text-[hsl(var(--apple-label-secondary))] truncate">{userInfo.email}</Footnote>
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
  );
}
