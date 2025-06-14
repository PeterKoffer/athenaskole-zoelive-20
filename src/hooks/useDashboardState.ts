
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigation } from "@/hooks/useNavigation";
import { useHomeNavbarLogic } from "./useHomeNavbarLogic";

export function useDashboardState() {
  const { scrollToTop } = useNavigation();
  const location = useLocation();
  const {
    state,
    showInsightsDashboard,
    setShowInsightsDashboard,
    resetState
  } = useHomeNavbarLogic();

  // Always start at homepage - reset state when component mounts
  useEffect(() => {
    resetState();
    scrollToTop();
    // eslint-disable-next-line
  }, []);

  // Scroll to top when page loads or navigation state changes
  useEffect(() => {
    scrollToTop();
    // eslint-disable-next-line
  }, [location.pathname, state.showProgress, state.showGames, state.showAITutor, showInsightsDashboard]);

  // Additional scroll to top specifically for AI tutor
  useEffect(() => {
    if (state.showAITutor) {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
    // eslint-disable-next-line
  }, [state.showAITutor]);

  return {
    state,
    showInsightsDashboard,
    setShowInsightsDashboard,
    resetState
  };
}
