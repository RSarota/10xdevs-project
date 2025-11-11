import { useState, useEffect } from "react";
import { getCurrentUser, type UserInfo } from "@/lib/services/userService";

export interface UseUserInfoReturn {
  userInfo: UserInfo | null;
  loading: boolean;
  refetch: () => Promise<void>;
}

/**
 * Hook do pobierania informacji o aktualnie zalogowanym użytkowniku
 */
export function useUserInfo(): UseUserInfoReturn {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserInfo = async () => {
    try {
      setLoading(true);
      const result = await getCurrentUser();
      if (result.success && result.data) {
        setUserInfo(result.data);
      }
    } catch {
      // Silently fail - user info is not critical for navigation
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  return {
    userInfo,
    loading,
    refetch: fetchUserInfo,
  };
}
