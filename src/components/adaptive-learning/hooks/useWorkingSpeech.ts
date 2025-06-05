
import { useState, useRef, useCallback, useEffect } from 'react';

export const useWorkingSpeech = () => {
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
      if (typeof speechSynthesis !== 'undefined') {
        const voices = speechSynthesis.getVoices();
        console.log('🎵 Speech system - Available voices:', voices.length);
        setIsReady(voices.length > 0);
      }
    };

    initSpeech();
    
    if (typeof speechSynthesis !== 'undefined') {
      speechSynthesis.addEventListener('voiceschanged', initSpeech);
      return () => speechSynthesis.removeEventListener('voiceschanged', initSpeech);
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    console.log('🔇 Stopping all speech');
    
    if (typeof speechSynthesis !== 'undefined') {
      speechSynthesis.cancel();
    }
    
    speechQueue.current = [];
    isProcessingQueue.current = false;
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
    
    if (femaleVoice) return femaleVoice;
    
    // Fallback to any English voice
    const englishVoice = voices.find(voice => voice.lang.startsWith('en'));
    return englishVoice || voices[0];
  }, []);

  const processQueue = useCallback(() => {
    if (!hasUserInteracted || !autoReadEnabled || isProcessingQueue.current || speechQueue.current.length === 0) {
      return;
    }

    const text = speechQueue.current.shift();
    if (!text?.trim()) {
      setTimeout(() => processQueue(), 100);
      return;
    }

    console.log('🔊 Speaking:', text.substring(0, 50));
    isProcessingQueue.current = true;

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      currentUtterance.current = utterance;
      
      utterance.rate = 0.85;
      utterance.pitch = 1.1;
      utterance.volume = 1.0;
      utterance.lang = 'en-US';

      const voice = getBestVoice();
      if (voice) {
        utterance.voice = voice;
        console.log('🎵 Using voice:', voice.name);
      }

      utterance.onstart = () => {
        console.log('✅ Speech started successfully');
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        console.log('🏁 Speech ended');
        setIsSpeaking(false);
        isProcessingQueue.current = false;
        currentUtterance.current = null;
        setTimeout(() => processQueue(), 300);
      };

      utterance.onerror = (event) => {
        console.error('🚫 Speech error:', event.error);
        setIsSpeaking(false);
        isProcessingQueue.current = false;
        currentUtterance.current = null;
        setTimeout(() => processQueue(), 500);
      };

      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('🚫 Error creating speech:', error);
      isProcessingQueue.current = false;
    }
  }, [hasUserInteracted, autoReadEnabled, getBestVoice]);

  const speakText = useCallback((text: string, priority: boolean = false) => {
    if (!text?.trim()) {
      console.log('🚫 Empty text provided');
      return;
    }

    if (!hasUserInteracted) {
      console.log('🚫 No user interaction yet - speech blocked');
      return;
    }

    if (!autoReadEnabled) {
      console.log('🚫 Auto-read disabled');
      return;
    }

    if (!isReady) {
      console.log('🚫 Speech synthesis not ready');
      return;
    }

    console.log('🔊 Queuing speech:', text.substring(0, 50));
    
    if (priority) {
      speechQueue.current = [text];
      stopSpeaking();
      setTimeout(() => processQueue(), 200);
    } else {
      speechQueue.current.push(text);
      if (!isProcessingQueue.current) {
        setTimeout(() => processQueue(), 100);
      }
    }
  }, [hasUserInteracted, autoReadEnabled, isReady, processQueue, stopSpeaking]);

  const enableSpeechWithUserInteraction = useCallback(() => {
    console.log('🎵 User interaction detected - enabling speech');
    setHasUserInteracted(true);
    setAutoReadEnabled(true);
    
    // Test speech immediately after enabling
    setTimeout(() => {
      speakText('Hello! I am Nelie, your AI learning companion!', true);
    }, 100);
  }, [speakText]);

  const toggleMute = useCallback(() => {
    if (!hasUserInteracted) {
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
    } else {
      speakText('Hello! I am Nelie, your AI learning companion!', true);
    }
  }, [hasUserInteracted, enableSpeechWithUserInteraction, speakText]);

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
