
import { useEffect, useState } from "react";

/**
 * Hook to track image loading state.
 */
export function useImageLoaded(imageUrl?: string) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!imageUrl) {
      setLoaded(false);
      return;
    }
    setLoaded(false);
    const img = new window.Image();
    img.src = imageUrl;
    img.onload = () => setLoaded(true);
    img.onerror = () => setLoaded(true); // Fallback: treat errored as "loaded" to avoid stuck loader
    // Clean up
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [imageUrl]);

  return loaded;
}
