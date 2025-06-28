
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useFloatingTutorState = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  // Determine if we should hide the floating tutor to prevent duplicates
  const shouldHide = location.pathname.includes('/adaptive-practice-test') || 
                   location.pathname.includes('/subject/') ||
                   location.pathname.includes('/auth');

  const isOnHomepage = location.pathname === '/';

  // Close the floating tutor when navigating to certain pages  
  useEffect(() => {
    if (shouldHide && isOpen) {
      setIsOpen(false);
    }
  }, [shouldHide, isOpen]);

  return {
    isOpen,
    setIsOpen,
    shouldHide,
    isOnHomepage
  };
};
