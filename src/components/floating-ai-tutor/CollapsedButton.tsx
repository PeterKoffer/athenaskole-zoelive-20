
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import RobotAvatar from "@/components/ai-tutor/RobotAvatar";

interface CollapsedButtonProps {
  onExpand: () => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onResetToHome: () => void;
  isDragging?: boolean;
  hasMoved?: boolean;
  isSpeaking?: boolean;
}

const CollapsedButton = ({ 
  onExpand, 
  onMouseDown, 
  onTouchStart, 
  onResetToHome, 
  isDragging, 
  hasMoved,
  isSpeaking = false
}: CollapsedButtonProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!hasMoved && !isDragging) {
      onExpand();
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onMouseDown(e);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onTouchStart(e);
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onResetToHome();
  };

  console.log('🎯 CollapsedButton rendering, isDragging:', isDragging, 'hasMoved:', hasMoved);
  
  return (
    <div className="relative select-none">
      <div
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className="cursor-grab active:cursor-grabbing transition-transform duration-200 hover:scale-105"
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
          transform: isDragging ? 'scale(1.1)' : 'scale(1)',
          userSelect: 'none',
          touchAction: 'none',
        }}
      >
        <RobotAvatar 
          size="3xl" 
          isActive={true} 
          isSpeaking={isSpeaking}
          className="pointer-events-none drop-shadow-2xl"
        />
      </div>
      
      <Button
        onClick={handleHomeClick}
        className="absolute -top-2 -right-2 w-8 h-8 bg-gray-600 hover:bg-gray-500 text-white border-none rounded-full flex items-center justify-center shadow-lg p-0 min-w-0 z-10"
        title="Go home"
      >
        <Home className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default CollapsedButton;
