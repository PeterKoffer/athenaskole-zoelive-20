import { useState, useRef, useCallback, useEffect } from 'react';

interface Position {
  x: number;
  y: number;
}

interface DragOffset {
  x: number;
  y: number;
}

export const useDragBehavior = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 20, y: 20 });
  const [hasMoved, setHasMoved] = useState(false);
  
  const dragRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef({
    startPos: { x: 0, y: 0 },
    offset: { x: 0, y: 0 },
    hasMovedThreshold: false
  });

  const MOVE_THRESHOLD = 5;

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const rect = e.currentTarget.getBoundingClientRect();
    dragStateRef.current = {
      startPos: { x: e.clientX, y: e.clientY },
      offset: { x: e.clientX - rect.left, y: e.clientY - rect.top },
      hasMovedThreshold: false
    };
    
    setIsDragging(true);
    setHasMoved(false);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = Math.abs(e.clientX - dragStateRef.current.startPos.x);
    const deltaY = Math.abs(e.clientY - dragStateRef.current.startPos.y);
    const totalMovement = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    if (totalMovement > MOVE_THRESHOLD && !dragStateRef.current.hasMovedThreshold) {
      dragStateRef.current.hasMovedThreshold = true;
      setHasMoved(true);
    }
    
    if (dragStateRef.current.hasMovedThreshold) {
      const newX = e.clientX - dragStateRef.current.offset.x;
      const newY = e.clientY - dragStateRef.current.offset.y;
      
      // Keep within screen bounds
      const maxX = window.innerWidth - 100;
      const maxY = window.innerHeight - 100;
      
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    }
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    
    // Reset hasMoved after a short delay to prevent immediate clicks
    setTimeout(() => setHasMoved(false), 100);
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.userSelect = 'none';

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return {
    isDragging,
    position,
    dragRef,
    handleMouseDown,
    hasMoved
  };
};
