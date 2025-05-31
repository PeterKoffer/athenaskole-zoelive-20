
import { Button } from "@/components/ui/button";
import { MessageCircle, Move } from "lucide-react";

interface CollapsedButtonProps {
  onExpand: () => void;
  onMouseDown: (e: React.MouseEvent) => void;
  isDragging?: boolean;
}

const CollapsedButton = ({ onExpand, onMouseDown, isDragging }: CollapsedButtonProps) => {
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
        className={`bg-gradient-to-r from-purple-400 to-cyan-400 hover:from-purple-500 hover:to-cyan-500 text-white border-none rounded-full w-14 h-14 shadow-lg transition-all duration-200 ${
          isDragging ? 'scale-105 shadow-xl cursor-grabbing' : 'cursor-grab hover:scale-105'
        }`}
      >
        <div className="flex flex-col items-center">
          <span className="text-lg">🎓</span>
          <MessageCircle className="w-4 h-4 absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5" />
          {isDragging && (
            <Move className="w-3 h-3 absolute -top-1 -left-1 bg-blue-500 rounded-full p-0.5 text-white" />
          )}
        </div>
      </Button>
      {isDragging && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-white bg-black bg-opacity-75 px-2 py-1 rounded whitespace-nowrap">
          Træk mig rundt
        </div>
      )}
    </div>
  );
};

export default CollapsedButton;
