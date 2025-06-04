
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
    onMouseDown(e);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    console.log('👆 Touch start on Nelie button');
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
      <Button
        onClick={handleButtonClick}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className={`
          bg-transparent border-none rounded-full 
          w-20 h-20 
          transition-all duration-200 
          flex items-center justify-center
          ${isDragging ? 'scale-110 cursor-grabbing' : 'cursor-grab hover:scale-105'}
        `}
        style={{
          minWidth: '80px',
          minHeight: '80px',
          padding: '0',
          zIndex: 999999,
          pointerEvents: 'auto'
        }}
      >
        <img 
          src="/lovable-uploads/07757147-84dc-4515-8288-c8150519c3bf.png" 
          alt="Nelie AI Tutor Robot"
          className="w-20 h-20 object-contain"
          style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' }}
        />
      </Button>
      
      {/* Home button - positioned at top-right */}
      <Button
        onClick={handleHomeClick}
        className="absolute -top-2 -right-2 w-6 h-6 bg-gray-700 hover:bg-gray-600 text-white border border-white rounded-full flex items-center justify-center shadow-lg"
        title="Go home"
        style={{ pointerEvents: 'auto', zIndex: 999999 }}
      >
        <Home className="w-3 h-3" />
      </Button>
    </div>
  );
};

export default CollapsedButton;
