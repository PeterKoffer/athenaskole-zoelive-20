
import { useState, useRef, useCallback, useEffect } from 'react';

export const useSimplifiedSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoReadEnabled, setAutoReadEnabled] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const currentUtterance = useRef<SpeechSynthesisUtterance | null>(null);
  const initTimeout = useRef<NodeJS.Timeout>();

  // Initialize speech synthesis
  useEffect(() => {
    const initSpeech = () => {
      if (typeof speechSynthesis !== 'undefined') {
        // Force load voices
        const voices = speechSynthesis.getVoices();
        console.log('🎵 Speech voices available:', voices.length);
        
        if (voices.length > 0) {
          setIsReady(true);
          console.log('✅ Speech system ready');
        } else {
          // Retry after a delay
          initTimeout.current = setTimeout(initSpeech, 1000);
        }
      }
    };

    initSpeech();

    // Listen for voices changed event
    const handleVoicesChanged = () => {
      console.log('🔄 Voices changed');
      initSpeech();
    };

    if (typeof speechSynthesis !== 'undefined') {
      speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
      
      return () => {
        speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
        if (initTimeout.current) {
          clearTimeout(initTimeout.current);
        }
      };
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    console.log('🔇 Stopping speech');
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
    const femaleVoices = voices.filter(voice => 
      voice.lang.startsWith('en') && 
      (voice.name.toLowerCase().includes('female') || 
       voice.name.toLowerCase().includes('karen') ||
       voice.name.toLowerCase().includes('samantha') ||
       voice.name.toLowerCase().includes('victoria'))
    );

    if (femaleVoices.length > 0) {
      console.log('🎵 Using female voice:', femaleVoices[0].name);
      return femaleVoices[0];
    }

    // Fallback to any English voice
    const englishVoice = voices.find(voice => voice.lang.startsWith('en'));
    if (englishVoice) {
      console.log('🎵 Using English voice:', englishVoice.name);
      return englishVoice;
    }

    // Last resort
    console.log('🎵 Using default voice:', voices[0].name);
    return voices[0];
  }, []);

  const speakText = useCallback((text: string, priority: boolean = false) => {
    if (!text || !autoReadEnabled || typeof speechSynthesis === 'undefined') {
      console.log('🚫 Cannot speak:', { text: !!text, autoReadEnabled, speechSynthesis: typeof speechSynthesis });
      return;
    }

    console.log('🔊 NELIE SPEAKING:', text.substring(0, 50) + '...');

    // Stop any current speech
    if (priority) {
      stopSpeaking();
    }

    // Wait a moment before starting new speech
    setTimeout(() => {
      try {
        const utterance = new SpeechSynthesisUtterance(text);
        currentUtterance.current = utterance;

        // Configure utterance
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        utterance.volume = 1.0;

        // Set voice
        const voice = getBestVoice();
        if (voice) {
          utterance.voice = voice;
        }

        // Event handlers
        utterance.onstart = () => {
          console.log('🎤 Speech started');
          setIsSpeaking(true);
        };

        utterance.onend = () => {
          console.log('🏁 Speech ended');
          setIsSpeaking(false);
          currentUtterance.current = null;
        };

        utterance.onerror = (event) => {
          console.error('🚫 Speech error:', event);
          setIsSpeaking(false);
          currentUtterance.current = null;
        };

        // Start speaking
        speechSynthesis.speak(utterance);

        // Fallback check
        setTimeout(() => {
          if (currentUtterance.current === utterance && !isSpeaking) {
            console.warn('⚠️ Speech may have failed to start');
            setIsSpeaking(false);
          }
        }, 1000);

      } catch (error) {
        console.error('🚫 Speech error:', error);
        setIsSpeaking(false);
      }
    }, priority ? 100 : 500);
  }, [autoReadEnabled, getBestVoice, stopSpeaking, isSpeaking]);

  const toggleMute = useCallback(() => {
    const newState = !autoReadEnabled;
    console.log('🔊 Toggling speech to:', newState);
    setAutoReadEnabled(newState);
    
    if (!newState) {
      stopSpeaking();
    }
  }, [autoReadEnabled, stopSpeaking]);

  const testSpeech = useCallback(() => {
    if (isReady && autoReadEnabled) {
      console.log('🧪 Testing speech...');
      speakText('Hello! I am Nelie, your AI learning companion. Can you hear me now?', true);
    } else {
      console.log('🧪 Speech test failed - not ready or muted', { isReady, autoReadEnabled });
    }
  }, [isReady, autoReadEnabled, speakText]);

  return {
    isSpeaking,
    autoReadEnabled,
    isReady,
    speakText,
    stopSpeaking,
    toggleMute,
    testSpeech
  };
};
