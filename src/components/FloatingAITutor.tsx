
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
  
  // Position the floating tutor directly on top of the navbar logo
  const homePosition = {
    x: 16, // Left padding to align with navbar logo
    y: 20  // Top position to align with navbar
  };
  
  const { position, isDragging, handleMouseDown, handleTouchStart, resetToHome, hasMoved } = useDragHandler(homePosition);

  // Only hide on auth pages - show everywhere else including daily-program
  const shouldHide = location.pathname === '/auth' || location.pathname.startsWith('/auth/');

  console.log('🎭 FloatingAITutor render check:', { 
    shouldHide, 
    currentPath: location.pathname,
    isOpen,
    position,
    messagesLength: messages.length,
    isVisible: !shouldHide,
    isDragging,
    hasMoved,
    viewportWidth: typeof window !== 'undefined' ? window.innerWidth : 'unknown'
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

  const toggleOpen = () => {
    console.log('🔄 Toggling Nelie open state from', isOpen, 'to', !isOpen, 'hasMoved:', hasMoved, 'isDragging:', isDragging);
    // Only toggle if we haven't moved and we're not dragging
    if (!hasMoved && !isDragging) {
      setIsOpen(!isOpen);
      console.log('✅ Toggled Nelie to:', !isOpen);
    } else {
      console.log('❌ Not toggling - user was dragging or moved');
    }
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

  // Don't render on auth pages
  if (shouldHide) {
    console.log('🚫 FloatingAITutor hidden on auth page');
    return null;
  }

  console.log('✅ FloatingAITutor rendering UI - isOpen:', isOpen, 'position:', position);

  return (
    <>
      {/* Collapsed button state - Only visible when not open */}
      {!isOpen && (
        <div
          style={{
            position: 'fixed',
            top: `${position.y}px`,
            left: `${position.x}px`,
            zIndex: 999999,
            pointerEvents: 'auto'
          }}
        >
          <CollapsedButton 
            onExpand={toggleOpen}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onResetToHome={handleResetToHome}
            isDragging={isDragging}
            hasMoved={hasMoved}
          />
        </div>
      )}

      {/* Chat interface state - Only visible when open */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: `${position.y}px`,
            left: `${position.x}px`,
            zIndex: 999999,
            pointerEvents: 'auto'
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
    </>
  );
};

export default FloatingAITutor;
