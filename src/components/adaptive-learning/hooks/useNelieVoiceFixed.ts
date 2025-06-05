
import { useState, useRef, useCallback, useEffect } from 'react';

export const useNelieVoiceFixed = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoReadEnabled, setAutoReadEnabled] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [isReady, setIsReady] = useState(false);
  
  const currentUtterance = useRef<SpeechSynthesisUtterance | null>(null);
  const speechTimeout = useRef<NodeJS.Timeout | null>(null);
  const retryCount = useRef(0);

  // Initialize speech system
  useEffect(() => {
    const initSpeech = () => {
      if (typeof speechSynthesis === 'undefined') {
        console.log('❌ Speech synthesis not supported');
        return;
      }

      // Force load voices
      const voices = speechSynthesis.getVoices();
      console.log('🎵 Nelie Voice System - Voices found:', voices.length);
      
      if (voices.length > 0) {
        setIsReady(true);
        console.log('✅ Nelie Voice System Ready');
      } else {
        // Wait for voices to load
        setTimeout(initSpeech, 100);
      }
    };

    initSpeech();
    
    if (typeof speechSynthesis !== 'undefined') {
      speechSynthesis.addEventListener('voiceschanged', initSpeech);
      return () => speechSynthesis.removeEventListener('voiceschanged', initSpeech);
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    console.log('🛑 STOPPING ALL SPEECH');
    
    if (speechTimeout.current) {
      clearTimeout(speechTimeout.current);
      speechTimeout.current = null;
    }
    
    if (typeof speechSynthesis !== 'undefined') {
      speechSynthesis.cancel();
    }
    
    setIsSpeaking(false);
    currentUtterance.current = null;
    retryCount.current = 0;
  }, []);

  const getBestVoice = useCallback(() => {
    if (typeof speechSynthesis === 'undefined') return null;
    
    const voices = speechSynthesis.getVoices();
    if (voices.length === 0) return null;

    // Look for good female English voices
    const priorities = [
      'Google UK English Female',
      'Microsoft Zira - English (United States)',
      'Karen',
      'Samantha'
    ];

    for (const priority of priorities) {
      const voice = voices.find(v => v.name.includes(priority));
      if (voice) {
        console.log('🎵 Using priority voice:', voice.name);
        return voice;
      }
    }
    
    // Fallback to any English voice
    const englishVoice = voices.find(voice => voice.lang.startsWith('en'));
    if (englishVoice) {
      console.log('🎵 Using English voice:', englishVoice.name);
      return englishVoice;
    }
    
    console.log('🎵 Using first available voice:', voices[0]?.name);
    return voices[0] || null;
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

    if (!isReady) {
      console.log('❌ Speech system not ready');
      return;
    }

    console.log('🎤 NELIE WILL SPEAK:', text.substring(0, 50) + '...');

    // Always stop current speech first
    stopSpeaking();

    // Wait a bit before starting new speech to prevent cancellation
    speechTimeout.current = setTimeout(() => {
      try {
        const utterance = new SpeechSynthesisUtterance(text);
        currentUtterance.current = utterance;
        
        // Configure voice
        utterance.rate = 0.8;
        utterance.pitch = 1.1;
        utterance.volume = 1.0;
        utterance.lang = 'en-US';

        const voice = getBestVoice();
        if (voice) {
          utterance.voice = voice;
        }

        let hasStarted = false;

        utterance.onstart = () => {
          console.log('✅ NELIE STARTED SPEAKING');
          hasStarted = true;
          setIsSpeaking(true);
          retryCount.current = 0;
        };

        utterance.onend = () => {
          console.log('🏁 NELIE FINISHED SPEAKING');
          setIsSpeaking(false);
          currentUtterance.current = null;
        };

        utterance.onerror = (event) => {
          console.error('❌ Speech error:', event.error);
          
          // Retry once if it was canceled and we haven't started yet
          if (event.error === 'canceled' && !hasStarted && retryCount.current < 1) {
            retryCount.current++;
            console.log('🔄 Retrying speech...');
            setTimeout(() => {
              speechSynthesis.speak(utterance);
            }, 500);
          } else {
            setIsSpeaking(false);
            currentUtterance.current = null;
          }
        };

        // Start speaking
        speechSynthesis.speak(utterance);
        
        // Backup state update
        setTimeout(() => {
          if (speechSynthesis.speaking && !isSpeaking) {
            console.log('🔄 Backup state update');
            setIsSpeaking(true);
          }
        }, 300);

      } catch (error) {
        console.error('❌ Speech creation error:', error);
        setIsSpeaking(false);
      }
    }, 200);
  }, [hasUserInteracted, autoReadEnabled, isReady, getBestVoice, stopSpeaking, isSpeaking]);

  const enableSpeechWithInteraction = useCallback(() => {
    console.log('👆 USER INTERACTION - ENABLING SPEECH');
    setHasUserInteracted(true);
    setAutoReadEnabled(true);
    
    // Test immediately
    setTimeout(() => {
      speakText('Hello! I am Nelie, your AI learning companion! Can you hear me now?', true);
    }, 100);
  }, [speakText]);

  const toggleMute = useCallback(() => {
    if (!hasUserInteracted) {
      enableSpeechWithInteraction();
      return;
    }
    
    const newState = !autoReadEnabled;
    console.log('🔊 VOICE TOGGLE:', newState ? 'ON' : 'OFF');
    setAutoReadEnabled(newState);
    
    if (!newState) {
      stopSpeaking();
    }
  }, [hasUserInteracted, autoReadEnabled, enableSpeechWithInteraction, stopSpeaking]);

  const testSpeech = useCallback(() => {
    console.log('🧪 TEST SPEECH BUTTON CLICKED');
    if (!hasUserInteracted) {
      enableSpeechWithInteraction();
    } else {
      speakText('This is a test of Nelie voice system. Hello from Nelie!', true);
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
