import { useState, useEffect, useCallback } from "react";

const SIDEBAR_STORAGE_KEY = "sidebar-collapsed";

export interface UseSidebarReturn {
  isCollapsed: boolean;
  toggle: () => void;
}

/**
 * Hook do zarządzania stanem sidebar (zwijanie/rozwijanie)
 */
export function useSidebar(): UseSidebarReturn {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(SIDEBAR_STORAGE_KEY);
      return saved === "true";
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Update CSS variable for sidebar width
    document.documentElement.style.setProperty("--sidebar-width", isCollapsed ? "64px" : "256px");

    // Update main content margin
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
  }, [isCollapsed]);

  const toggle = useCallback(() => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    if (typeof window !== "undefined") {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, String(newState));
    }
  }, [isCollapsed]);

  return {
    isCollapsed,
    toggle,
  };
}
