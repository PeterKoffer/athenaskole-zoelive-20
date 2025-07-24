

import CollapsedButton from "./CollapsedButton";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, RotateCcw } from "lucide-react";
import { useUnifiedSpeech } from "@/hooks/useUnifiedSpeech";

interface FloatingAvatarButtonProps {
  onToggleOpen: () => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onTouchStart: (e: React.TouchEvent) => void;
  isDragging: boolean;
  hasMoved: boolean;
  isSpeaking: boolean;
}

const FloatingAvatarButton = ({
  onToggleOpen,
  onMouseDown,
  onTouchStart,
  isDragging,
  hasMoved,
  isSpeaking
}: FloatingAvatarButtonProps) => {
  const { isEnabled, toggleEnabled, repeatSpeech } = useUnifiedSpeech();

  const handleRepeat = () => {
    const repeatMessage = "Hello! I'm Nelie, your AI learning companion. How can I help you today?";
    repeatSpeech(repeatMessage, 'floating-tutor-repeat');
  };

  return (
    <div className="relative flex flex-col items-center justify-center">
      <CollapsedButton 
        onExpand={onToggleOpen}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        isDragging={isDragging}
        hasMoved={hasMoved}
        isSpeaking={isSpeaking}
      />
      
      {/* Small icon-only control buttons positioned directly below Nelie */}
      <div className="flex gap-1 -mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleEnabled}
          className="w-7 h-7 p-0 bg-gray-800/90 border-gray-600 hover:bg-gray-700/90 text-white rounded-full flex items-center justify-center"
        >
          {isEnabled ? (
            <Volume2 className="w-3 h-3" />
          ) : (
            <VolumeX className="w-3 h-3" />
          )}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleRepeat}
          disabled={!isEnabled}
          className="w-7 h-7 p-0 bg-gray-800/90 border-gray-600 hover:bg-gray-700/90 text-white disabled:opacity-50 rounded-full flex items-center justify-center"
        >
          <RotateCcw className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
};

export default FloatingAvatarButton;

