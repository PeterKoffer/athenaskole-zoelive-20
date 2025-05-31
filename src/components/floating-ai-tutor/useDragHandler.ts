
import { useState, useRef, useEffect } from "react";
import { Position, DragOffset } from "./types";

export const useDragHandler = (homePosition: Position) => {
  const [position, setPosition] = useState<Position>(() => {
    // Try to restore position from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('floating-tutor-position');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return parsed;
        } catch (e) {
          console.log('Failed to parse saved position');
        }
      }
    }
    return homePosition;
  });
  
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef<DragOffset>({ x: 0, y: 0 });

  // Constrain position to viewport bounds
  const constrainPosition = (newPosition: Position): Position => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const elementWidth = 320; // Approximate width of the floating tutor
    const elementHeight = 400; // Approximate height of the floating tutor
    
    return {
      x: Math.max(0, Math.min(newPosition.x, viewportWidth - elementWidth)),
      y: Math.max(0, Math.min(newPosition.y, viewportHeight - elementHeight))
    };
  };

  const resetToHome = () => {
    const constrainedHomePosition = constrainPosition(homePosition);
    setPosition(constrainedHomePosition);
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    e.preventDefault(); // Prevent text selection
  };

  // Touch events for mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    dragOffset.current = {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    };
    e.preventDefault(); // Prevent scrolling
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newPosition = constrainPosition({
        x: e.clientX - dragOffset.current.x,
        y: e.clientY - dragOffset.current.y
      });
      setPosition(newPosition);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (isDragging) {
      const touch = e.touches[0];
      const newPosition = constrainPosition({
        x: touch.clientX - dragOffset.current.x,
        y: touch.clientY - dragOffset.current.y
      });
      setPosition(newPosition);
      e.preventDefault(); // Prevent scrolling
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Save position to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('floating-tutor-position', JSON.stringify(position));
    }
  }, [position]);

  // Handle window resize to keep tutor in bounds
  useEffect(() => {
    const handleResize = () => {
      setPosition(current => constrainPosition(current));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isDragging) {
      // Mouse events
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      // Touch events
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      
      document.body.style.userSelect = 'none'; // Prevent text selection while dragging
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
        document.body.style.userSelect = '';
      };
    }
  }, [isDragging]);

  return {
    position,
    isDragging,
    handleMouseDown,
    handleTouchStart,
    resetToHome
  };
};
