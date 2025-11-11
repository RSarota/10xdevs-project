import { useState, useEffect } from "react";

export interface UseFormReadyReturn {
  isReady: boolean;
}

export function useFormReady(): UseFormReadyReturn {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  return { isReady };
}
