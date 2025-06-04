
import { useState, useEffect } from "react";
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

const CollapsedButton = ({ onExpand, onMouseDown, onTouchStart, onResetToHome, isDragging, hasMoved }: CollapsedButtonProps) => {
  console.log('🔘 CollapsedButton rendering, isDragging:', isDragging, 'hasMoved:', hasMoved);

  const handleButtonClick = (e: React.MouseEvent) => {
    console.log('🖱️ Nelie button clicked - checking interaction, hasMoved:', hasMoved, 'isDragging:', isDragging);
    e.stopPropagation();
    e.preventDefault();
    
    // Only expand if we haven't moved and we're not currently dragging
    if (!hasMoved && !isDragging) {
      console.log('✅ Expanding Nelie - valid click');
      onExpand();
    } else {
      console.log('❌ Not expanding Nelie - was dragging or moved');
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    console.log('🖱️ Mouse down on Nelie button');
    e.preventDefault();
    e.stopPropagation();
    onMouseDown(e);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    console.log('👆 Touch start on Nelie button');
    e.preventDefault();
    e.stopPropagation();
    onTouchStart(e);
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    console.log('🏠 Home button clicked');
    onResetToHome();
  };
  
  return (
    <div className="relative">
      {/* Robot button - now twice as big (48x48) */}
      <Button
        onClick={handleButtonClick}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className="bg-transparent border-none hover:bg-transparent focus:bg-transparent active:bg-transparent p-0 w-48 h-48 rounded-full overflow-hidden"
        style={{
          backgroundColor: 'transparent !important',
          border: 'none',
          boxShadow: 'none',
          zIndex: 999999,
          pointerEvents: 'auto',
          userSelect: 'none',
          touchAction: 'none'
        }}
      >
        <div 
          className="w-48 h-48 rounded-full overflow-hidden flex items-center justify-center"
          style={{ 
            cursor: isDragging ? 'grabbing' : 'grab',
            transition: isDragging ? 'none' : 'transform 0.2s ease',
            transform: isDragging ? 'scale(1.05)' : 'scale(1)',
            backgroundColor: 'transparent',
            userSelect: 'none',
            touchAction: 'none'
          }}
        >
          <img 
            src="/lovable-uploads/50b77ea0-3474-47cb-8e98-16b77f963d10.png"
            alt="Nelie AI Tutor Robot"
            className="w-44 h-44 object-contain"
            draggable={false}
            style={{ 
              pointerEvents: 'none',
              userSelect: 'none',
              touchAction: 'none'
            }}
          />
        </div>
      </Button>
      
      {/* Home button - adjusted position for larger button */}
      <Button
        onClick={handleHomeClick}
        className="absolute -top-2 -right-2 w-8 h-8 bg-gray-600 hover:bg-gray-500 text-white border-none rounded-full flex items-center justify-center shadow-sm"
        title="Go home"
        style={{ pointerEvents: 'auto', zIndex: 999999 }}
      >
        <Home className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default CollapsedButton;
