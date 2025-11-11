import { useState, useEffect, useCallback } from "react";

/**
 * Navigation helper function
 */
const navigateTo = (path: string) => {
  window.location.href = path;
};

export interface UseNavigationReturn {
  activePath: string;
  navigate: (path: string) => void;
}

/**
 * Hook do zarządzania nawigacją
 */
export function useNavigation(initialPath = "/dashboard"): UseNavigationReturn {
  const [activePath, setActivePath] = useState(initialPath);

  useEffect(() => {
    setActivePath(initialPath);
  }, [initialPath]);

  const navigate = useCallback((path: string) => {
    navigateTo(path);
  }, []);

  return {
    activePath,
    navigate,
  };
}
