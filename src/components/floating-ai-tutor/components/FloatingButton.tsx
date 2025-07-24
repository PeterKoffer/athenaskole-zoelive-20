
import React from 'react';

interface FloatingButtonProps {
  onClick: () => void;
  onMouseDown: (e: React.MouseEvent) => void;
  position: { x: number; y: number };
  isDragging: boolean;
  hasMoved?: boolean;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({
  onClick,
  onMouseDown,
  position,
  isDragging,
  hasMoved = false
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Only trigger click if we haven't moved (not dragging)
    if (!isDragging && !hasMoved) {
      onClick();
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onMouseDown(e);
  };

  return (
    <div
      className="floating-tutor-container"
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 9999999,
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none'
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
    >
      <div className="w-20 h-20 rounded-full bg-white/80 backdrop-blur flex items-center justify-center hover:scale-105 transition animate-float shadow-2xl">
        <img
          src="/nelie.png"
          alt="NELIE"
          className="w-16 h-16 object-contain pointer-events-none"
        />
      </div>
    </div>
  );
};

export default FloatingButton;
