
import { useUnifiedSpeech } from "@/hooks/useUnifiedSpeech";
import ChatInterface from "./floating-ai-tutor/ChatInterface";
import FloatingAvatarButton from "./floating-ai-tutor/FloatingAvatarButton";
import FloatingContainer from "./floating-ai-tutor/FloatingContainer";
import { useDragHandler } from "./floating-ai-tutor/useDragHandler";
import { useFloatingTutorState } from "./floating-ai-tutor/hooks/useFloatingTutorState";
import { useFloatingTutorLogic } from "./floating-ai-tutor/hooks/useFloatingTutorLogic";

const FloatingAITutor = () => {
  const homePosition = {
    x: 200,
    y: 180
  };
  
  const { position, isDragging, handleMouseDown, handleTouchStart, resetToHome, hasMoved } = useDragHandler(homePosition);
  
  const {
    isOpen,
    setIsOpen,
    messages,
    setMessages,
    hasWelcomedOnHomepage,
    setHasWelcomedOnHomepage,
    showEnableButton,
    setShowEnableButton,
    shouldHide,
    isOnHomepage
  } = useFloatingTutorState();

  const {
    isSpeaking,
    isEnabled,
    hasUserInteracted,
    handleEnableNelie,
    toggleOpen,
    handleSendMessage,
    handleResetToHome,
    stop
  } = useFloatingTutorLogic({
    messages,
    setMessages,
    hasWelcomedOnHomepage,
    setHasWelcomedOnHomepage,
    showEnableButton,
    setShowEnableButton,
    shouldHide,
    isOnHomepage,
    hasMoved,
    isDragging,
    isOpen,
    setIsOpen,
    resetToHome
  });

  const { toggleEnabled } = useUnifiedSpeech();

  if (shouldHide) {
    return null;
  }

  console.log('🤖 FloatingAITutor rendering with unified speech:', { isSpeaking, isEnabled, isReady: true });

  return (
    <FloatingContainer position={position}>
      {!isOpen ? (
        <FloatingAvatarButton
          onToggleOpen={toggleOpen}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onResetToHome={handleResetToHome}
          onEnableNelie={handleEnableNelie}
          isDragging={isDragging}
          hasMoved={hasMoved}
          isSpeaking={isSpeaking}
          showEnableButton={showEnableButton}
          hasUserInteracted={hasUserInteracted}
          isOnHomepage={isOnHomepage}
        />
      ) : (
        <ChatInterface
          messages={messages}
          onSendMessage={handleSendMessage}
          onClose={toggleOpen}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onResetToHome={handleResetToHome}
          isSpeaking={isSpeaking}
          onStopSpeaking={stop}
          isDragging={isDragging}
          autoReadEnabled={isEnabled}
          onMuteToggle={toggleEnabled}
        />
      )}
    </FloatingContainer>
  );
};

export default FloatingAITutor;
