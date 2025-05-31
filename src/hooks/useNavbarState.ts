
import { useState, useCallback } from "react";

export interface NavbarState {
  showProgress: boolean;
  showGames: boolean;
  showAITutor: boolean;
}

export const useNavbarState = () => {
  const [state, setState] = useState<NavbarState>({
    showProgress: false,
    showGames: false,
    showAITutor: false
  });

  const resetState = useCallback(() => {
    setState({
      showProgress: false,
      showGames: false,
      showAITutor: false
    });
  }, []);

  const setActiveView = useCallback((view: keyof NavbarState) => {
    setState({
      showProgress: view === 'showProgress',
      showGames: view === 'showGames',
      showAITutor: view === 'showAITutor'
    });
  }, []);

  return {
    state,
    resetState,
    setActiveView
  };
};
