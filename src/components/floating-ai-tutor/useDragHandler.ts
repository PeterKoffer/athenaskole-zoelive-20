
import { useState, useRef, useEffect, useCallback } from "react";
import { Position, DragOffset } from "./types";

export const useDragHandler = (homePosition: Position) => {
  const [position, setPosition] = useState<Position>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('floating-tutor-position');
      if (saved) {
        try {
          const parsedPosition = JSON.parse(saved);
          // Ensure the saved position is still valid on current screen
          if (parsedPosition.x >= -100 && parsedPosition.y >= -100 && 
              parsedPosition.x < window.innerWidth && 
              parsedPosition.y < window.innerHeight) {
            console.log('📍 Restored Nelie position:', parsedPosition);
            return parsedPosition;
          }
        } catch (e) {
          console.log('❌ Failed to parse saved position');
        }
      }
      // Default to bottom-right corner with some offset
      const defaultPosition = { 
        x: 0, 
        y: 0
      };
      console.log('📍 Using default Nelie position:', defaultPosition);
      return defaultPosition;
    }
    return { x: 0, y: 0 };
  });
  
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef<DragOffset>({ x: 0, y: 0 });

  const constrainPosition = useCallback((newPosition: Position): Position => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const elementWidth = 320;
    const elementHeight = 400;
    
    const constrained = {
      x: Math.max(-250, Math.min(newPosition.x, viewportWidth - 100)),
      y: Math.max(-300, Math.min(newPosition.y, viewportHeight - 100))
    };
    
    console.log('🔒 Constraining position from', newPosition, 'to', constrained);
    return constrained;
  }, []);

  const resetToHome = useCallback(() => {
    const safeHomePosition = { 
      x: 0, 
      y: 0
    };
    const constrainedHomePosition = constrainPosition(safeHomePosition);
    setPosition(constrainedHomePosition);
    console.log('🏠 Reset Nelie to home position:', constrainedHomePosition);
  }, [constrainPosition]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    console.log('🖱️ Mouse down on Nelie');
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    e.preventDefault();
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    console.log('👆 Touch start on Nelie');
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    dragOffset.current = {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    };
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const newPosition = constrainPosition({
        x: e.clientX - dragOffset.current.x - window.innerWidth + 20,
        y: e.clientY - dragOffset.current.y - window.innerHeight + 20
      });
      setPosition(newPosition);
    }
  }, [isDragging, constrainPosition]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (isDragging) {
      const touch = e.touches[0];
      const newPosition = constrainPosition({
        x: touch.clientX - dragOffset.current.x - window.innerWidth + 20,
        y: touch.clientY - dragOffset.current.y - window.innerHeight + 20
      });
      setPosition(newPosition);
      e.preventDefault();
    }
  }, [isDragging, constrainPosition]);

  const handleMouseUp = useCallback(() => {
    console.log('🖱️ Mouse up - stopping drag');
    setIsDragging(false);
  }, []);

  const handleTouchEnd = useCallback(() => {
    console.log('👆 Touch end - stopping drag');
    setIsDragging(false);
  }, []);

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

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      console.log('📏 Window resized, adjusting Nelie position');
      setPosition(current => constrainPosition(current));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [constrainPosition]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      
      document.body.style.userSelect = 'none';
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
        document.body.style.userSelect = '';
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  return {
    position,
    isDragging,
    handleMouseDown,
    handleTouchStart,
    resetToHome
  };
};
