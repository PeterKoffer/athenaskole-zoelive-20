import { useState, useRef, useCallback, useEffect } from "react";
import { Position } from "./types";

export const usePositionManager = (homePosition: Position) => {
  const [position, setPosition] = useState<Position>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('floating-tutor-position');
      if (saved) {
        try {
          const parsedPosition = JSON.parse(saved);
          // Ensure the saved position is still valid on current screen
          const viewportWidth = window.innerWidth;
          const viewportHeight = window.innerHeight;
          
          // Check if saved position is within reasonable bounds (leave space for the button)
          if (parsedPosition.x >= 0 && parsedPosition.y >= 0 && 
              parsedPosition.x <= viewportWidth - 100 && 
              parsedPosition.y <= viewportHeight - 100) {
            console.log('📍 Restored Nelie position:', parsedPosition);
            return parsedPosition;
          } else {
            console.log('🚫 Saved position out of bounds, using default');
          }
        } catch (e) {
          console.log('❌ Failed to parse saved position');
        }
      }
      // Default to top-right but visible (20px from edges)
      const defaultPosition = { 
        x: Math.max(0, window.innerWidth - 120),
        y: 20
      };
      console.log('📍 Using default Nelie position:', defaultPosition);
      return defaultPosition;
    }
    return { x: 20, y: 20 };
  });

  const lastPosition = useRef<Position>(position);
  const animationFrameId = useRef<number>();

  const constrainPosition = useCallback((newPosition: Position): Position => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Keep within reasonable bounds but allow some negative values
    const constrained = {
      x: Math.max(0, Math.min(newPosition.x, viewportWidth - 100)),
      y: Math.max(0, Math.min(newPosition.y, viewportHeight - 100))
    };
    
    return constrained;
  }, []);

  const updatePosition = useCallback((newPosition: Position) => {
    // Use requestAnimationFrame to batch position updates and prevent duplicate renders
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
    
    animationFrameId.current = requestAnimationFrame(() => {
      const constrainedPosition = constrainPosition(newPosition);
      
      // Only update if position actually changed
      if (lastPosition.current.x !== constrainedPosition.x || lastPosition.current.y !== constrainedPosition.y) {
        lastPosition.current = constrainedPosition;
        setPosition(constrainedPosition);
      }
    });
  }, [constrainPosition]);

  const resetToHome = useCallback(() => {
    const safeHomePosition = { 
      x: Math.max(0, window.innerWidth - 120), 
      y: 20
    };
    const constrainedHomePosition = constrainPosition(safeHomePosition);
    updatePosition(constrainedHomePosition);
    localStorage.setItem('floating-tutor-position', JSON.stringify(constrainedHomePosition));
    console.log('🏠 Reset Nelie to home position:', constrainedHomePosition);
  }, [constrainPosition, updatePosition]);

  // Handle window resize and force position check
  useEffect(() => {
    const handleResize = () => {
      console.log('📏 Window resized, adjusting Nelie position');
      updatePosition(position);
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      // Cancel any pending animation frame when cleaning up
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [position, updatePosition]);

  return {
    position,
    updatePosition,
    resetToHome,
    constrainPosition,
    animationFrameId
  };
};
