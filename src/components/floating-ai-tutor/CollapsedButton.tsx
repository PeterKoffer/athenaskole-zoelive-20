
import React from 'react';
import RobotAvatar from '../ai-tutor/RobotAvatar';
import { Button } from '../ui/button';
import { Home, RotateCcw } from 'lucide-react';

interface CollapsedButtonProps {
  onExpand: () => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onResetToHome: () => void;
  isDragging: boolean;
  hasMoved: boolean;
  isSpeaking: boolean;
}

const CollapsedButton = ({
  onExpand,
  onMouseDown,
  onTouchStart,
  onResetToHome,
  isDragging,
  hasMoved,
  isSpeaking
}: CollapsedButtonProps) => {
  const handleClick = () => {
    if (!isDragging && !hasMoved) {
      onExpand();
    }
  };

  const handleResetClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onResetToHome();
  };

  return (
    <div className="relative">
      <div
        className="cursor-pointer select-none"
        onClick={handleClick}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        <RobotAvatar 
          size="xl" 
          isActive={true} 
          isSpeaking={isSpeaking}
          className="drop-shadow-2xl hover:scale-105 transition-transform"
        />
      </div>
      
      {/* Small control buttons */}
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={handleResetClick}
          className="w-6 h-6 p-0 bg-gray-800/90 border-gray-600 hover:bg-gray-700/90 text-white rounded-full"
          title="Reset to home position"
        >
          <Home className="w-3 h-3" />
        </Button>
      </div>
      
      {/* Speech indicator */}
      {isSpeaking && (
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full animate-pulse">
          <div className="absolute inset-0 bg-green-400 rounded-full animate-ping"></div>
        </div>
      )}
    </div>
  );
};

export default CollapsedButton;
