
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Message } from '../types';

export const useFloatingTutorState = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm Nelie, your AI learning companion. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  
  // Always show the floating tutor for authenticated users - don't hide it
  const shouldHide = !user; // Only hide if no user is logged in

  console.log('🎯 FloatingTutorState:', {
    pathname: location.pathname,
    hasUser: !!user,
    shouldHide,
    isOpen
  });

  return {
    isOpen,
    setIsOpen,
    messages,
    setMessages,
    shouldHide,
    hasWelcomedOnHomepage: true,
    setHasWelcomedOnHomepage: () => {},
    showEnableButton: false,
    setShowEnableButton: () => {},
    isOnHomepage: location.pathname === '/'
  };
};
