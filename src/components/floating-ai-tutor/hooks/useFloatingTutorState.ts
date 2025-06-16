
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export interface FloatingTutorMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export const useFloatingTutorState = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<FloatingTutorMessage[]>([]);
  const [hasWelcomedOnHomepage, setHasWelcomedOnHomepage] = useState(() => {
    return sessionStorage.getItem('nelieHomepageWelcomed') === 'true';
  });
  const [showEnableButton, setShowEnableButton] = useState(false);

  // Determine if we're on the homepage
  const isOnHomepage = location.pathname === '/';
  
  // Hide floating tutor on homepage when user is not logged in
  // This prevents duplicate Nelie avatars (HomepageWelcome already shows Nelie for logged-in users)
  const shouldHide = isOnHomepage && !user;

  console.log('🎯 FloatingTutorState:', {
    isOnHomepage,
    hasUser: !!user,
    shouldHide,
    pathname: location.pathname
  });

  return {
    isOpen,
    setIsOpen,
    messages,
    setMessages,
    hasWelcomedOnHomepage,
    setHasWelcomedOnHomepage,
    showEnableButton,
    setShowEnableButton,
    shouldHide,
    isOnHomepage
  };
};
