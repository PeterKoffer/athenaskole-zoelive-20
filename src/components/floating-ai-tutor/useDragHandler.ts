
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
  
  const dragRef = useRef({
    isDragging: false,
    startPos: { x: 0, y: 0 },
    offset: { x: 0, y: 0 },
    hasMovedThreshold: false
  });

  const MOVE_THRESHOLD = 5;

  // Save position to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('floating-tutor-position', JSON.stringify(position));
    }
  }, [position]);

  const resetToHome = useCallback(() => {
    setPosition(homePosition);
  }, [homePosition]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const rect = e.currentTarget.getBoundingClientRect();
    dragRef.current = {
      isDragging: true,
      startPos: { x: e.clientX, y: e.clientY },
      offset: { x: e.clientX - rect.left, y: e.clientY - rect.top },
      hasMovedThreshold: false
    };
    
    setIsDragging(true);
    setHasMoved(false);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    
    dragRef.current = {
      isDragging: true,
      startPos: { x: touch.clientX, y: touch.clientY },
      offset: { x: touch.clientX - rect.left, y: touch.clientY - rect.top },
      hasMovedThreshold: false
    };
    
    setIsDragging(true);
    setHasMoved(false);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragRef.current.isDragging) return;
    
    const deltaX = Math.abs(e.clientX - dragRef.current.startPos.x);
    const deltaY = Math.abs(e.clientY - dragRef.current.startPos.y);
    const totalMovement = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    if (totalMovement > MOVE_THRESHOLD && !dragRef.current.hasMovedThreshold) {
      dragRef.current.hasMovedThreshold = true;
      setHasMoved(true);
    }
    
    if (dragRef.current.hasMovedThreshold) {
      const newX = e.clientX - dragRef.current.offset.x;
      const newY = e.clientY - dragRef.current.offset.y;
      setPosition({ x: newX, y: newY });
    }
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!dragRef.current.isDragging || !e.touches[0]) return;
    
    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - dragRef.current.startPos.x);
    const deltaY = Math.abs(touch.clientY - dragRef.current.startPos.y);
    const totalMovement = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    if (totalMovement > MOVE_THRESHOLD && !dragRef.current.hasMovedThreshold) {
      dragRef.current.hasMovedThreshold = true;
      setHasMoved(true);
    }
    
    if (dragRef.current.hasMovedThreshold) {
      const newX = touch.clientX - dragRef.current.offset.x;
      const newY = touch.clientY - dragRef.current.offset.y;
      setPosition({ x: newX, y: newY });
      e.preventDefault();
    }
  }, []);

  const handleEnd = useCallback(() => {
    if (!dragRef.current.isDragging) return;
    
    dragRef.current.isDragging = false;
    setIsDragging(false);
    
    // Reset hasMoved after a delay
    setTimeout(() => setHasMoved(false), 100);
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMoveGlobal = (e: MouseEvent) => handleMouseMove(e);
    const handleMouseUpGlobal = () => handleEnd();
    const handleTouchMoveGlobal = (e: TouchEvent) => handleTouchMove(e);
    const handleTouchEndGlobal = () => handleEnd();

    document.addEventListener('mousemove', handleMouseMoveGlobal);
    document.addEventListener('mouseup', handleMouseUpGlobal);
    document.addEventListener('touchmove', handleTouchMoveGlobal, { passive: false });
    document.addEventListener('touchend', handleTouchEndGlobal);
    
    document.body.style.userSelect = 'none';

    return () => {
      document.removeEventListener('mousemove', handleMouseMoveGlobal);
      document.removeEventListener('mouseup', handleMouseUpGlobal);
      document.removeEventListener('touchmove', handleTouchMoveGlobal);
      document.removeEventListener('touchend', handleTouchEndGlobal);
      document.body.style.userSelect = '';
    };
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
