
import { useState, useEffect, useCallback } from 'react';
import { unifiedSpeech } from '@/components/speech/UnifiedSpeechSystem';

export const useUnifiedSpeech = () => {
  const [speechState, setSpeechState] = useState(unifiedSpeech.getState());

  useEffect(() => {
    const unsubscribe = unifiedSpeech.subscribe(setSpeechState);
    return unsubscribe;
  }, []);

  const speak = useCallback(async (text: string, priority: boolean = false) => {
    await unifiedSpeech.speak(text, priority);
  }, []);

  const speakAsNelie = useCallback(async (text: string, priority: boolean = false) => {
    await unifiedSpeech.speakAsNelie(text, priority);
  }, []);

  const stop = useCallback(() => {
    unifiedSpeech.stop();
  }, []);

  const toggleEnabled = useCallback(() => {
    unifiedSpeech.toggleEnabled();
  }, []);

  const enableUserInteraction = useCallback(() => {
    unifiedSpeech.enableUserInteraction();
  }, []);

  const test = useCallback(async () => {
    await unifiedSpeech.test();
  }, []);

  return {
    // State
    isSpeaking: speechState.isSpeaking,
    isEnabled: speechState.isEnabled,
    hasUserInteracted: speechState.hasUserInteracted,
    isReady: speechState.isReady,
    
    // Actions
    speak,
    speakAsNelie,
    stop,
    toggleEnabled,
    enableUserInteraction,
    test,
    
    // Legacy compatibility
    autoReadEnabled: speechState.isEnabled,
    handleMuteToggle: toggleEnabled,
    speakText: speak,
    stopSpeaking: stop,
    testSpeech: test
  };
};
