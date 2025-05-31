
import { useState } from "react";
import { useDragHandler } from "./floating-ai-tutor/useDragHandler";
import { useMessageHandler } from "./floating-ai-tutor/useMessageHandler";
import ChatInterface from "./floating-ai-tutor/ChatInterface";
import CollapsedButton from "./floating-ai-tutor/CollapsedButton";

const FloatingAITutor = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Start with a better default position that avoids the logo
  const { position, isDragging, handleMouseDown } = useDragHandler({ x: window.innerWidth - 100, y: 80 });
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

  if (!isExpanded) {
    return (
      <div
        className="fixed z-50"
        style={{ left: position.x, top: position.y }}
      >
        <CollapsedButton 
          onExpand={() => setIsExpanded(true)}
          onMouseDown={handleMouseDown}
          isDragging={isDragging}
        />
      </div>
    );
  }

  return (
    <div
      className="fixed z-50"
      style={{ left: position.x, top: position.y }}
    >
      <ChatInterface
        messages={messages}
        onSendMessage={onSendMessage}
        onClose={() => setIsExpanded(false)}
        onMouseDown={handleMouseDown}
        isSpeaking={isSpeaking}
        onStopSpeaking={stopSpeaking}
        isDragging={isDragging}
      />
    </div>
  );
};

export default FloatingAITutor;
