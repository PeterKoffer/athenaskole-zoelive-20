
import { useEffect } from "react";
import { Position } from "./types";

export const useStorageManager = (position: Position) => {
  // Save position to localStorage with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('floating-tutor-position', JSON.stringify(position));
        console.log('💾 Saved Nelie position:', position);
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [position]);
};
