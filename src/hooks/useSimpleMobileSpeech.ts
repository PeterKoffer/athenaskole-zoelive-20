
import { useState, useCallback, useEffect, useRef } from 'react';

export const useSimpleMobileSpeech = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const lastSpokenRef = useRef<string>('');
  const lastSpokenTimeRef = useRef<number>(0);

  // Initialize speech system
  useEffect(() => {
    const initSpeech = () => {
      if ('speechSynthesis' in window) {
        // Wait for voices to load
        const voices = speechSynthesis.getVoices();
        if (voices.length > 0) {
          setIsReady(true);
        } else {
          speechSynthesis.addEventListener('voiceschanged', () => {
            setIsReady(true);
          });
        }
      }
    };

    initSpeech();

    // Enable on any user interaction
    const enableInteraction = () => {
      setHasUserInteracted(true);
      console.log('✅ User interaction enabled for speech');
    };

    document.addEventListener('click', enableInteraction, { once: true });
    document.addEventListener('touchstart', enableInteraction, { once: true });

    return () => {
      document.removeEventListener('click', enableInteraction);
      document.removeEventListener('touchstart', enableInteraction);
    };
  }, []);

  const speak = useCallback((text: string, priority: boolean = false) => {
    if (!text || !isEnabled || !hasUserInteracted || !isReady) {
      console.log('🚫 Speech conditions not met:', { text: !!text, isEnabled, hasUserInteracted, isReady });
      return;
    }

    // Prevent speaking the same text too quickly
    const now = Date.now();
    if (text === lastSpokenRef.current && (now - lastSpokenTimeRef.current) < 3000) {
      console.log('🚫 Preventing duplicate speech');
      return;
    }

    console.log('🔊 Speaking:', text.substring(0, 50) + '...');
    
    if (priority) {
      speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85;
    utterance.pitch = 1.1;
    utterance.volume = 0.9;

    // Try to use a better voice
    const voices = speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.lang.startsWith('en') && 
      (voice.name.includes('Google') || voice.name.includes('Female'))
    ) || voices.find(voice => voice.lang.startsWith('en'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      lastSpokenRef.current = text;
      lastSpokenTimeRef.current = now;
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      console.error('❌ Speech error');
    };

    speechSynthesis.speak(utterance);
  }, [isEnabled, hasUserInteracted, isReady]);

  const stop = useCallback(() => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  const toggleEnabled = useCallback(() => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    if (!newState) {
      stop();
    }
    console.log(newState ? '🔊 Speech enabled' : '🔇 Speech disabled');
  }, [isEnabled, stop]);

  const enableUserInteraction = useCallback(() => {
    setHasUserInteracted(true);
  }, []);

  return {
    isEnabled,
    isSpeaking,
    isReady,
    hasUserInteracted,
    speak,
    stop,
    toggleEnabled,
    enableUserInteraction
  };
};
