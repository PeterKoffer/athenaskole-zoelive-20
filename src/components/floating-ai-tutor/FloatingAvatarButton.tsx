
import CollapsedButton from "./CollapsedButton";
import EnableNelieButton from "./EnableNelieButton";

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
  return (
    <div className="flex flex-col items-center space-y-4">
      <CollapsedButton 
        onExpand={onToggleOpen}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onResetToHome={onResetToHome}
        isDragging={isDragging}
        hasMoved={hasMoved}
        isSpeaking={isSpeaking}
      />
      
      <EnableNelieButton
        showEnableButton={showEnableButton}
        hasUserInteracted={hasUserInteracted}
        isOnHomepage={isOnHomepage}
        onEnableNelie={onEnableNelie}
      />
    </div>
  );
};

export default FloatingAvatarButton;
