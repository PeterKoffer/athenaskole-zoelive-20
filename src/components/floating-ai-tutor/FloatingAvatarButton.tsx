
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
    // Repeat the last welcome message or a generic greeting
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
      
      {/* Small control buttons very close to Nelie */}
      <div className="flex gap-1 -mt-1">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleEnabled}
          className="w-8 h-8 p-0 bg-gray-800/90 border-gray-600 hover:bg-gray-700/90 backdrop-blur-sm"
          title={isEnabled ? "Mute Nelie" : "Unmute Nelie"}
        >
          {isEnabled ? (
            <Volume2 className="w-3 h-3 text-green-300" />
          ) : (
            <VolumeX className="w-3 h-3 text-gray-400" />
          )}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleRepeat}
          disabled={!isEnabled}
          className="w-8 h-8 p-0 bg-gray-800/90 border-gray-600 hover:bg-gray-700/90 backdrop-blur-sm disabled:opacity-50"
          title="Ask Nelie to Repeat"
        >
          <RotateCcw className="w-3 h-3 text-blue-300" />
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
