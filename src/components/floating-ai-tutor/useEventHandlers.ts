
import { useState, useRef, useCallback, useEffect } from "react";
import { Position, DragOffset } from "./types";

interface UseEventHandlersProps {
  updatePosition: (position: Position) => void;
  animationFrameId: React.MutableRefObject<number | undefined>;
}

export const useEventHandlers = ({ updatePosition, animationFrameId }: UseEventHandlersProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef<DragOffset>({ x: 0, y: 0 });
  const dragStartTime = useRef<number>(0);
  const hasMoved = useRef<boolean>(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    console.log('🖱️ Mouse down on Nelie at position:', { x: e.clientX, y: e.clientY });
    
    // Prevent default to avoid text selection and other unwanted behaviors
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragging(true);
    hasMoved.current = false;
    dragStartTime.current = Date.now();
    
    const rect = e.currentTarget.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    console.log('📏 Drag offset set to:', dragOffset.current);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    console.log('👆 Touch start on Nelie');
    
    // Prevent default to avoid scrolling and other touch behaviors
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragging(true);
    hasMoved.current = false;
    dragStartTime.current = Date.now();
    
    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    dragOffset.current = {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    };
    console.log('📏 Touch drag offset set to:', dragOffset.current);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      hasMoved.current = true;
      
      // Calculate new position relative to viewport
      const newX = e.clientX - dragOffset.current.x;
      const newY = e.clientY - dragOffset.current.y;
      
      updatePosition({ x: newX, y: newY });
    }
  }, [isDragging, updatePosition]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (isDragging) {
      hasMoved.current = true;
      
      const touch = e.touches[0];
      const newX = touch.clientX - dragOffset.current.x;
      const newY = touch.clientY - dragOffset.current.y;
      
      updatePosition({ x: newX, y: newY });
      e.preventDefault();
    }
  }, [isDragging, updatePosition]);

  const handleMouseUp = useCallback(() => {
    console.log('🖱️ Mouse up - stopping drag, hasMoved:', hasMoved.current);
    setIsDragging(false);
    
    // Cancel any pending animation frame
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
  }, [animationFrameId]);

  const handleTouchEnd = useCallback(() => {
    console.log('👆 Touch end - stopping drag, hasMoved:', hasMoved.current);
    setIsDragging(false);
    
    // Cancel any pending animation frame
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
  }, [animationFrameId]);

  useEffect(() => {
    if (isDragging) {
      console.log('🎯 Adding drag event listeners');
      document.addEventListener('mousemove', handleMouseMove, { passive: false });
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      
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
        
        // Cancel any pending animation frame when cleaning up
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
    hasMoved: hasMoved.current
  };
};
