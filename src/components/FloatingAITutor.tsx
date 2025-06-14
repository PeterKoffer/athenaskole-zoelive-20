
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ChatInterface from "./floating-ai-tutor/ChatInterface";
import CollapsedButton from "./floating-ai-tutor/CollapsedButton";
import { useDragHandler } from "./floating-ai-tutor/useDragHandler";
import { useUnifiedSpeech } from "@/hooks/useUnifiedSpeech";
import { Message } from "./floating-ai-tutor/types";
import { Button } from "@/components/ui/button";
import { Volume2 } from "lucide-react";

const FloatingAITutor = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasWelcomedOnHomepage, setHasWelcomedOnHomepage] = useState(false);
  const [showEnableButton, setShowEnableButton] = useState(true);
  const { 
    isSpeaking, 
    isEnabled, 
    speakAsNelie, 
    stop, 
    toggleEnabled, 
    hasUserInteracted, 
    isReady,
    enableUserInteraction
  } = useUnifiedSpeech();
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

  // Hide button when speech starts or user has interacted
  useEffect(() => {
    if (isSpeaking || (isEnabled && hasUserInteracted)) {
      setShowEnableButton(false);
    }
  }, [isSpeaking, isEnabled, hasUserInteracted]);

  // Only show welcome message once on homepage after login
  useEffect(() => {
    if (!shouldHide && messages.length === 0 && location.pathname === '/' && !hasWelcomedOnHomepage) {
      const welcomeMessage: Message = {
        role: "assistant",
        content: "Hi! I'm Nelie, your AI tutor! 👩‍🏫 I'm here to help you learn. Ask me anything!",
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
      setHasWelcomedOnHomepage(true);
      
      // Auto-speak welcome message if enabled and ready
      if (isEnabled && isReady && hasUserInteracted) {
        console.log('🎵 Speaking welcome message via unified system...');
        setTimeout(() => {
          speakAsNelie("Hi! I'm Nelie, your AI tutor! I'm here to help you learn. Ask me anything!");
        }, 1000);
      } else {
        console.log('🚫 Not speaking welcome message:', {
          isEnabled,
          isReady,
          hasUserInteracted
        });
      }
    } else if (!shouldHide && messages.length === 0 && location.pathname !== '/') {
      setMessages([]);
    }
  }, [shouldHide, messages.length, location.pathname, hasWelcomedOnHomepage, isEnabled, speakAsNelie, isReady, hasUserInteracted]);

  const handleEnableNelie = async () => {
    console.log('🔊 Enable Nelie button clicked (Floating)', { 
      isEnabled, 
      hasUserInteracted, 
      isSpeaking, 
      isReady 
    });
    
    // Hide the button immediately when clicked
    setShowEnableButton(false);
    
    const welcomeMessage = "Hi! I'm Nelie, your AI tutor! I'm here to help you learn. Ask me anything!";
    
    if (!hasUserInteracted) {
      console.log('🔊 First interaction - enabling user interaction');
      enableUserInteraction();
      setTimeout(() => {
        if (!isEnabled) {
          toggleEnabled();
        }
        setTimeout(() => {
          speakAsNelie(welcomeMessage);
        }, 500);
      }, 200);
      return;
    }
    
    if (!isEnabled) {
      console.log('🔊 Enabling speech and will speak welcome message...');
      toggleEnabled();
    }
    
    if (!isReady) {
      console.log('🔊 Waiting for speech system readiness...');
      setTimeout(() => handleEnableNelie(), 600);
      return;
    }
    
    console.log('🔊 Speaking welcome message');
    speakAsNelie(welcomeMessage);
  };

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
      
      // Speak the response if enabled and ready
      if (isEnabled && isReady && hasUserInteracted) {
        console.log('🎵 Speaking AI response via unified system...');
        speakAsNelie(randomResponse);
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

  console.log('🤖 FloatingAITutor rendering with unified speech:', { isSpeaking, isEnabled, isReady });

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
        <div className="flex flex-col items-center space-y-4">
          <CollapsedButton 
            onExpand={toggleOpen}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onResetToHome={handleResetToHome}
            isDragging={isDragging}
            hasMoved={hasMoved}
            isSpeaking={isSpeaking}
          />
          
          {/* Enable Nelie Button under the floating avatar */}
          {showEnableButton && !hasUserInteracted && location.pathname === '/' && (
            <Button
              onClick={handleEnableNelie}
              className="bg-white hover:bg-gray-100 text-purple-600 font-bold px-6 py-3 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 animate-bounce"
            >
              <Volume2 className="w-5 h-5 mr-2" />
              Enable Nelie
            </Button>
          )}
        </div>
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
    </div>
  );
};

export default FloatingAITutor;
