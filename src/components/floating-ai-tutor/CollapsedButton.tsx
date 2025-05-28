
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface CollapsedButtonProps {
  onExpand: () => void;
  onMouseDown: (e: React.MouseEvent) => void;
}

const CollapsedButton = ({ onExpand, onMouseDown }: CollapsedButtonProps) => {
  return (
    <Button
      onClick={(e) => {
        e.stopPropagation();
        onExpand();
      }}
      onMouseDown={onMouseDown}
      className="bg-gradient-to-r from-purple-400 to-cyan-400 hover:from-purple-500 hover:to-cyan-500 text-white border-none rounded-full w-14 h-14 shadow-lg cursor-move"
    >
      <div className="flex flex-col items-center">
        <span className="text-lg">🎓</span>
        <MessageCircle className="w-4 h-4 absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5" />
      </div>
    </Button>
  );
};

export default CollapsedButton;
