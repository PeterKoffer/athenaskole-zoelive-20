
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUnifiedSpeech } from "@/hooks/useUnifiedSpeech";
import { Message } from "../types";

interface UseFloatingTutorLogicProps {
  messages: Message[];
  setMessages: (messages: Message[] | ((prev: Message[]) => Message[])) => void;
  hasWelcomedOnHomepage: boolean;
  setHasWelcomedOnHomepage: (value: boolean) => void;
  showEnableButton: boolean;
  setShowEnableButton: (value: boolean) => void;
  shouldHide: boolean;
  isOnHomepage: boolean;
  hasMoved: boolean;
  isDragging: boolean;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  resetToHome: () => void;
}

export const useFloatingTutorLogic = ({
  messages,
  setMessages,
  hasWelcomedOnHomepage,
  setHasWelcomedOnHomepage,
  showEnableButton,
  setShowEnableButton,
  shouldHide,
  isOnHomepage,
  hasMoved,
  isDragging,
  isOpen,
  setIsOpen,
  resetToHome
}: UseFloatingTutorLogicProps) => {
  const navigate = useNavigate();
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

  // Hide button when speech starts or user has interacted
  useEffect(() => {
    if (isSpeaking || (isEnabled && hasUserInteracted)) {
      setShowEnableButton(false);
    }
  }, [isSpeaking, isEnabled, hasUserInteracted, setShowEnableButton]);

  // Only show welcome message once on homepage after login
  useEffect(() => {
    if (!shouldHide && messages.length === 0 && isOnHomepage && !hasWelcomedOnHomepage) {
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
    } else if (!shouldHide && messages.length === 0 && !isOnHomepage) {
      setMessages([]);
    }
  }, [shouldHide, messages.length, isOnHomepage, hasWelcomedOnHomepage, isEnabled, speakAsNelie, isReady, hasUserInteracted, setMessages, setHasWelcomedOnHomepage]);

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

  return {
    isSpeaking,
    isEnabled,
    hasUserInteracted,
    isReady,
    handleEnableNelie,
    toggleOpen,
    handleSendMessage,
    handleResetToHome,
    stop
  };
};
