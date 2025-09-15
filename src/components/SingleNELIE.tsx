// src/components/SingleNELIE.tsx
import { useEffect, useRef } from "react";
import NELIE from "@/components/NELIE";

/**
 * Ensures we only mount one global NELIE.
 * Uses a body data-flag so HMR doesn’t duplicate.
 */
export default function SingleNELIE() {
  const mountedRef = useRef(false);

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;

    if (!document.body.dataset.nelieMounted) {
      document.body.dataset.nelieMounted = "true";
    }
  }, []);

  // If something else already mounted it, render nothing.
  if (document.body.dataset.nelieMounted === "true" && mountedRef.current) {
    return <NELIE />;
  }
  return null;
}
