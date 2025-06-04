
import { useState, useRef, useCallback, useEffect } from "react";
import { Position, DragOffset } from "./types";

interface UseEventHandlersProps {
  updatePosition: (position: Position) => void;
  animationFrameId: React.MutableRefObject<number | undefined>;
}

export const useEventHandlers = ({ updatePosition, animationFrameId }: UseEventHandlersProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const dragOffset = useRef<DragOffset>({ x: 0, y: 0 });
  const dragStartPosition = useRef<Position>({ x: 0, y: 0 });
  const moveThreshold = 10; // Increased threshold to prevent accidental drags

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    console.log('🖱️ Mouse down on Nelie at position:', { x: e.clientX, y: e.clientY });
    
    e.preventDefault();
    e.stopPropagation();
    
    const rect = e.currentTarget.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    
    dragStartPosition.current = { x: e.clientX, y: e.clientY };
    setIsDragging(true);
    setHasMoved(false);
    
    console.log('📏 Drag offset set to:', dragOffset.current);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    console.log('👆 Touch start on Nelie');
    
    e.preventDefault();
    e.stopPropagation();
    
    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    dragOffset.current = {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    };
    
    dragStartPosition.current = { x: touch.clientX, y: touch.clientY };
    setIsDragging(true);
    setHasMoved(false);
    
    console.log('📏 Touch drag offset set to:', dragOffset.current);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = Math.abs(e.clientX - dragStartPosition.current.x);
    const deltaY = Math.abs(e.clientY - dragStartPosition.current.y);
    const totalMovement = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    if (totalMovement > moveThreshold && !hasMoved) {
      setHasMoved(true);
      console.log('🎯 Movement detected, setting hasMoved to true');
    }
    
    if (hasMoved || totalMovement > moveThreshold) {
      const newX = e.clientX - dragOffset.current.x;
      const newY = e.clientY - dragOffset.current.y;
      updatePosition({ x: newX, y: newY });
    }
  }, [isDragging, hasMoved, updatePosition, moveThreshold]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - dragStartPosition.current.x);
    const deltaY = Math.abs(touch.clientY - dragStartPosition.current.y);
    const totalMovement = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    if (totalMovement > moveThreshold && !hasMoved) {
      setHasMoved(true);
      console.log('🎯 Touch movement detected, setting hasMoved to true');
    }
    
    if (hasMoved || totalMovement > moveThreshold) {
      const newX = touch.clientX - dragOffset.current.x;
      const newY = touch.clientY - dragOffset.current.y;
      updatePosition({ x: newX, y: newY });
      e.preventDefault();
    }
  }, [isDragging, hasMoved, updatePosition, moveThreshold]);

  const handleMouseUp = useCallback(() => {
    console.log('🖱️ Mouse up - stopping drag, hasMoved:', hasMoved);
    
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
    
    setIsDragging(false);
    
    // Reset hasMoved after a short delay to allow click handler to check it
    setTimeout(() => {
      console.log('🔄 Resetting hasMoved to false');
      setHasMoved(false);
    }, 50);
  }, [hasMoved, animationFrameId]);

  const handleTouchEnd = useCallback(() => {
    console.log('👆 Touch end - stopping drag, hasMoved:', hasMoved);
    
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
    
    setIsDragging(false);
    
    // Reset hasMoved after a short delay to allow click handler to check it
    setTimeout(() => {
      console.log('🔄 Resetting hasMoved to false');
      setHasMoved(false);
    }, 50);
  }, [hasMoved, animationFrameId]);

  useEffect(() => {
    if (isDragging) {
      console.log('🎯 Adding drag event listeners');
      document.addEventListener('mousemove', handleMouseMove, { passive: false });
      document.addEventListener('mouseup', handleMouseUp, { passive: false });
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd, { passive: false });
      
      document.body.style.userSelect = 'none';
      document.body.style.webkitUserSelect = 'none';
      
      return () => {
        console.log('🎯 Removing drag event listeners');
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
        document.body.style.userSelect = '';
        document.body.style.webkitUserSelect = '';
        
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current);
        }
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd, animationFrameId]);

  return {
    isDragging,
    handleMouseDown,
    handleTouchStart,
    hasMoved
  };
};
