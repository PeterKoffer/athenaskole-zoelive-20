
import { useState, useRef, useCallback, useEffect } from 'react';

export const useReliableNelieSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoReadEnabled, setAutoReadEnabled] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [isReady, setIsReady] = useState(false);
  
  const currentUtterance = useRef<SpeechSynthesisUtterance | null>(null);
  const speechTimeout = useRef<NodeJS.Timeout | null>(null);
  const isInitialized = useRef(false);

  // Initialize speech system
  useEffect(() => {
    const initSpeech = () => {
      if (typeof speechSynthesis === 'undefined') {
        console.log('🚫 Speech synthesis not supported');
        return;
      }

      const voices = speechSynthesis.getVoices();
      console.log('🎵 Nelie Speech - Available voices:', voices.length);
      
      if (voices.length > 0 && !isInitialized.current) {
        setIsReady(true);
        isInitialized.current = true;
        console.log('✅ Nelie Speech System Ready');
      }
    };

    initSpeech();
    
    if (typeof speechSynthesis !== 'undefined') {
      speechSynthesis.addEventListener('voiceschanged', initSpeech);
      return () => speechSynthesis.removeEventListener('voiceschanged', initSpeech);
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    console.log('🔇 Nelie - Force stopping all speech');
    
    if (speechTimeout.current) {
      clearTimeout(speechTimeout.current);
      speechTimeout.current = null;
    }
    
    if (typeof speechSynthesis !== 'undefined') {
      speechSynthesis.cancel();
    }
    
    setIsSpeaking(false);
    currentUtterance.current = null;
  }, []);

  const getBestVoice = useCallback(() => {
    if (typeof speechSynthesis === 'undefined') return null;
    
    const voices = speechSynthesis.getVoices();
    if (voices.length === 0) return null;

    // Look for female English voices
    const femaleVoice = voices.find(voice => 
      voice.lang.startsWith('en') && 
      (voice.name.toLowerCase().includes('female') ||
       voice.name.toLowerCase().includes('karen') ||
       voice.name.toLowerCase().includes('zira') ||
       voice.name.toLowerCase().includes('samantha'))
    );
    
    if (femaleVoice) {
      console.log('🎵 Nelie using voice:', femaleVoice.name);
      return femaleVoice;
    }
    
    // Fallback to any English voice
    const englishVoice = voices.find(voice => voice.lang.startsWith('en'));
    if (englishVoice) {
      console.log('🎵 Nelie fallback voice:', englishVoice.name);
      return englishVoice;
    }
    
    console.log('🎵 Nelie using first available voice:', voices[0]?.name);
    return voices[0] || null;
  }, []);

  const speakText = useCallback((text: string, priority: boolean = false) => {
    if (!text?.trim()) {
      console.log('🚫 Nelie - Empty text provided');
      return;
    }

    if (!hasUserInteracted) {
      console.log('🚫 Nelie - User interaction required first');
      return;
    }

    if (!autoReadEnabled) {
      console.log('🚫 Nelie - Auto-read disabled');
      return;
    }

    if (!isReady) {
      console.log('🚫 Nelie - Speech system not ready');
      return;
    }

    console.log('🔊 NELIE SPEAKING:', text.substring(0, 50) + '...');

    // Stop any current speech
    stopSpeaking();

    // Wait a moment to ensure previous speech is fully stopped
    speechTimeout.current = setTimeout(() => {
      try {
        const utterance = new SpeechSynthesisUtterance(text);
        currentUtterance.current = utterance;
        
        // Configure voice settings
        utterance.rate = 0.85;
        utterance.pitch = 1.1;
        utterance.volume = 1.0;
        utterance.lang = 'en-US';

        // Set voice
        const voice = getBestVoice();
        if (voice) {
          utterance.voice = voice;
        }

        // Event handlers
        utterance.onstart = () => {
          console.log('✅ Nelie started speaking successfully');
          setIsSpeaking(true);
        };

        utterance.onend = () => {
          console.log('🏁 Nelie finished speaking');
          setIsSpeaking(false);
          currentUtterance.current = null;
        };

        utterance.onerror = (event) => {
          console.error('🚫 Nelie speech error:', event.error);
          setIsSpeaking(false);
          currentUtterance.current = null;
        };

        // Start speaking
        speechSynthesis.speak(utterance);
        
        // Backup check - force update state if needed
        setTimeout(() => {
          if (currentUtterance.current === utterance && speechSynthesis.speaking && !isSpeaking) {
            console.log('📢 Nelie - Detected speaking, updating state');
            setIsSpeaking(true);
          }
        }, 200);

      } catch (error) {
        console.error('🚫 Nelie speech creation error:', error);
        setIsSpeaking(false);
      }
    }, 100);
  }, [hasUserInteracted, autoReadEnabled, isReady, getBestVoice, stopSpeaking, isSpeaking]);

  const enableSpeechWithInteraction = useCallback(() => {
    console.log('🎵 Nelie - User interaction detected, enabling speech');
    setHasUserInteracted(true);
    setAutoReadEnabled(true);
    
    // Test speech immediately
    setTimeout(() => {
      speakText('Hello! I am Nelie, your friendly AI learning companion!', true);
    }, 200);
  }, [speakText]);

  const toggleMute = useCallback(() => {
    if (!hasUserInteracted) {
      enableSpeechWithInteraction();
      return;
    }
    
    const newState = !autoReadEnabled;
    console.log('🔊 Nelie voice toggle:', newState ? 'ENABLED' : 'DISABLED');
    setAutoReadEnabled(newState);
    
    if (!newState) {
      stopSpeaking();
    }
  }, [hasUserInteracted, autoReadEnabled, enableSpeechWithInteraction, stopSpeaking]);

  const testSpeech = useCallback(() => {
    if (!hasUserInteracted) {
      enableSpeechWithInteraction();
    } else {
      speakText('Hello! I am Nelie, your AI learning companion! Can you hear me clearly?', true);
    }
  }, [hasUserInteracted, enableSpeechWithInteraction, speakText]);

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
