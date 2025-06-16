
import { useState, useCallback } from 'react';
import { useSpeechInitialization } from './useSpeechInitialization';
import { useSpeechQueue } from './useSpeechQueue';

export const useReliableSpeech = () => {
  const [autoReadEnabled, setAutoReadEnabled] = useState(true);
  const { isReady } = useSpeechInitialization();
  const { isSpeaking, addToQueue, stopSpeaking } = useSpeechQueue(autoReadEnabled);

  const speakText = useCallback((text: string, priority: boolean = false) => {
    addToQueue(text, priority);
  }, [addToQueue]);

  const toggleMute = useCallback(() => {
    const newState = !autoReadEnabled;
    console.log('🔊 Toggling Nelie speech to:', newState);
    setAutoReadEnabled(newState);
    
    if (!newState) {
      stopSpeaking();
    }
  }, [autoReadEnabled, stopSpeaking]);

  const testSpeech = useCallback(() => {
    if (typeof speechSynthesis !== 'undefined' && autoReadEnabled) {
      console.log('🧪 Testing speech synthesis...');
      speakText('Hello! I am Nelie, your AI learning companion! Can you hear me now?', true);
    }
  }, [autoReadEnabled, speakText]);

  return {
    isSpeaking,
    autoReadEnabled,
    speakText,
    stopSpeaking,
    toggleMute,
    testSpeech,
    isReady
  };
};
