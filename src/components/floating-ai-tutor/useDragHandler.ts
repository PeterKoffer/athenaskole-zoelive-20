
import { useState, useRef, useCallback, useEffect } from "react";
import { Position } from "./types";

export const useDragHandler = (homePosition: Position) => {
  const [position, setPosition] = useState<Position>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('floating-tutor-position');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return homePosition;
        }
      }
    }
    return homePosition;
  });

  const [isDragging, setIsDragging] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  
  const dragState = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    offsetX: 0,
    offsetY: 0,
    hasMovedThreshold: false
  });

  const MOVE_THRESHOLD = 5;

  // Save position to localStorage with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('floating-tutor-position', JSON.stringify(position));
      }
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [position]);

  const updatePosition = useCallback((newPosition: Position) => {
    setPosition(newPosition);
  }, []);

  const resetToHome = useCallback(() => {
    updatePosition(homePosition);
  }, [homePosition, updatePosition]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (dragState.current.isDragging) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    dragState.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
      hasMovedThreshold: false
    };
    
    setIsDragging(true);
    setHasMoved(false);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (dragState.current.isDragging) return;
    
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    
    dragState.current = {
      isDragging: true,
      startX: touch.clientX,
      startY: touch.clientY,
      offsetX: touch.clientX - rect.left,
      offsetY: touch.clientY - rect.top,
      hasMovedThreshold: false
    };
    
    setIsDragging(true);
    setHasMoved(false);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragState.current.isDragging) return;
    
    const deltaX = Math.abs(e.clientX - dragState.current.startX);
    const deltaY = Math.abs(e.clientY - dragState.current.startY);
    const totalMovement = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    if (totalMovement > MOVE_THRESHOLD && !dragState.current.hasMovedThreshold) {
      dragState.current.hasMovedThreshold = true;
      setHasMoved(true);
    }
    
    if (dragState.current.hasMovedThreshold) {
      const newX = e.clientX - dragState.current.offsetX;
      const newY = e.clientY - dragState.current.offsetY;
      updatePosition({ x: newX, y: newY });
    }
  }, [updatePosition, MOVE_THRESHOLD]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!dragState.current.isDragging) return;
    
    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - dragState.current.startX);
    const deltaY = Math.abs(touch.clientY - dragState.current.startY);
    const totalMovement = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    if (totalMovement > MOVE_THRESHOLD && !dragState.current.hasMovedThreshold) {
      dragState.current.hasMovedThreshold = true;
      setHasMoved(true);
    }
    
    if (dragState.current.hasMovedThreshold) {
      const newX = touch.clientX - dragState.current.offsetX;
      const newY = touch.clientY - dragState.current.offsetY;
      updatePosition({ x: newX, y: newY });
      e.preventDefault();
    }
  }, [updatePosition, MOVE_THRESHOLD]);

  const handleEnd = useCallback(() => {
    dragState.current.isDragging = false;
    setIsDragging(false);
    
    // Reset hasMoved after a short delay to allow click handler to check it
    setTimeout(() => {
      setHasMoved(false);
    }, 100);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove, { passive: false });
      document.addEventListener('mouseup', handleEnd, { passive: false });
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleEnd, { passive: false });
      
      document.body.style.userSelect = 'none';
      document.body.style.touchAction = 'none';
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleEnd);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleEnd);
        document.body.style.userSelect = '';
        document.body.style.touchAction = '';
      };
    }
  }, [isDragging, handleMouseMove, handleTouchMove, handleEnd]);

  return {
    position,
    isDragging,
    handleMouseDown,
    handleTouchStart,
    resetToHome,
    hasMoved
  };
};
