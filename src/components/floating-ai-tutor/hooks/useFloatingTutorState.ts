
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Message } from "../types";

export const useFloatingTutorState = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasWelcomedOnHomepage, setHasWelcomedOnHomepage] = useState(false);
  const [showEnableButton, setShowEnableButton] = useState(true);
  const location = useLocation();

  const shouldHide = location.pathname === '/auth' || location.pathname.startsWith('/auth/');
  const isOnHomepage = location.pathname === '/';

  useEffect(() => {
    if (shouldHide) {
      setIsOpen(false);
    }
  }, [location.pathname, shouldHide]);

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
