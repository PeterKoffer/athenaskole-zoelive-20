
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
    x: 0,
    y: 0
  };
  
  const { position, isDragging, handleMouseDown, handleTouchStart, resetToHome } = useDragHandler(homePosition);

  // Only hide on auth pages - show everywhere else
  const shouldHide = location.pathname === '/auth' || location.pathname.startsWith('/auth/');

  console.log('🎭 FloatingAITutor render check:', { 
    shouldHide, 
    currentPath: location.pathname,
    isOpen,
    position,
    messagesLength: messages.length,
    isVisible: !shouldHide
  });

  // Reset state when navigating to auth pages
  useEffect(() => {
    if (shouldHide) {
      setIsOpen(false);
    }
  }, [location.pathname, shouldHide]);

  // Add initial welcome message
  useEffect(() => {
    if (!shouldHide && messages.length === 0) {
      const welcomeMessage: Message = {
        role: "assistant",
        content: "Hi! I'm Nelie, your AI tutor! 👩‍🏫 I'm here to help you learn. Ask me anything!",
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
      console.log('👋 Welcome message added to Nelie');
    }
  }, [shouldHide, messages.length]);

  // Don't render on auth pages
  if (shouldHide) {
    console.log('🚫 FloatingAITutor hidden on auth page');
    return null;
  }

  const toggleOpen = () => {
    console.log('🔄 Toggling Nelie open state:', !isOpen);
    setIsOpen(!isOpen);
  };

  const handleSendMessage = (text: string) => {
    console.log('💬 User message to Nelie:', text);
    const newMessage: Message = { 
      role: "user", 
      content: text, 
      timestamp: new Date() 
    };
    setMessages([...messages, newMessage]);

    // Auto-respond with encouraging message
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
      console.log('🤖 Nelie responded:', randomResponse);
    }, 1000);
  };

  const handleResetToHome = () => {
    console.log('🏠 Resetting Nelie to home position');
    resetToHome();
    navigate('/');
  };

  const handleStopSpeaking = () => {
    setIsSpeaking(false);
    speechSynthesis.cancel();
  };

  console.log('✅ FloatingAITutor rendering UI - isOpen:', isOpen, 'position:', position);

  return (
    <div 
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 999999
      }}
    >
      {/* Collapsed button state */}
      {!isOpen && (
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            transform: `translate(${position.x}px, ${position.y}px)`,
            cursor: isDragging ? 'grabbing' : 'grab',
            pointerEvents: 'auto',
            zIndex: 1000000
          }}
        >
          <CollapsedButton 
            onExpand={toggleOpen}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onResetToHome={handleResetToHome}
            isDragging={isDragging}
          />
        </div>
      )}

      {/* Chat interface state */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            transform: `translate(${position.x}px, ${position.y}px)`,
            cursor: isDragging ? 'grabbing' : 'grab',
            pointerEvents: 'auto',
            zIndex: 1000000
          }}
        >
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
        </div>
      )}
    </div>
  );
};

export default FloatingAITutor;
