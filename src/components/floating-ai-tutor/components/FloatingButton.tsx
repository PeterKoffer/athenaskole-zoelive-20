
import React from 'react';
import RobotAvatar from '@/components/ai-tutor/RobotAvatar';

interface FloatingButtonProps {
  onClick: () => void;
  onMouseDown: (e: React.MouseEvent) => void;
  position: { x: number; y: number };
  isDragging: boolean;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({
  onClick,
  onMouseDown,
  position,
  isDragging
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
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
      <RobotAvatar 
        size="3xl" 
        isActive={true} 
        isSpeaking={false}
        className="pointer-events-none drop-shadow-2xl transition-transform duration-200 hover:scale-105"
      />
    </div>
  );
};

export default FloatingButton;
