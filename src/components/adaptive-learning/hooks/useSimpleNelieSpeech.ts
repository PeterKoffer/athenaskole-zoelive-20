
import { useState, useRef, useCallback, useEffect } from 'react';

export const useSimpleNelieSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoReadEnabled, setAutoReadEnabled] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [isReady, setIsReady] = useState(false);
  
  const currentUtterance = useRef<SpeechSynthesisUtterance | null>(null);
  const speechQueue = useRef<string[]>([]);
  const isProcessingQueue = useRef(false);

  // Initialize speech system
  useEffect(() => {
    const initSpeech = () => {
      if (typeof speechSynthesis === 'undefined') {
        console.log('❌ Speech synthesis not supported');
        return;
      }

      // Force load voices
      const voices = speechSynthesis.getVoices();
      console.log('🎵 Simple Nelie Speech - Voices found:', voices.length);
      
      if (voices.length > 0) {
        setIsReady(true);
        console.log('✅ Simple Nelie Speech Ready');
      }
    };

    initSpeech();
    
    if (typeof speechSynthesis !== 'undefined') {
      speechSynthesis.addEventListener('voiceschanged', initSpeech);
      return () => speechSynthesis.removeEventListener('voiceschanged', initSpeech);
    }
  }, []);

  const getBestVoice = useCallback(() => {
    if (typeof speechSynthesis === 'undefined') return null;
    
    const voices = speechSynthesis.getVoices();
    if (voices.length === 0) return null;

    // Look for good female English voices
    const priorities = [
      'Google UK English Female',
      'Microsoft Zira',
      'Karen',
      'Samantha'
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

  const stopSpeaking = useCallback(() => {
    console.log('🛑 SIMPLE NELIE - STOPPING SPEECH');
    
    if (typeof speechSynthesis !== 'undefined') {
      speechSynthesis.cancel();
    }
    
    setIsSpeaking(false);
    currentUtterance.current = null;
    speechQueue.current = [];
    isProcessingQueue.current = false;
  }, []);

  const processQueue = useCallback(async () => {
    if (isProcessingQueue.current || speechQueue.current.length === 0) {
      return;
    }

    isProcessingQueue.current = true;
    const text = speechQueue.current.shift();

    if (!text || !hasUserInteracted || !autoReadEnabled || !isReady) {
      isProcessingQueue.current = false;
      return;
    }

    console.log('🎤 SIMPLE NELIE SPEAKING:', text.substring(0, 50) + '...');

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

      utterance.onstart = () => {
        console.log('✅ SIMPLE NELIE STARTED');
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        console.log('🏁 SIMPLE NELIE FINISHED');
        setIsSpeaking(false);
        currentUtterance.current = null;
        isProcessingQueue.current = false;
        
        // Process next item in queue after a short delay
        setTimeout(() => {
          processQueue();
        }, 100);
      };

      utterance.onerror = (event) => {
        console.error('❌ Simple speech error:', event.error);
        setIsSpeaking(false);
        currentUtterance.current = null;
        isProcessingQueue.current = false;
        
        // Try next item in queue
        setTimeout(() => {
          processQueue();
        }, 500);
      };

      // Start speaking
      speechSynthesis.speak(utterance);

    } catch (error) {
      console.error('❌ Simple speech creation error:', error);
      setIsSpeaking(false);
      isProcessingQueue.current = false;
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

    console.log('📝 SIMPLE NELIE QUEUEING:', text.substring(0, 50) + '...');

    if (priority) {
      // Clear queue and stop current speech for priority
      stopSpeaking();
      speechQueue.current = [text];
    } else {
      speechQueue.current.push(text);
    }

    // Start processing if not already processing
    setTimeout(() => {
      processQueue();
    }, 100);
  }, [hasUserInteracted, autoReadEnabled, isReady, stopSpeaking, processQueue]);

  const enableSpeechWithInteraction = useCallback(() => {
    console.log('👆 SIMPLE NELIE - USER INTERACTION');
    setHasUserInteracted(true);
    setAutoReadEnabled(true);
    
    // Test immediately
    setTimeout(() => {
      speakText('Hello! I am Nelie, your AI learning companion! I can hear you now!', true);
    }, 200);
  }, [speakText]);

  const toggleMute = useCallback(() => {
    if (!hasUserInteracted) {
      enableSpeechWithInteraction();
      return;
    }
    
    const newState = !autoReadEnabled;
    console.log('🔊 SIMPLE NELIE TOGGLE:', newState ? 'ON' : 'OFF');
    setAutoReadEnabled(newState);
    
    if (!newState) {
      stopSpeaking();
    }
  }, [hasUserInteracted, autoReadEnabled, enableSpeechWithInteraction, stopSpeaking]);

  const testSpeech = useCallback(() => {
    console.log('🧪 SIMPLE NELIE TEST');
    if (!hasUserInteracted) {
      enableSpeechWithInteraction();
    } else {
      speakText('This is a test of the simple Nelie voice system. Can you hear me now?', true);
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
