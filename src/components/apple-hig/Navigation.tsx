import React from "react";

/**
 * Tab Bar Item
 */
export interface TabBarItemProps {
  icon: React.ReactNode;
  label: string;
  badge?: string | number;
  active?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

export const TabBarItem: React.FC<TabBarItemProps> = ({
  icon,
  label,
  badge,
  active = false,
  onClick,
  disabled = false,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex-1 flex flex-col items-center justify-center gap-1
        min-h-[var(--apple-touch-target)]
        py-[var(--apple-space-2)]
        transition-all duration-200
        ${active ? "text-[hsl(var(--apple-blue))]" : "text-[hsl(var(--apple-label-secondary))]"}
        ${disabled ? "opacity-40 cursor-not-allowed" : "active:scale-95"}
        ${!active && !disabled ? "hover:text-[hsl(var(--apple-label))]" : ""}
      `
        .trim()
        .replace(/\s+/g, " ")}
      role="tab"
      aria-selected={active}
    >
      <div className="relative">
        <div className={`w-6 h-6 ${active ? "scale-110" : "scale-100"} transition-transform`}>{icon}</div>
        {badge && (
          <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 flex items-center justify-center text-[10px] font-[var(--apple-weight-semibold)] text-white bg-[hsl(var(--apple-red))] rounded-full">
            {badge}
          </span>
        )}
      </div>
      <span
        className={`text-[10px] font-[var(--apple-weight-medium)] transition-all ${active ? "scale-100" : "scale-95"}`}
      >
        {label}
      </span>
    </button>
  );
};

TabBarItem.displayName = "AppleTabBarItem";

/**
 * Tab Bar - iOS-style bottom navigation
 * Maximum 5 items recommended
 */
export interface TabBarProps {
  children: React.ReactNode;
  blur?: boolean;
  className?: string;
}

export const TabBar: React.FC<TabBarProps> = ({ children, blur = true, className = "" }) => {
  return (
    <nav
      className={`
        fixed bottom-0 left-0 right-0
        flex items-center
        ${blur ? "bg-[hsl(var(--apple-grouped-bg-secondary))]/80 backdrop-blur-[var(--apple-blur-amount)]" : "bg-[hsl(var(--apple-grouped-bg-secondary))]"}
        border-t border-[hsl(var(--apple-separator-opaque))]
        safe-area-inset-bottom
        z-40
        ${className}
      `
        .trim()
        .replace(/\s+/g, " ")}
    >
      {children}
    </nav>
  );
};

TabBar.displayName = "AppleTabBar";

/**
 * Navigation Bar - Top navigation with title and actions
 */
export interface NavigationBarProps {
  title?: string | React.ReactNode;
  subtitle?: string;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
  blur?: boolean;
  shadow?: boolean;
  large?: boolean;
  className?: string;
  onTitleClick?: () => void;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({
  title,
  subtitle,
  leftAction,
  rightAction,
  blur = true,
  shadow = true,
  large = false,
  className = "",
  onTitleClick,
}) => {
  return (
    <header
      className={`
        sticky top-0 left-0 right-0
        ${blur ? "bg-[hsl(var(--apple-grouped-bg-secondary))]/80 backdrop-blur-[var(--apple-blur-amount)]" : "bg-[hsl(var(--apple-grouped-bg-secondary))]"}
        border-b border-[hsl(var(--apple-separator-opaque))]
        ${shadow ? "shadow-[var(--apple-shadow-sm)]" : ""}
        z-40
        transition-all duration-300
        ${className}
      `
        .trim()
        .replace(/\s+/g, " ")}
    >
      <div
        className={`flex items-center justify-between px-[var(--apple-space-5)] ${large ? "py-[var(--apple-space-6)]" : "py-[var(--apple-space-4)]"}`}
      >
        {/* Left action */}
        <div className="flex-shrink-0 min-w-[60px]">{leftAction}</div>

        {/* Title */}
        <div className="flex-1 flex flex-col items-center text-center min-w-0 px-[var(--apple-space-4)]">
          {title && (
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
            <h1
              onClick={onTitleClick}
              onKeyDown={(e) => {
                if (onTitleClick && (e.key === "Enter" || e.key === " ")) {
                  e.preventDefault();
                  onTitleClick();
                }
              }}
              tabIndex={onTitleClick ? 0 : undefined}
              role={onTitleClick ? "button" : undefined}
              className={`
              ${large ? "text-[var(--apple-font-large-title)]" : "text-[var(--apple-font-headline)]"}
              font-[var(--apple-weight-bold)]
              text-[hsl(var(--apple-label))]
              truncate max-w-full
              ${onTitleClick ? "cursor-pointer hover:opacity-70 transition-opacity focus:outline-none focus:ring-2 focus:ring-[hsl(var(--apple-blue))] focus:ring-offset-2 rounded" : ""}
            `
                .trim()
                .replace(/\s+/g, " ")}
            >
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-[var(--apple-font-footnote)] text-[hsl(var(--apple-label-secondary))] truncate max-w-full">
              {subtitle}
            </p>
          )}
        </div>

        {/* Right action */}
        <div className="flex-shrink-0 min-w-[60px] flex justify-end">{rightAction}</div>
      </div>
    </header>
  );
};

NavigationBar.displayName = "AppleNavigationBar";

/**
 * Navigation Back Button
 */
export interface BackButtonProps {
  label?: string;
  onClick: () => void;
  className?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ label = "Wstecz", onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-1
        text-[var(--apple-font-body)]
        text-[hsl(var(--apple-blue))]
        hover:opacity-70
        active:opacity-50
        transition-opacity
        -ml-2
        ${className}
      `
        .trim()
        .replace(/\s+/g, " ")}
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      <span>{label}</span>
    </button>
  );
};

BackButton.displayName = "AppleBackButton";

/**
 * Sidebar Navigation - macOS/iPadOS style
 */
export interface SidebarItemProps {
  icon?: React.ReactNode;
  label: string;
  badge?: string | number;
  active?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
  collapsed?: boolean;
  title?: string;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  badge,
  active = false,
  onClick,
  children,
  collapsible = false,
  defaultOpen = false,
  collapsed = false,
  title,
}) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  const handleClick = () => {
    if (collapsible) {
      setIsOpen(!isOpen);
    }
    onClick?.();
  };

  return (
    <div>
      <button
        onClick={handleClick}
        title={title || label}
        className={`
          w-full flex items-center 
          ${collapsed ? "justify-center px-0" : "gap-[var(--apple-space-3)] px-[var(--apple-space-4)]"}
          py-[var(--apple-space-3)]
          rounded-[var(--apple-radius-medium)]
          text-[var(--apple-font-body)]
          transition-all duration-200
          ${collapsed ? "relative group" : ""}
          ${
            active
              ? "bg-[hsl(var(--apple-fill))]/20 text-[hsl(var(--apple-label))] font-[var(--apple-weight-semibold)]"
              : "text-[hsl(var(--apple-label-secondary))] hover:bg-[hsl(var(--apple-fill))]/10 hover:text-[hsl(var(--apple-label))]"
          }
        `
          .trim()
          .replace(/\s+/g, " ")}
      >
        {icon && <div className="flex-shrink-0 w-5 h-5">{icon}</div>}
        {!collapsed && (
          <>
            <span className="flex-1 text-left truncate">{label}</span>
            {badge && (
              <span className="flex-shrink-0 min-w-[20px] h-5 px-1.5 flex items-center justify-center text-[11px] font-[var(--apple-weight-semibold)] text-[hsl(var(--apple-label-secondary))] bg-[hsl(var(--apple-fill))]/20 rounded-full">
                {badge}
              </span>
            )}
            {collapsible && (
              <svg
                className={`flex-shrink-0 w-4 h-4 transition-transform ${isOpen ? "rotate-90" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </>
        )}
        {collapsed && badge && (
          <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 flex items-center justify-center text-[10px] font-[var(--apple-weight-semibold)] text-white bg-[hsl(var(--apple-red))] rounded-full">
            {badge}
          </span>
        )}
        {collapsed && (
          <div className="absolute left-full ml-2 px-2 py-1.5 bg-[hsl(var(--apple-label))] dark:bg-[hsl(var(--apple-label))] text-[hsl(var(--apple-grouped-bg))] text-xs font-[var(--apple-weight-medium)] rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 shadow-lg">
            {label}
          </div>
        )}
      </button>

      {collapsible && isOpen && children && !collapsed && (
        <div className="ml-[var(--apple-space-7)] mt-[var(--apple-space-2)] space-y-[var(--apple-space-1)]">
          {children}
        </div>
      )}
    </div>
  );
};

SidebarItem.displayName = "AppleSidebarItem";

/**
 * Sidebar Container
 */
export interface SidebarProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  collapsed?: boolean;
  onToggle?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ children, header, footer, className = "", collapsed = false }) => {
  return (
    <aside
      className={`
        flex flex-col
        ${collapsed ? "w-16" : "w-64"}
        h-screen
        bg-gradient-to-b from-[hsl(var(--apple-grouped-bg-secondary))] to-[hsl(var(--apple-grouped-bg-tertiary))]
        border-r border-[hsl(var(--apple-separator-opaque))]
        transition-all duration-300 ease-in-out
        backdrop-blur-xl backdrop-saturate-200
        ${className}
      `
        .trim()
        .replace(/\s+/g, " ")}
    >
      {header && <div className="flex-shrink-0 border-b border-[hsl(var(--apple-separator-opaque))]">{header}</div>}

      <nav
        className={`
        flex-1 overflow-y-auto overflow-x-hidden
        ${collapsed ? "px-[var(--apple-space-2)]" : "px-[var(--apple-space-4)]"}
        py-[var(--apple-space-6)] 
        space-y-[var(--apple-space-2)]
        transition-all duration-300
        relative
      `}
      >
        {/* Subtle background pattern for navigation area */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(var(--apple-grouped-bg-secondary))]/30 to-transparent pointer-events-none" />
        <div className="relative">{children}</div>
      </nav>

      {footer && <div className="flex-shrink-0 border-t border-[hsl(var(--apple-separator-opaque))]">{footer}</div>}
    </aside>
  );
};

Sidebar.displayName = "AppleSidebar";
