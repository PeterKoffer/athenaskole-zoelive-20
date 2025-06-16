
import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Button } from '../../ui/button';

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
  return (
    <div
      className="floating-tutor-container"
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 9999999,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onMouseDown={onMouseDown}
    >
      <Button
        onClick={onClick}
        className="w-14 h-14 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
        size="icon"
      >
        <MessageSquare className="w-6 h-6" />
      </Button>
    </div>
  );
};

export default FloatingButton;
