
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
  
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef<DragOffset>({ x: 0, y: 0 });
  const dragStartTime = useRef<number>(0);
  const hasMoved = useRef<boolean>(false);
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
  }, []);

  const handleTouchEnd = useCallback(() => {
    console.log('👆 Touch end - stopping drag, hasMoved:', hasMoved.current);
    setIsDragging(false);
    
    // Cancel any pending animation frame
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
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

  // Handle window resize and force position check
  useEffect(() => {
    const handleResize = () => {
      console.log('📏 Window resized, adjusting Nelie position');
      updatePosition(position);
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [position, updatePosition]);

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
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  return {
    position,
    isDragging,
    handleMouseDown,
    handleTouchStart,
    resetToHome,
    hasMoved: hasMoved.current
  };
};
