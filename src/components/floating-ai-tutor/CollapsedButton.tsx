
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

interface CollapsedButtonProps {
  onExpand: () => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onResetToHome: () => void;
  isDragging?: boolean;
  hasMoved?: boolean;
}

const CollapsedButton = ({ 
  onExpand, 
  onMouseDown, 
  onTouchStart, 
  onResetToHome, 
  isDragging, 
  hasMoved 
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
        className="w-20 h-20 cursor-grab active:cursor-grabbing transition-transform duration-200 hover:scale-105 shadow-2xl"
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
          transform: isDragging ? 'scale(1.1)' : 'scale(1)',
          userSelect: 'none',
          touchAction: 'none',
        }}
      >
        <img 
          src="/lovable-uploads/50b77ea0-3474-47cb-8e98-16b77f963d10.png"
          alt="Nelie AI Tutor Robot"
          className="w-20 h-20 object-contain pointer-events-none"
          draggable={false}
          style={{ 
            userSelect: 'none',
            touchAction: 'none'
          }}
          onError={(e) => {
            console.error('❌ Robot image failed to load');
            // Fallback to emoji if image fails
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              parent.innerHTML = '<span style="font-size: 4rem;">🤖</span>';
            }
          }}
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
