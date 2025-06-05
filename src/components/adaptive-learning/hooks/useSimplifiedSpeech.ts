
import { useState, useRef, useCallback, useEffect } from 'react';

export const useSimplifiedSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoReadEnabled, setAutoReadEnabled] = useState(false); // Start disabled
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const currentUtterance = useRef<SpeechSynthesisUtterance | null>(null);

  // Enable auto-read only after user interaction
  const enableSpeechWithUserInteraction = useCallback(() => {
    console.log('🎵 User interaction detected - enabling speech');
    setHasUserInteracted(true);
    setAutoReadEnabled(true);
  }, []);

  const stopSpeaking = useCallback(() => {
    console.log('🔇 Stopping speech');
    if (typeof speechSynthesis !== 'undefined') {
      speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    currentUtterance.current = null;
  }, []);

  const speakText = useCallback((text: string, priority: boolean = false) => {
    if (!text?.trim()) {
      console.log('🚫 Empty text provided');
      return;
    }

    if (!hasUserInteracted) {
      console.log('🚫 No user interaction yet - speech blocked for security');
      return;
    }

    if (!autoReadEnabled) {
      console.log('🚫 Auto-read disabled');
      return;
    }

    if (typeof speechSynthesis === 'undefined') {
      console.log('🚫 Speech synthesis not supported');
      return;
    }

    console.log('🔊 Speaking:', text.substring(0, 50));

    if (priority && isSpeaking) {
      stopSpeaking();
    }

    // Wait a moment after stopping before starting new speech
    setTimeout(() => {
      try {
        const utterance = new SpeechSynthesisUtterance(text);
        currentUtterance.current = utterance;
        
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        utterance.volume = 1.0;
        utterance.lang = 'en-US';

        // Try to get a female voice
        const voices = speechSynthesis.getVoices();
        const femaleVoice = voices.find(voice => 
          voice.lang.startsWith('en') && 
          (voice.name.includes('Female') || voice.name.includes('Zira') || voice.name.includes('Karen'))
        );
        
        if (femaleVoice) {
          utterance.voice = femaleVoice;
        }

        utterance.onstart = () => {
          console.log('✅ Speech started');
          setIsSpeaking(true);
        };

        utterance.onend = () => {
          console.log('🏁 Speech ended');
          setIsSpeaking(false);
          currentUtterance.current = null;
        };

        utterance.onerror = (event) => {
          console.error('🚫 Speech error:', event.error);
          setIsSpeaking(false);
          currentUtterance.current = null;
        };

        speechSynthesis.speak(utterance);
      } catch (error) {
        console.error('🚫 Error creating speech:', error);
      }
    }, priority ? 250 : 0);
  }, [hasUserInteracted, autoReadEnabled, isSpeaking, stopSpeaking]);

  const toggleMute = useCallback(() => {
    if (!hasUserInteracted) {
      // First toggle enables speech with user interaction
      enableSpeechWithUserInteraction();
      return;
    }
    
    const newState = !autoReadEnabled;
    console.log('🔊 Toggling speech to:', newState);
    setAutoReadEnabled(newState);
    
    if (!newState) {
      stopSpeaking();
    }
  }, [autoReadEnabled, hasUserInteracted, enableSpeechWithUserInteraction, stopSpeaking]);

  const testSpeech = useCallback(() => {
    if (!hasUserInteracted) {
      enableSpeechWithUserInteraction();
      setTimeout(() => {
        speakText('Hello! I am Nelie, your AI learning companion!', true);
      }, 100);
    } else {
      speakText('Hello! I am Nelie, your AI learning companion!', true);
    }
  }, [hasUserInteracted, enableSpeechWithUserInteraction, speakText]);

  return {
    isSpeaking,
    autoReadEnabled,
    hasUserInteracted,
    speakText,
    stopSpeaking,
    toggleMute,
    testSpeech,
    isReady: typeof speechSynthesis !== 'undefined'
  };
};
