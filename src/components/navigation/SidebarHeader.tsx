import { ChevronLeft, ChevronRight } from "lucide-react";
import { Logo } from "../Logo";
import type { UserInfo } from "@/lib/services/userService";

interface SidebarHeaderProps {
  isCollapsed: boolean;
  onToggle: () => void;
  onNavigate: (path: string) => void;
  userInfo: UserInfo | null;
  loadingUser: boolean;
}

export function SidebarHeader({
  isCollapsed,
  onToggle,
  onNavigate,
}: Omit<SidebarHeaderProps, "userInfo" | "loadingUser">) {
  return (
    <div
      className={`${isCollapsed ? "px-[var(--apple-space-2)]" : "px-[var(--apple-space-4)]"} py-[var(--apple-space-6)]`}
    >
      {/* Brand Section - Clean and focused */}
      <div className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}>
        <button
          onClick={() => onNavigate("/dashboard")}
          className="flex items-center gap-3 group hover:opacity-80 transition-opacity flex-shrink min-w-0"
        >
          <Logo size={40} variant="gradient" />
          {!isCollapsed && (
            <span className="text-[1.75rem] font-[var(--apple-weight-bold)] bg-gradient-to-r from-[hsl(var(--apple-blue))] to-[hsl(var(--apple-purple))] bg-clip-text text-transparent transition-all duration-300 leading-none truncate">
              10xCards
            </span>
          )}
        </button>
        
        {/* Toggle Button - in same row but separated */}
        {!isCollapsed && (
          <div className="flex-shrink-0">
            <button
              onClick={onToggle}
              className="flex items-center justify-center w-8 h-8 rounded-[var(--apple-radius-medium)] 
                bg-[hsl(var(--apple-fill))]/8 hover:bg-[hsl(var(--apple-fill))]/15 
                text-[hsl(var(--apple-label-quaternary))] hover:text-[hsl(var(--apple-label-secondary))]
                border border-[hsl(var(--apple-separator))]/15 hover:border-[hsl(var(--apple-separator))]/30
                transition-all duration-200 group backdrop-blur-sm shadow-sm hover:shadow-md"
              title="Zwiń sidebar"
            >
              <ChevronLeft className="w-3.5 h-3.5 group-hover:translate-x-[-1px] transition-transform duration-200" />
            </button>
          </div>
        )}
      </div>
      
      {/* Expand button for collapsed state */}
      {isCollapsed && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={onToggle}
            className="flex items-center justify-center w-8 h-8 rounded-[var(--apple-radius-medium)] 
              bg-[hsl(var(--apple-fill))]/8 hover:bg-[hsl(var(--apple-fill))]/15 
              text-[hsl(var(--apple-label-quaternary))] hover:text-[hsl(var(--apple-label-secondary))]
              border border-[hsl(var(--apple-separator))]/15 hover:border-[hsl(var(--apple-separator))]/30
              transition-all duration-200 group backdrop-blur-sm shadow-sm hover:shadow-md"
            title="Rozwiń sidebar"
          >
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-[1px] transition-transform duration-200" />
          </button>
        </div>
      )}
    </div>
  );
}
