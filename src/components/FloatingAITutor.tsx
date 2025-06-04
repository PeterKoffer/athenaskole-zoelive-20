
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ChatInterface from "./floating-ai-tutor/ChatInterface";
import CollapsedButton from "./floating-ai-tutor/CollapsedButton";
import { useDragHandler } from "./floating-ai-tutor/useDragHandler";
import { Message } from "./floating-ai-tutor/types";

const FloatingAITutor = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const homePosition = {
    x: 16,
    y: 20
  };
  
  const { position, isDragging, handleMouseDown, handleTouchStart, resetToHome, hasMoved } = useDragHandler(homePosition);

  // Only hide on auth pages, but always show the collapsed button otherwise
  const shouldHide = location.pathname === '/auth' || location.pathname.startsWith('/auth/');

  useEffect(() => {
    if (shouldHide) {
      setIsOpen(false);
    }
  }, [location.pathname, shouldHide]);

  useEffect(() => {
    if (!shouldHide && messages.length === 0) {
      const welcomeMessage: Message = {
        role: "assistant",
        content: "Hi! I'm Nelie, your AI tutor! 👩‍🏫 I'm here to help you learn. Ask me anything!",
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [shouldHide, messages.length]);

  const toggleOpen = () => {
    if (!hasMoved && !isDragging) {
      setIsOpen(!isOpen);
    }
  };

  const handleSendMessage = (text: string) => {
    const newMessage: Message = { 
      role: "user", 
      content: text, 
      timestamp: new Date() 
    };
    setMessages(prev => [...prev, newMessage]);

    setTimeout(() => {
      const responses = [
        "That's a great question! Keep exploring and learning! 🌟",
        "I love your curiosity! Learning is an adventure! 🚀",
        "Excellent! You're doing amazing work! 💫",
        "Keep up the fantastic learning! I'm proud of you! 🎓"
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const aiResponse: Message = {
        role: "assistant",
        content: randomResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleResetToHome = () => {
    resetToHome();
    navigate('/');
  };

  const handleStopSpeaking = () => {
    setIsSpeaking(false);
    speechSynthesis.cancel();
  };

  // Return null only on auth pages - otherwise always show the tutor
  if (shouldHide) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: `${position.y}px`,
        left: `${position.x}px`,
        zIndex: 999999,
        pointerEvents: 'auto'
      }}
    >
      {!isOpen ? (
        <CollapsedButton 
          onExpand={toggleOpen}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onResetToHome={handleResetToHome}
          isDragging={isDragging}
          hasMoved={hasMoved}
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
          onStopSpeaking={handleStopSpeaking}
          isDragging={isDragging}
        />
      )}
    </div>
  );
};

export default FloatingAITutor;
