
import { useEffect, useCallback } from 'react';
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import { useMessageHandler } from '../useMessageHandler';
import { Message } from '../types';

interface UseFloatingTutorLogicProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  hasWelcomedOnHomepage: boolean;
  setHasWelcomedOnHomepage: React.Dispatch<React.SetStateAction<boolean>>;
  showEnableButton: boolean;
  setShowEnableButton: React.Dispatch<React.SetStateAction<boolean>>;
  shouldHide: boolean;
  isOnHomepage: boolean;
  hasMoved: boolean;
  isDragging: boolean;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
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
  
  const {
    isSpeaking,
    isEnabled,
    hasUserInteracted,
    speak,
    stop,
    enableUserInteraction,
    toggleEnabled
  } = useUnifiedSpeech();

  const { handleSendMessage } = useMessageHandler();

  // Speak Nelie's greeting when chat interface opens
  useEffect(() => {
    if (isOpen && isEnabled && hasUserInteracted && messages.length > 0) {
      const firstMessage = messages[0];
      if (firstMessage.role === 'assistant') {
        console.log('🤖 Nelie speaking initial greeting when chat opens');
        setTimeout(() => {
          speak(firstMessage.content, true, 'floating-tutor-greeting');
        }, 500);
      }
    }
  }, [isOpen, isEnabled, hasUserInteracted, messages, speak]);

  const handleEnableNelie = useCallback(() => {
    console.log('🎤 Enabling Nelie from floating tutor');
    enableUserInteraction();
    setShowEnableButton(false);
  }, [enableUserInteraction, setShowEnableButton]);

  const toggleOpen = useCallback(() => {
    if (!isDragging && !hasMoved) {
      setIsOpen(!isOpen);
    }
  }, [isDragging, hasMoved, isOpen, setIsOpen]);

  const handleSendMessageWrapper = useCallback((message: string) => {
    const setInputMessage = () => {}; // Not used in floating tutor context
    const setIsSpeaking = () => {}; // Handled by unified speech system
    
    return handleSendMessage(message, setInputMessage, setIsSpeaking);
  }, [handleSendMessage]);

  const handleResetToHome = useCallback(() => {
    if (!isDragging) {
      resetToHome();
    }
  }, [isDragging, resetToHome]);

  return {
    isSpeaking,
    isEnabled,
    hasUserInteracted,
    handleEnableNelie,
    toggleOpen,
    handleSendMessage: handleSendMessageWrapper,
    handleResetToHome,
    stop
  };
};
