
import { useEffect, useState } from "react";

/**
 * Enhanced hook to track image loading state with caching and optimization.
 */
export function useOptimizedImageLoaded(imageUrl?: string) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!imageUrl) {
      setLoaded(false);
      return;
    }

    // Check if image is already cached
    const img = new window.Image();
    
    // If image is already complete (cached), set loaded immediately
    if (img.complete && img.naturalWidth > 0) {
      setLoaded(true);
      return;
    }
    
    setLoaded(false);
    
    img.src = imageUrl;
    
    const handleLoad = () => {
      setLoaded(true);
    };
    
    const handleError = () => {
      console.warn(`Failed to load classroom image: ${imageUrl}`);
      setLoaded(true); // Treat errored as "loaded" to avoid stuck loader
    };
    
    img.addEventListener('load', handleLoad);
    img.addEventListener('error', handleError);
    
    // Clean up
    return () => {
      img.removeEventListener('load', handleLoad);
      img.removeEventListener('error', handleError);
    };
  }, [imageUrl]);

  return loaded;
}
