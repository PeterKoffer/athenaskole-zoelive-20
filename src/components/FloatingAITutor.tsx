
import { useState } from "react";
import { useDragHandler } from "./floating-ai-tutor/useDragHandler";
import { useMessageHandler } from "./floating-ai-tutor/useMessageHandler";
import ChatInterface from "./floating-ai-tutor/ChatInterface";
import CollapsedButton from "./floating-ai-tutor/CollapsedButton";

const FloatingAITutor = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const { position, handleMouseDown } = useDragHandler({ x: 20, y: 20 });
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
        className="fixed z-50 cursor-move"
        style={{ left: position.x, top: position.y }}
      >
        <CollapsedButton 
          onExpand={() => setIsExpanded(true)}
          onMouseDown={handleMouseDown}
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
      />
    </div>
  );
};

export default FloatingAITutor;
