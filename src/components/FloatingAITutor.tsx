
import { useState, useMemo } from "react";
import { useDragHandler } from "./floating-ai-tutor/useDragHandler";
import { useMessageHandler } from "./floating-ai-tutor/useMessageHandler";
import ChatInterface from "./floating-ai-tutor/ChatInterface";
import CollapsedButton from "./floating-ai-tutor/CollapsedButton";

const FloatingAITutor = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const homePosition = useMemo(() => ({
    x: typeof window !== 'undefined' ? window.innerWidth - 100 : 100,
    y: typeof window !== 'undefined' ? window.innerHeight - 100 : 100
  }), []);

  const { position, isDragging, handleMouseDown, handleTouchStart, resetToHome } = useDragHandler(homePosition);
  const { messages, handleSendMessage } = useMessageHandler();

  const onSendMessage = (message: string) => {
    handleSendMessage(message, () => {}, setIsSpeaking);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const commonProps = {
    onMouseDown: handleMouseDown,
    onTouchStart: handleTouchStart,
    onResetToHome: resetToHome,
    isDragging
  };

  const containerStyle = {
    left: position.x,
    top: position.y
  };

  if (!isExpanded) {
    return (
      <div className="fixed z-50" style={containerStyle}>
        <CollapsedButton 
          onExpand={() => setIsExpanded(true)}
          {...commonProps}
        />
      </div>
    );
  }

  return (
    <div className="fixed z-50" style={containerStyle}>
      <ChatInterface
        messages={messages}
        onSendMessage={onSendMessage}
        onClose={() => setIsExpanded(false)}
        isSpeaking={isSpeaking}
        onStopSpeaking={stopSpeaking}
        {...commonProps}
      />
    </div>
  );
};

export default FloatingAITutor;
