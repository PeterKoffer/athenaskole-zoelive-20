
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

interface UseAuthModalResult {
  showAuthModal: boolean;
  handleGetStarted: () => void;
  handleModalClose: () => void;
  handleLogin: () => void;
  setShowAuthModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export function useAuthModal(user: any) : UseAuthModalResult {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();

  const handleGetStarted = useCallback(() => {
    if (user) {
      navigate('/adventure');
    } else {
      setShowAuthModal(true);
    }
  }, [user, navigate]);

  const handleModalClose = useCallback(() => {
    setShowAuthModal(false);
  }, []);

  const handleLogin = useCallback(() => {
    setShowAuthModal(false);
    navigate('/adventure');
  }, [navigate]);

  return {
    showAuthModal,
    handleGetStarted,
    handleModalClose,
    handleLogin,
    setShowAuthModal
  };
}
