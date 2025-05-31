
import { useNavigate, useLocation } from "react-router-dom";
import { useCallback } from "react";

export const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateToHome = useCallback(() => {
    if (location.pathname !== '/') {
      navigate('/');
    }
  }, [navigate, location.pathname]);

  const handleNavigation = useCallback((action: () => void) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        action();
      }, 100);
    } else {
      action();
    }
  }, [navigate, location.pathname]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return {
    navigateToHome,
    handleNavigation,
    scrollToTop,
    isHomePage: location.pathname === '/'
  };
};
