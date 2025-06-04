
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { removeBackground, loadImage } from "@/utils/backgroundRemoval";

interface CollapsedButtonProps {
  onExpand: () => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onResetToHome: () => void;
  isDragging?: boolean;
  hasMoved?: boolean;
}

const CollapsedButton = ({ onExpand, onMouseDown, onTouchStart, onResetToHome, isDragging, hasMoved }: CollapsedButtonProps) => {
  const [processedImageUrl, setProcessedImageUrl] = useState<string>("");
  
  console.log('🔘 CollapsedButton rendering, isDragging:', isDragging, 'hasMoved:', hasMoved);
  
  useEffect(() => {
    const processRobotImage = async () => {
      try {
        console.log('🤖 Processing robot image...');
        
        // Load the original image
        const response = await fetch("/lovable-uploads/07757147-84dc-4515-8288-c8150519c3bf.png");
        const blob = await response.blob();
        const imageElement = await loadImage(blob);
        
        // Remove background
        const processedBlob = await removeBackground(imageElement);
        const processedUrl = URL.createObjectURL(processedBlob);
        
        setProcessedImageUrl(processedUrl);
        console.log('✅ Robot image processed successfully');
      } catch (error) {
        console.error('❌ Failed to process robot image:', error);
        // Fallback to original image
        setProcessedImageUrl("/lovable-uploads/07757147-84dc-4515-8288-c8150519c3bf.png");
      }
    };

    processRobotImage();
    
    return () => {
      if (processedImageUrl && processedImageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(processedImageUrl);
      }
    };
  }, []);

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
      {/* Robot button with transparent background and processed image */}
      <Button
        onClick={handleButtonClick}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className="bg-transparent border-none hover:bg-transparent focus:bg-transparent active:bg-transparent p-0 w-20 h-20 rounded-full overflow-hidden"
        style={{
          backgroundColor: 'transparent !important',
          border: 'none',
          boxShadow: 'none',
          zIndex: 999999,
          pointerEvents: 'auto'
        }}
      >
        <div 
          className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center"
          style={{ 
            cursor: isDragging ? 'grabbing' : 'grab',
            transition: isDragging ? 'none' : 'transform 0.2s ease',
            transform: isDragging ? 'scale(1.05)' : 'scale(1)',
            backgroundColor: 'transparent'
          }}
        >
          {processedImageUrl && (
            <img 
              src={processedImageUrl}
              alt="Nelie AI Tutor Robot"
              className="w-18 h-18 object-contain"
              style={{ 
                pointerEvents: 'none',
                userSelect: 'none'
              }}
            />
          )}
        </div>
      </Button>
      
      {/* Home button - small and minimal */}
      <Button
        onClick={handleHomeClick}
        className="absolute -top-1 -right-1 w-5 h-5 bg-gray-600 hover:bg-gray-500 text-white border-none rounded-full flex items-center justify-center shadow-sm"
        title="Go home"
        style={{ pointerEvents: 'auto', zIndex: 999999 }}
      >
        <Home className="w-2.5 h-2.5" />
      </Button>
    </div>
  );
};

export default CollapsedButton;
