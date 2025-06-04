
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ChatInterface from "./floating-ai-tutor/ChatInterface";
import CollapsedButton from "./floating-ai-tutor/CollapsedButton";
import { useDragHandler } from "./floating-ai-tutor/useDragHandler";
import { useSpeechSynthesis } from "./adaptive-learning/hooks/useSpeechSynthesis";
import { Message } from "./floating-ai-tutor/types";

const FloatingAITutor = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const { isSpeaking, autoReadEnabled, speakText, stopSpeaking, handleMuteToggle, isSpeechSynthesisSupported } = useSpeechSynthesis();
  const location = useLocation();
  const navigate = useNavigate();
  
  const homePosition = {
    x: 200,
    y: 180
  };
  
  const { position, isDragging, handleMouseDown, handleTouchStart, resetToHome, hasMoved } = useDragHandler(homePosition);

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
      
      // Auto-speak welcome message if enabled and supported
      if (autoReadEnabled && isSpeechSynthesisSupported) {
        console.log('🎵 Speaking welcome message...');
        setTimeout(() => {
          speakText("Hi! I'm Nelie, your AI tutor! I'm here to help you learn. Ask me anything!");
        }, 1000);
      } else {
        console.log('🚫 Not speaking welcome message:', {
          autoReadEnabled,
          isSpeechSynthesisSupported
        });
      }
    }
  }, [shouldHide, messages.length, autoReadEnabled, speakText, isSpeechSynthesisSupported]);

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
      
      // Speak the response if auto-read is enabled and supported
      if (autoReadEnabled && isSpeechSynthesisSupported) {
        console.log('🎵 Speaking AI response...');
        speakText(randomResponse);
      }
    }, 1000);
  };

  const handleResetToHome = () => {
    resetToHome();
    navigate('/');
  };

  if (shouldHide) {
    return null;
  }

  console.log('🤖 FloatingAITutor rendering at position:', position, 'isOpen:', isOpen, 'isSpeaking:', isSpeaking);

  return (
    <div
      style={{
        position: 'fixed',
        top: `${position.y}px`,
        left: `${position.x}px`,
        zIndex: 9999999,
        pointerEvents: 'auto',
        transform: 'translateZ(0)',
      }}
      className="floating-tutor-container"
    >
      {!isOpen ? (
        <CollapsedButton 
          onExpand={toggleOpen}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onResetToHome={handleResetToHome}
          isDragging={isDragging}
          hasMoved={hasMoved}
          isSpeaking={isSpeaking}
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
          onStopSpeaking={stopSpeaking}
          isDragging={isDragging}
          autoReadEnabled={autoReadEnabled}
          onMuteToggle={handleMuteToggle}
        />
      )}
    </div>
  );
};

export default FloatingAITutor;
