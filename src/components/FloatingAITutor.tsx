
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ChatInterface from "./floating-ai-tutor/ChatInterface";
import CollapsedButton from "./floating-ai-tutor/CollapsedButton";
import { useDragHandler } from "./floating-ai-tutor/useDragHandler";
import { Message } from "./floating-ai-tutor/types";

const FloatingAITutor = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const homePosition = {
    x: 0,
    y: 0
  };
  
  const { position, isDragging, handleMouseDown, handleTouchStart, resetToHome } = useDragHandler(homePosition);

  // Only hide on auth pages - show everywhere else including all learning pages
  const shouldHide = location.pathname === '/auth' || location.pathname.startsWith('/auth/');

  // Reset state when navigating to auth pages
  useEffect(() => {
    if (shouldHide) {
      setIsOpen(false);
      setIsMinimized(false);
    }
  }, [location.pathname, shouldHide]);

  console.log('FloatingAITutor rendering:', { 
    shouldHide, 
    currentPath: location.pathname,
    isOpen,
    isMinimized 
  });

  if (shouldHide) {
    console.log('FloatingAITutor hidden due to auth page');
    return null;
  }

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = (text: string) => {
    const newMessage: Message = { 
      role: "user", 
      content: text, 
      timestamp: new Date() 
    };
    setMessages([...messages, newMessage]);
  };

  const handleResetToHome = () => {
    resetToHome();
    navigate('/');
  };

  const handleStopSpeaking = () => {
    setIsSpeaking(false);
    speechSynthesis.cancel();
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 999999,
        transform: `translate(${position.x}px, ${position.y}px)`,
        cursor: isDragging ? 'grabbing' : 'grab',
        pointerEvents: 'auto',
        isolation: 'isolate'
      }}
    >
      {!isOpen && !isMinimized && (
        <CollapsedButton 
          onExpand={toggleOpen}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onResetToHome={handleResetToHome}
          isDragging={isDragging}
        />
      )}

      {isOpen && !isMinimized && (
        <ChatInterface
          messages={messages}
          onSendMessage={handleSendMessage}
          onClose={toggleOpen}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onResetToHome={handleResetToHome}
          isSpeaking={isSpeaking}
          onStopSpeaking={handleStopSpeaking}
          isDragging={isDragging}
        />
      )}
    </div>
  );
};

export default FloatingAITutor;
