

import { useNavigation } from "@/hooks/useNavigation";
import { useNavbarState } from "@/hooks/useNavbarState";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { useState } from "react";

interface NavbarLogicResult {
  handleShowProgress: () => void;
  handleShowGames: () => void;
  handleShowAITutor: () => void;
  handleShowInsights: () => void;
  handleBackToHome: () => void;
  state: ReturnType<typeof useNavbarState>["state"];
  resetState: ReturnType<typeof useNavbarState>["resetState"];
  setActiveView: ReturnType<typeof useNavbarState>["setActiveView"];
  showInsightsDashboard: boolean;
  setShowInsightsDashboard: React.Dispatch<React.SetStateAction<boolean>>;
}

export function useHomeNavbarLogic() : NavbarLogicResult {
  const { canAccessAIInsights } = useRoleAccess();
  const { scrollToTop } = useNavigation();
  
  const { state, resetState, setActiveView } = useNavbarState();
  const [showInsightsDashboard, setShowInsightsDashboard] = useState(false);

  const handleShowProgress = () => {
    setActiveView('showProgress');
    scrollToTop();
  };

  const handleShowGames = () => {
    setActiveView('showGames');
    scrollToTop();
  };

  const handleShowAITutor = () => {
    setActiveView('showAITutor');
    scrollToTop();
  };

  const handleShowInsights = () => {
    if (canAccessAIInsights()) {
      setShowInsightsDashboard(true);
      resetState();
      scrollToTop();
    }
  };

  const handleBackToHome = () => {
    resetState();
    setShowInsightsDashboard(false);
    scrollToTop();
  };

  return {
    handleShowProgress,
    handleShowGames,
    handleShowAITutor,
    handleShowInsights,
    handleBackToHome,
    state,
    resetState,
    setActiveView,
    showInsightsDashboard,
    setShowInsightsDashboard
  };
}
