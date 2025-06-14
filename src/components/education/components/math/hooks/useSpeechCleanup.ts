
import { useEffect, useRef } from 'react';

export const useSpeechCleanup = (stopSpeaking: () => void) => {
  const cleanupRef = useRef(stopSpeaking);
  
  // Update the ref when stopSpeaking changes
  useEffect(() => {
    cleanupRef.current = stopSpeaking;
  }, [stopSpeaking]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      console.log('🔇 [SpeechCleanup] Page unload - stopping Nelie speech');
      cleanupRef.current();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log('🔇 [SpeechCleanup] Page hidden - stopping Nelie speech');
        cleanupRef.current();
      }
    };

    const handlePopState = () => {
      console.log('🔇 [SpeechCleanup] Navigation detected - stopping Nelie speech');
      cleanupRef.current();
    };

    const handleFocus = () => {
      if (document.hasFocus()) {
        console.log('🔇 [SpeechCleanup] Page lost focus - stopping Nelie speech');
        cleanupRef.current();
      }
    };

    // Enhanced cleanup listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('blur', handleFocus);

    // Cleanup on component unmount
    return () => {
      console.log('🔇 [SpeechCleanup] Component unmounting - stopping Nelie speech');
      cleanupRef.current();
      
      // Remove all listeners
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('blur', handleFocus);
    };
  }, []); // Empty dependency array since we use ref
};
