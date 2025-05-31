
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
  return (
    <div className="relative">
      <Button
        onClick={(e) => {
          e.stopPropagation();
          if (!isDragging) {
            onExpand();
          }
        }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        className={`bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white border-none rounded-full w-16 h-16 shadow-lg transition-all duration-200 ${
          isDragging ? 'scale-105 shadow-xl cursor-grabbing' : 'cursor-grab hover:scale-105'
        }`}
      >
        <div className="flex flex-col items-center">
          <div className="text-2xl">👩‍🏫</div>
          <div className="text-xs font-bold mt-1">Nelie</div>
          <MessageCircle className="w-4 h-4 absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5" />
          {isDragging && (
            <Move className="w-3 h-3 absolute -top-1 -left-1 bg-blue-500 rounded-full p-0.5 text-white" />
          )}
        </div>
      </Button>
      
      {/* Home button for collapsed state */}
      <Button
        onClick={(e) => {
          e.stopPropagation();
          onResetToHome();
        }}
        className="absolute -top-2 -right-2 w-6 h-6 bg-gray-700 hover:bg-gray-600 text-white border-none rounded-full p-1"
        title="Go home"
      >
        <Home className="w-3 h-3" />
      </Button>
      
      {isDragging && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-white bg-black bg-opacity-75 px-2 py-1 rounded whitespace-nowrap">
          Drag me around
        </div>
      )}
    </div>
  );
};

export default CollapsedButton;
