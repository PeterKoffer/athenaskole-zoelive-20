
import { useEffect, useCallback } from 'react';

interface UseFreshSessionManagerProps {
  onNewSession: () => void;
}

export const useFreshSessionManager = ({ onNewSession }: UseFreshSessionManagerProps) => {
  const SESSION_KEY = 'math_session_timestamp';
  
  const getCurrentSession = () => {
    return sessionStorage.getItem(SESSION_KEY);
  };
  
  const isNewSession = useCallback(() => {
    const currentTime = Date.now().toString();
    const lastSession = getCurrentSession();
    
    // If no previous session or more than 5 minutes passed, it's a new session
    if (!lastSession || (Date.now() - parseInt(lastSession)) > 300000) {
      sessionStorage.setItem(SESSION_KEY, currentTime);
      return true;
    }
    
    return false;
  }, []);
  
  const markNewSession = useCallback(() => {
    const currentTime = Date.now().toString();
    sessionStorage.setItem(SESSION_KEY, currentTime);
    console.log('🆕 Marked as new session, all content will be fresh');
    onNewSession();
  }, [onNewSession]);
  
  // Check for new session on mount
  useEffect(() => {
    if (isNewSession()) {
      console.log('🆕 Detected new session - generating fresh content');
      onNewSession();
    }
  }, [isNewSession, onNewSession]);
  
  return {
    isNewSession,
    markNewSession,
    getCurrentSession
  };
};
