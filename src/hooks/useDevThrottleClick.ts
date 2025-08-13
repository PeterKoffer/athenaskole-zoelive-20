import { useRef } from "react";

export function useDevThrottleClick(ms = 600) {
  const last = useRef(0);
  // usage: const onClick = throttle(() => {...}, () => {...optional onThrottled...})
  return (fn: () => void, onThrottled?: () => void) => () => {
    const now = Date.now();
    if (now - last.current < ms) {
      // silent-ish dev note (no toast, no DB noise)
      console.info("[DEV] regenerate throttled");
      onThrottled?.();
      return;
    }
    last.current = now;
    fn();
  };
}
