import { useEffect, useState } from "react";
import NELIE from "@/components/NELIE";

/**
 * Mount exactly one global NELIE instance.
 * Uses a body data-flag to prevent duplicate mounts across routes/HMR.
 */
export default function SingleNELIE() {
  const [canRender, setCanRender] = useState(false);

  useEffect(() => {
    // If someone already mounted NELIE, don't render this instance
    if (document.body.dataset.nelieMounted === "true") {
      setCanRender(false);
      return;
    }
    // Claim the singleton and render
    document.body.dataset.nelieMounted = "true";
    setCanRender(true);

    // Optional cleanup if this component ever unmounts
    return () => {
      // Only clear if it's still ours (simple heuristic)
      if (document.body.dataset.nelieMounted === "true") {
        delete document.body.dataset.nelieMounted;
      }
    };
  }, []);

  return canRender ? <NELIE /> : null;
}
