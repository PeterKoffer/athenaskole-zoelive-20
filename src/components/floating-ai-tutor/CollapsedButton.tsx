
import { Button } from "@/components/ui/button";
import { MessageCircle, Move, Home } from "lucide-react";

interface CollapsedButtonProps {
  onExpand: () => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onResetToHome: () => void;
  isDragging?: boolean;
}

const CollapsedButton = ({ onExpand, onMouseDown, onTouchStart, onResetToHome, isDragging }: CollapsedButtonProps) => {
  console.log('🔘 CollapsedButton rendering, isDragging:', isDragging);
  
  const handleButtonClick = (e: React.MouseEvent) => {
    console.log('🖱️ Nelie button clicked - preventing propagation and checking if dragging:', isDragging);
    e.stopPropagation();
    e.preventDefault();
    
    // Only expand if we're not dragging
    if (!isDragging) {
      console.log('✅ Expanding Nelie - not dragging');
      onExpand();
    } else {
      console.log('❌ Not expanding Nelie - currently dragging');
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    console.log('🖱️ Mouse down on Nelie button');
    e.stopPropagation();
    onMouseDown(e);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    console.log('👆 Touch start on Nelie button');
    e.stopPropagation();
    onTouchStart(e);
  };
  
  return (
    <div className="relative">
      <Button
        onClick={handleButtonClick}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className={`
          bg-gradient-to-r from-pink-500 to-purple-600 
          hover:from-pink-600 hover:to-purple-700
          text-white border-none rounded-full 
          w-20 h-20 shadow-2xl 
          transition-all duration-200 
          flex flex-col items-center justify-center
          ${isDragging ? 'scale-110 shadow-3xl cursor-grabbing' : 'cursor-grab hover:scale-105'}
        `}
        style={{
          minWidth: '80px',
          minHeight: '80px',
          padding: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
        }}
      >
        <div className="text-3xl mb-1">👩‍🏫</div>
        <div className="text-xs font-bold text-center leading-tight">Nelie<br/>AI Tutor</div>
        
        {/* Online indicator - larger and more visible */}
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
          <MessageCircle className="w-3 h-3 text-white" />
        </div>
        
        {/* Drag indicator */}
        {isDragging && (
          <div className="absolute -top-2 -left-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
            <Move className="w-3 h-3 text-white" />
          </div>
        )}
      </Button>
      
      {/* Home button - larger and more visible */}
      <Button
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          console.log('🏠 Home button clicked');
          onResetToHome();
        }}
        className="absolute -top-3 -right-3 w-8 h-8 bg-gray-700 hover:bg-gray-600 text-white border-2 border-white rounded-full flex items-center justify-center shadow-lg"
        title="Go home"
      >
        <Home className="w-4 h-4" />
      </Button>
      
      {/* Drag tooltip */}
      {isDragging && (
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-sm text-white bg-black bg-opacity-75 px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
          🚀 Drag me around!
        </div>
      )}
      
      {/* Pulse animation when not dragging */}
      {!isDragging && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 animate-ping opacity-20"></div>
      )}
    </div>
  );
};

export default CollapsedButton;
