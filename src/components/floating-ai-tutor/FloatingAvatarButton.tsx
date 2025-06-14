
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
    <div className="relative flex items-center justify-center">
      <CollapsedButton 
        onExpand={onToggleOpen}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onResetToHome={onResetToHome}
        isDragging={isDragging}
        hasMoved={hasMoved}
        isSpeaking={isSpeaking}
      />
      
      {/* Position the Enable Nelie button closer to the avatar */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
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
