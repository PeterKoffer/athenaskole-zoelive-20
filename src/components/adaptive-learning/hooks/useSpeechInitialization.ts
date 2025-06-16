
import { useState, useRef, useEffect } from 'react';

export const useSpeechInitialization = () => {
  const hasInitialized = useRef(false);
  const initializationAttempts = useRef(0);

  // Enhanced speech synthesis initialization with retry logic
  useEffect(() => {
    const initializeSpeech = () => {
      if (typeof speechSynthesis !== 'undefined' && !hasInitialized.current) {
        try {
          // Cancel any existing speech
          speechSynthesis.cancel();
          
          // Force load voices
          const voices = speechSynthesis.getVoices();
          console.log('🎵 Speech synthesis initialized with', voices.length, 'voices');
          
          if (voices.length > 0 || initializationAttempts.current > 3) {
            hasInitialized.current = true;
            console.log('✅ Speech synthesis is ready');
          } else {
            initializationAttempts.current++;
            // Retry initialization
            setTimeout(initializeSpeech, 1000);
          }
        } catch (error) {
          console.error('❌ Speech initialization error:', error);
        }
      }
    };

    // Initialize immediately
    initializeSpeech();
    
    // Listen for voices changed event
    if (typeof speechSynthesis !== 'undefined') {
      const handleVoicesChanged = () => {
        console.log('🔄 Voices changed, reinitializing...');
        hasInitialized.current = false;
        initializeSpeech();
      };
      
      speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
      
      return () => {
        speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
      };
    }
  }, []);

  return {
    isReady: typeof speechSynthesis !== 'undefined' && hasInitialized.current
  };
};
