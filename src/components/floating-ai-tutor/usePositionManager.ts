
import { useState, useRef, useCallback } from "react";
import { Position } from "./types";

export const usePositionManager = (homePosition: Position) => {
  const [position, setPosition] = useState<Position>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('floating-tutor-position');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          console.log('📍 Loaded saved position:', parsed);
          return parsed;
        } catch (error) {
          console.warn('Failed to parse saved position:', error);
        }
      }
    }
    console.log('🏠 Using home position:', homePosition);
    return homePosition;
  });

  const animationFrameId = useRef<number | undefined>();
  const lastUpdateTime = useRef<number>(0);
  const updateThrottle = 16; // ~60fps

  const updatePosition = useCallback((newPosition: Position) => {
    const now = Date.now();
    
    // Throttle updates to prevent excessive re-renders
    if (now - lastUpdateTime.current < updateThrottle) {
      return;
    }
    
    // Cancel any pending animation frame to prevent duplicate updates
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }

    // Use requestAnimationFrame to batch position updates
    animationFrameId.current = requestAnimationFrame(() => {
      console.log('📍 Updating position to:', newPosition);
      setPosition(newPosition);
      lastUpdateTime.current = now;
      animationFrameId.current = undefined;
    });
  }, [updateThrottle]);

  const resetToHome = useCallback(() => {
    console.log('🏠 Resetting to home position:', homePosition);
    updatePosition(homePosition);
  }, [homePosition, updatePosition]);

  return {
    position,
    updatePosition,
    resetToHome,
    animationFrameId
  };
};
