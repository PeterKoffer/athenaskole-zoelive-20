
import { useState, useEffect, useCallback, useRef } from 'react';

interface SpeechState {
  isSpeaking: boolean;
  isEnabled: boolean;
  hasUserInteracted: boolean;
  isReady: boolean;
  lastError: string | null;
  isLoading: boolean;
}

export const useConsolidatedSpeech = () => {
  const [speechState, setSpeechState] = useState<SpeechState>({
    isSpeaking: false,
    isEnabled: false,
    hasUserInteracted: false,
    isReady: true,
    lastError: null,
    isLoading: false
  });

  const currentUtterance = useRef<SpeechSynthesisUtterance | null>(null);
  const isInitialized = useRef(false);

  // Initialize speech synthesis
  useEffect(() => {
    if (!isInitialized.current && 'speechSynthesis' in window) {
      isInitialized.current = true;
      setSpeechState(prev => ({ ...prev, isReady: true }));
    }
  }, []);

  const speak = useCallback(async (text: string, priority: boolean = false) => {
    if (!text.trim()) return;

    try {
      // Stop current speech if priority or if already speaking
      if (currentUtterance.current || priority) {
        window.speechSynthesis.cancel();
        currentUtterance.current = null;
      }

      setSpeechState(prev => ({ ...prev, isSpeaking: true, lastError: null }));

      const utterance = new SpeechSynthesisUtterance(text);
      currentUtterance.current = utterance;

      // Configure voice settings
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;

      // Set up event handlers
      utterance.onend = () => {
        setSpeechState(prev => ({ ...prev, isSpeaking: false }));
        currentUtterance.current = null;
      };

      utterance.onerror = (event) => {
        setSpeechState(prev => ({ 
          ...prev, 
          isSpeaking: false, 
          lastError: `Speech error: ${event.error}` 
        }));
        currentUtterance.current = null;
      };

      // Start speaking
      window.speechSynthesis.speak(utterance);

    } catch (error) {
      setSpeechState(prev => ({ 
        ...prev, 
        isSpeaking: false, 
        lastError: error instanceof Error ? error.message : 'Speech failed' 
      }));
    }
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    currentUtterance.current = null;
    setSpeechState(prev => ({ ...prev, isSpeaking: false }));
  }, []);

  const toggleEnabled = useCallback(() => {
    setSpeechState(prev => ({ 
      ...prev, 
      isEnabled: !prev.isEnabled,
      hasUserInteracted: true 
    }));
  }, []);

  const enableUserInteraction = useCallback(() => {
    setSpeechState(prev => ({ 
      ...prev, 
      hasUserInteracted: true,
      isEnabled: true 
    }));
  }, []);

  const test = useCallback(async () => {
    if (!speechState.hasUserInteracted) {
      enableUserInteraction();
    }
    await speak("Hello! This is Nelie, your AI learning companion. I'm ready to help you learn!", true);
  }, [speechState.hasUserInteracted, enableUserInteraction, speak]);

  return {
    // State
    isSpeaking: speechState.isSpeaking,
    isEnabled: speechState.isEnabled,
    hasUserInteracted: speechState.hasUserInteracted,
    isReady: speechState.isReady,
    lastError: speechState.lastError,
    isLoading: speechState.isLoading,
    
    // Actions
    speak,
    stop,
    toggleEnabled,
    enableUserInteraction,
    test
  };
};
