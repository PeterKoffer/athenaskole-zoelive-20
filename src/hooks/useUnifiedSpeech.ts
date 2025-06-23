
import { useState, useEffect, useCallback } from 'react';
import { unifiedSpeech } from '@/components/speech/UnifiedSpeechSystem';

export const useUnifiedSpeech = () => {
  const [speechState, setSpeechState] = useState(unifiedSpeech.getState());

  useEffect(() => {
    const unsubscribe = unifiedSpeech.subscribe(setSpeechState);
    return unsubscribe;
  }, []);

  const speak = useCallback(async (text: string, priority: boolean = false, context?: string) => {
    await unifiedSpeech.speak(text, priority, context);
  }, []);

  const speakAsNelie = useCallback(async (text: string, priority: boolean = false, context?: string) => {
    await unifiedSpeech.speakAsNelie(text, priority, context);
  }, []);

  const repeatSpeech = useCallback(async (text: string, context?: string) => {
    await unifiedSpeech.repeatLastSpeech(text, context);
  }, []);

  const stop = useCallback(() => {
    unifiedSpeech.stop();
  }, []);

  const forceStopAll = useCallback(() => {
    unifiedSpeech.forceStopAll();
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

  const clearSpokenContent = useCallback(() => {
    unifiedSpeech.clearSpokenContent();
  }, []);

  return {
    // State
    isSpeaking: speechState.isSpeaking,
    isEnabled: speechState.isEnabled,
    hasUserInteracted: speechState.hasUserInteracted,
    isReady: speechState.isReady,
    lastError: speechState.lastError,
    isLoading: speechState.isLoading,
    isCheckingElevenLabs: speechState.isCheckingElevenLabs,

    // Actions
    speak,
    speakAsNelie,
    repeatSpeech,
    stop,
    forceStopAll,
    toggleEnabled,
    enableUserInteraction,
    test,
    clearSpokenContent,

    // Legacy compatibility
    autoReadEnabled: speechState.isEnabled,
    handleMuteToggle: toggleEnabled,
    speakText: speak,
    stopSpeaking: stop,
    testSpeech: test
  };
};
