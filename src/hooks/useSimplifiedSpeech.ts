import { useState, useCallback, useEffect } from 'react';

export const useSimplifiedSpeech = () => {
  const [autoReadEnabled, setAutoReadEnabled] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    // Check if speech synthesis is available
    if ('speechSynthesis' in window) {
      setIsReady(true);
    }
  }, []);

  const speakText = useCallback((text: string, priority: boolean = true) => {
    if ('speechSynthesis' in window) {
      if (priority) {
        speechSynthesis.cancel();
      }
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 0.8;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      speechSynthesis.speak(utterance);
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const testSpeech = useCallback(() => {
    speakText("Testing speech functionality");
  }, [speakText]);

  return {
    autoReadEnabled,
    setAutoReadEnabled,
    speakText,
    stopSpeaking,
    isReady,
    isSpeaking,
    testSpeech
  };
};