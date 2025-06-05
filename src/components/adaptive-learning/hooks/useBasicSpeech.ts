
import { useState, useRef, useCallback } from 'react';

export const useBasicSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoReadEnabled, setAutoReadEnabled] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const currentUtterance = useRef<SpeechSynthesisUtterance | null>(null);

  const stopSpeaking = useCallback(() => {
    console.log('🛑 BASIC SPEECH - STOPPING');
    if (typeof speechSynthesis !== 'undefined') {
      speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    currentUtterance.current = null;
  }, []);

  const speakText = useCallback((text: string, priority: boolean = false) => {
    if (!text?.trim()) {
      console.log('❌ No text to speak');
      return;
    }

    if (!hasUserInteracted) {
      console.log('❌ User interaction required first');
      return;
    }

    if (!autoReadEnabled) {
      console.log('❌ Auto-read disabled');
      return;
    }

    console.log('🎤 BASIC SPEECH - SPEAKING:', text.substring(0, 50));

    // Always stop current speech first
    stopSpeaking();

    // Wait longer before starting new speech to prevent cancellation
    setTimeout(() => {
      try {
        const utterance = new SpeechSynthesisUtterance(text);
        currentUtterance.current = utterance;
        
        // Basic settings only
        utterance.rate = 0.8;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        utterance.lang = 'en-US';

        // Don't try to select specific voice - use default
        
        utterance.onstart = () => {
          console.log('✅ BASIC SPEECH STARTED');
          setIsSpeaking(true);
        };

        utterance.onend = () => {
          console.log('🏁 BASIC SPEECH FINISHED');
          setIsSpeaking(false);
          currentUtterance.current = null;
        };

        utterance.onerror = (event) => {
          console.error('❌ Basic speech error:', event.error);
          setIsSpeaking(false);
          currentUtterance.current = null;
        };

        // Start speaking immediately
        speechSynthesis.speak(utterance);

      } catch (error) {
        console.error('❌ Basic speech creation error:', error);
        setIsSpeaking(false);
      }
    }, 500); // Longer delay to prevent cancellation
  }, [hasUserInteracted, autoReadEnabled, stopSpeaking]);

  const enableSpeechWithInteraction = useCallback(() => {
    console.log('👆 BASIC SPEECH - USER INTERACTION');
    setHasUserInteracted(true);
    setAutoReadEnabled(true);
    
    // Test immediately with simple text
    setTimeout(() => {
      speakText('Hello! I am Nelie!', true);
    }, 300);
  }, [speakText]);

  const toggleMute = useCallback(() => {
    if (!hasUserInteracted) {
      enableSpeechWithInteraction();
      return;
    }
    
    const newState = !autoReadEnabled;
    console.log('🔊 BASIC SPEECH TOGGLE:', newState ? 'ON' : 'OFF');
    setAutoReadEnabled(newState);
    
    if (!newState) {
      stopSpeaking();
    }
  }, [hasUserInteracted, autoReadEnabled, enableSpeechWithInteraction, stopSpeaking]);

  const testSpeech = useCallback(() => {
    console.log('🧪 BASIC SPEECH TEST');
    if (!hasUserInteracted) {
      enableSpeechWithInteraction();
    } else {
      speakText('This is a test of the basic speech system', true);
    }
  }, [hasUserInteracted, enableSpeechWithInteraction, speakText]);

  const isReady = typeof speechSynthesis !== 'undefined';

  return {
    isSpeaking,
    autoReadEnabled,
    hasUserInteracted,
    isReady,
    speakText,
    stopSpeaking,
    toggleMute,
    testSpeech
  };
};
