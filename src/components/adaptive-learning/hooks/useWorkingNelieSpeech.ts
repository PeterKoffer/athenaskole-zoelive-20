
import { useState, useRef, useCallback, useEffect } from 'react';

export const useWorkingNelieSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoReadEnabled, setAutoReadEnabled] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [isReady, setIsReady] = useState(false);
  
  const currentUtterance = useRef<SpeechSynthesisUtterance | null>(null);
  const speechQueue = useRef<string[]>([]);
  const isProcessing = useRef(false);

  // Initialize speech system
  useEffect(() => {
    const initSpeech = () => {
      if (typeof speechSynthesis === 'undefined') {
        console.log('❌ Speech synthesis not supported');
        return;
      }

      // Force cancel any existing speech
      speechSynthesis.cancel();
      
      const voices = speechSynthesis.getVoices();
      console.log('🎵 Working Nelie Speech - Voices found:', voices.length);
      
      if (voices.length > 0) {
        setIsReady(true);
        console.log('✅ Working Nelie Speech Ready');
      }
    };

    initSpeech();
    
    if (typeof speechSynthesis !== 'undefined') {
      speechSynthesis.addEventListener('voiceschanged', initSpeech);
      return () => {
        speechSynthesis.removeEventListener('voiceschanged', initSpeech);
        speechSynthesis.cancel();
      };
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    console.log('🛑 WORKING NELIE - STOPPING ALL SPEECH');
    
    if (typeof speechSynthesis !== 'undefined') {
      speechSynthesis.cancel();
    }
    
    setIsSpeaking(false);
    currentUtterance.current = null;
    speechQueue.current = [];
    isProcessing.current = false;
  }, []);

  const getBestVoice = useCallback(() => {
    if (typeof speechSynthesis === 'undefined') return null;
    
    const voices = speechSynthesis.getVoices();
    if (voices.length === 0) return null;

    // Look for good female English voices
    const priorities = [
      'Google UK English Female',
      'Microsoft Zira',
      'Samantha',
      'Karen'
    ];

    for (const priority of priorities) {
      const voice = voices.find(v => v.name.includes(priority));
      if (voice) {
        console.log('🎵 Using voice:', voice.name);
        return voice;
      }
    }
    
    // Fallback to any English voice
    const englishVoice = voices.find(voice => voice.lang.startsWith('en'));
    return englishVoice || voices[0] || null;
  }, []);

  const processQueue = useCallback(() => {
    if (isProcessing.current || speechQueue.current.length === 0) {
      return;
    }

    const text = speechQueue.current.shift();
    if (!text || !hasUserInteracted || !autoReadEnabled || !isReady) {
      isProcessing.current = false;
      return;
    }

    console.log('🎤 WORKING NELIE SPEAKING:', text.substring(0, 50) + '...');
    isProcessing.current = true;

    try {
      // Force stop any existing speech
      speechSynthesis.cancel();
      
      // Wait a moment for cancellation to complete
      setTimeout(() => {
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

        utterance.onstart = () => {
          console.log('✅ WORKING NELIE STARTED');
          setIsSpeaking(true);
        };

        utterance.onend = () => {
          console.log('🏁 WORKING NELIE FINISHED');
          setIsSpeaking(false);
          currentUtterance.current = null;
          isProcessing.current = false;
          
          // Process next item after a delay
          setTimeout(() => {
            processQueue();
          }, 200);
        };

        utterance.onerror = (event) => {
          console.error('❌ Working speech error:', event.error);
          setIsSpeaking(false);
          currentUtterance.current = null;
          isProcessing.current = false;
          
          // Try next item
          setTimeout(() => {
            processQueue();
          }, 500);
        };

        // Start speaking
        speechSynthesis.speak(utterance);

      }, 300); // Wait for cancellation

    } catch (error) {
      console.error('❌ Working speech creation error:', error);
      setIsSpeaking(false);
      isProcessing.current = false;
    }
  }, [hasUserInteracted, autoReadEnabled, isReady, getBestVoice]);

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

    console.log('📝 WORKING NELIE QUEUEING:', text.substring(0, 50) + '...');

    if (priority) {
      // Clear queue and stop current speech for priority
      stopSpeaking();
      speechQueue.current = [text];
    } else {
      speechQueue.current.push(text);
    }

    // Start processing
    setTimeout(() => {
      processQueue();
    }, 100);
  }, [hasUserInteracted, autoReadEnabled, isReady, stopSpeaking, processQueue]);

  const enableSpeechWithInteraction = useCallback(() => {
    console.log('👆 WORKING NELIE - USER INTERACTION');
    setHasUserInteracted(true);
    setAutoReadEnabled(true);
    
    // Test immediately
    setTimeout(() => {
      speakText('Hello! I am Nelie, your AI learning companion! I can speak now!', true);
    }, 100);
  }, [speakText]);

  const toggleMute = useCallback(() => {
    if (!hasUserInteracted) {
      enableSpeechWithInteraction();
      return;
    }
    
    const newState = !autoReadEnabled;
    console.log('🔊 WORKING NELIE TOGGLE:', newState ? 'ON' : 'OFF');
    setAutoReadEnabled(newState);
    
    if (!newState) {
      stopSpeaking();
    }
  }, [hasUserInteracted, autoReadEnabled, enableSpeechWithInteraction, stopSpeaking]);

  const testSpeech = useCallback(() => {
    console.log('🧪 WORKING NELIE TEST');
    if (!hasUserInteracted) {
      enableSpeechWithInteraction();
    } else {
      speakText('This is a test of the working Nelie voice system. Hello from Nelie!', true);
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
