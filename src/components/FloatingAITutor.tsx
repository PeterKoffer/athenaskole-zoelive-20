
import { useState, useMemo, useEffect } from "react";
import { useDragHandler } from "./floating-ai-tutor/useDragHandler";
import { useMessageHandler } from "./floating-ai-tutor/useMessageHandler";
import ChatInterface from "./floating-ai-tutor/ChatInterface";
import CollapsedButton from "./floating-ai-tutor/CollapsedButton";

const FloatingAITutor = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const homePosition = useMemo(() => ({
    x: typeof window !== 'undefined' ? window.innerWidth - 120 : 120,
    y: 20
  }), []);

  const { position, isDragging, handleMouseDown, handleTouchStart, resetToHome } = useDragHandler(homePosition);
  const { messages, handleSendMessage } = useMessageHandler();

  // Debug logging to ensure component is mounting
  useEffect(() => {
    console.log('FloatingAITutor mounted at position:', position);
  }, []);

  // Auto-scroll to a safe position when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      resetToHome();
    }, 100);
    return () => clearTimeout(timer);
  }, [resetToHome]);

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
    top: position.y,
    zIndex: 9999, // Ensure it's always on top
    position: 'fixed' as const
  };

  console.log('FloatingAITutor rendering at position:', position, 'expanded:', isExpanded);

  if (!isExpanded) {
    return (
      <div style={containerStyle}>
        <CollapsedButton 
          onExpand={() => {
            console.log('Expanding tutor');
            setIsExpanded(true);
          }}
          {...commonProps}
        />
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <ChatInterface
        messages={messages}
        onSendMessage={onSendMessage}
        onClose={() => {
          console.log('Closing tutor');
          setIsExpanded(false);
        }}
        isSpeaking={isSpeaking}
        onStopSpeaking={stopSpeaking}
        {...commonProps}
      />
    </div>
  );
};

export default FloatingAITutor;
