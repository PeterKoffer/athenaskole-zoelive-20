
import CollapsedButton from "./CollapsedButton";
import EnableNelieButton from "./EnableNelieButton";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, RotateCcw } from "lucide-react";
import { useUnifiedSpeech } from "@/hooks/useUnifiedSpeech";

interface FloatingAvatarButtonProps {
  onToggleOpen: () => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onResetToHome: () => void;
  onEnableNelie: () => void;
  isDragging: boolean;
  hasMoved: boolean;
  isSpeaking: boolean;
  showEnableButton: boolean;
  hasUserInteracted: boolean;
  isOnHomepage: boolean;
}

const FloatingAvatarButton = ({
  onToggleOpen,
  onMouseDown,
  onTouchStart,
  onResetToHome,
  onEnableNelie,
  isDragging,
  hasMoved,
  isSpeaking,
  showEnableButton,
  hasUserInteracted,
  isOnHomepage
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
        onResetToHome={onResetToHome}
        isDragging={isDragging}
        hasMoved={hasMoved}
        isSpeaking={isSpeaking}
      />
      
      {/* Control buttons positioned directly under Nelie */}
      <div className="flex gap-2 mt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleEnabled}
          className="text-xs px-2 py-1 bg-gray-800/90 border-gray-600 hover:bg-gray-700/90 text-white"
        >
          {isEnabled ? (
            <><Volume2 className="w-3 h-3 mr-1" />Mute Nelie</>
          ) : (
            <><VolumeX className="w-3 h-3 mr-1" />Unmute Nelie</>
          )}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleRepeat}
          disabled={!isEnabled}
          className="text-xs px-2 py-1 bg-gray-800/90 border-gray-600 hover:bg-gray-700/90 text-white disabled:opacity-50"
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          Ask Nelie to Repeat
        </Button>
      </div>
      
      {/* Position the Enable Nelie button further down */}
      <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
        <EnableNelieButton
          showEnableButton={showEnableButton}
          hasUserInteracted={hasUserInteracted}
          isOnHomepage={isOnHomepage}
          onEnableNelie={onEnableNelie}
        />
      </div>
    </div>
  );
};

export default FloatingAvatarButton;
