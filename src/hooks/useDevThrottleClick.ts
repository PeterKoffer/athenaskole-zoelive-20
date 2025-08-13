import { useCallback, useRef } from "react";

export function useDevThrottleClick(delay = 500) {
  const last = useRef(0);
  return useCallback(<T extends any[]>(fn: (...args: T) => void | Promise<void>) => {
    return (...args: T) => {
      const now = Date.now();
      if (now - last.current < delay) return;
      last.current = now;
      void fn(...args);
    };
  }, [delay]);
}
