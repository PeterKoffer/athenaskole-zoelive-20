import NELIEAvatar from "@/components/ai-tutor/NELIEAvatar";

interface CollapsedButtonProps {
  onExpand: () => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onTouchStart: (e: React.TouchEvent) => void;
  isDragging?: boolean;
  hasMoved?: boolean;
  isSpeaking?: boolean;
}

const CollapsedButton = ({ 
  onExpand, 
  onMouseDown, 
  onTouchStart, 
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

  return (
    <div className="relative select-none flex items-center space-x-1">      
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
        <NELIEAvatar 
          size="3xl" 
          isActive={true} 
          isSpeaking={isSpeaking}
          className="pointer-events-none drop-shadow-2xl"
        />
      </div>
    </div>
  );
};

export default CollapsedButton;