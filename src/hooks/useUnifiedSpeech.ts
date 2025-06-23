
import { useState, useEffect } from 'react';

export const useUnifiedSpeech = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  const speakAsNelie = async (text: string, priority: boolean = false, context?: string): Promise<void> => {
    if (!isEnabled || !hasUserInteracted) return;
    
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

  // Alias for backward compatibility
  const speak = speakAsNelie;

  const stop = () => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const forceStopAll = () => {
    stop();
    // Additional cleanup for stubborn speech engines
    try {
      if (speechSynthesis) {
        speechSynthesis.resume();
        speechSynthesis.cancel();
      }
    } catch (error) {
      console.warn('Error during force stop cleanup:', error);
    }
  };

  const enableSpeech = () => {
    setIsEnabled(true);
    setHasUserInteracted(true);
  };

  const enableUserInteraction = () => {
    setHasUserInteracted(true);
  };

  const disableSpeech = () => setIsEnabled(false);

  const toggleEnabled = () => {
    if (!isEnabled) {
      enableSpeech();
    } else {
      disableSpeech();
      stop();
    }
  };

  const repeatSpeech = async (text: string, context?: string) => {
    await speakAsNelie(text, true, context);
  };

  useEffect(() => {
    // Check if speech synthesis is available
    if ('speechSynthesis' in window) {
      setIsEnabled(true);
    }

    // Enable user interaction on first user gesture
    const handleUserInteraction = () => {
      setHasUserInteracted(true);
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };

    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, []);

  return {
    isEnabled,
    isSpeaking,
    hasUserInteracted,
    isReady: hasUserInteracted,
    autoReadEnabled: isEnabled, // Alias for backward compatibility
    speakAsNelie,
    speak, // Alias for backward compatibility
    enableSpeech,
    enableUserInteraction,
    disableSpeech,
    stop,
    forceStopAll,
    toggleEnabled,
    repeatSpeech
  };
};
