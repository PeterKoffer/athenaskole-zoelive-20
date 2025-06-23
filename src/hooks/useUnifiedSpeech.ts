
import { useState, useEffect } from 'react';

export const useUnifiedSpeech = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speakAsNelie = async (text: string, queue: boolean = true): Promise<void> => {
    if (!isEnabled) return;
    
    setIsSpeaking(true);
    try {
      // Mock implementation using browser's speech synthesis
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;
      
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Error in speech synthesis:', error);
      setIsSpeaking(false);
    }
  };

  const enableSpeech = () => setIsEnabled(true);
  const disableSpeech = () => setIsEnabled(false);

  useEffect(() => {
    // Check if speech synthesis is available
    if ('speechSynthesis' in window) {
      setIsEnabled(true);
    }
  }, []);

  return {
    isEnabled,
    isSpeaking,
    speakAsNelie,
    enableSpeech,
    disableSpeech
  };
};
