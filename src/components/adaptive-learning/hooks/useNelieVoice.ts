
import { useState, useRef, useCallback, useEffect } from 'react';

export const useNelieVoice = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoReadEnabled, setAutoReadEnabled] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const currentUtterance = useRef<SpeechSynthesisUtterance | null>(null);
  const speechQueue = useRef<string[]>([]);
  const isProcessingQueue = useRef(false);

  // Initialize speech system
  useEffect(() => {
    const initSpeech = () => {
      if (typeof speechSynthesis !== 'undefined') {
        speechSynthesis.cancel();
        const voices = speechSynthesis.getVoices();
        console.log('🎵 Nelie Voice System - Found voices:', voices.length);
        setIsReady(voices.length > 0);
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

    // Look for female voices
    const femaleVoice = voices.find(voice => 
      voice.lang.startsWith('en') && 
      (voice.name.includes('Female') || voice.name.includes('Zira') || voice.name.includes('Karen'))
    );
    
    if (femaleVoice) return femaleVoice;
    
    // Fallback to any English voice
    return voices.find(voice => voice.lang.startsWith('en')) || voices[0];
  }, []);

  const stopSpeaking = useCallback(() => {
    console.log('🔇 Nelie - Stopping speech');
    if (typeof speechSynthesis !== 'undefined') {
      speechSynthesis.cancel();
    }
    speechQueue.current = [];
    isProcessingQueue.current = false;
    setIsSpeaking(false);
    currentUtterance.current = null;
  }, []);

  const processQueue = useCallback(() => {
    if (!autoReadEnabled || isProcessingQueue.current || speechQueue.current.length === 0) {
      return;
    }

    const text = speechQueue.current.shift();
    if (!text?.trim()) {
      setTimeout(processQueue, 100);
      return;
    }

    console.log('🎤 Nelie speaking:', text.substring(0, 50));
    isProcessingQueue.current = true;

    const utterance = new SpeechSynthesisUtterance(text);
    currentUtterance.current = utterance;
    
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.volume = 1.0;
    utterance.lang = 'en-US';

    const voice = getBestVoice();
    if (voice) {
      utterance.voice = voice;
      console.log('🎵 Using voice:', voice.name);
    }

    utterance.onstart = () => {
      console.log('✅ Nelie started speaking');
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      console.log('🏁 Nelie finished speaking');
      setIsSpeaking(false);
      isProcessingQueue.current = false;
      currentUtterance.current = null;
      setTimeout(processQueue, 300);
    };

    utterance.onerror = (event) => {
      console.error('🚫 Nelie speech error:', event.error);
      setIsSpeaking(false);
      isProcessingQueue.current = false;
      currentUtterance.current = null;
      setTimeout(processQueue, 500);
    };

    if (typeof speechSynthesis !== 'undefined') {
      speechSynthesis.speak(utterance);
    }
  }, [autoReadEnabled, getBestVoice]);

  const speakText = useCallback((text: string, priority: boolean = false) => {
    if (!text?.trim() || !autoReadEnabled || !isReady) {
      console.log('🚫 Cannot speak:', { text: !!text, autoReadEnabled, isReady });
      return;
    }

    console.log('🔊 Nelie queuing:', text.substring(0, 50));
    
    if (priority) {
      speechQueue.current = [text];
      stopSpeaking();
      setTimeout(processQueue, 200);
    } else {
      speechQueue.current.push(text);
      if (!isProcessingQueue.current) {
        setTimeout(processQueue, 100);
      }
    }
  }, [autoReadEnabled, isReady, processQueue, stopSpeaking]);

  const toggleMute = useCallback(() => {
    const newState = !autoReadEnabled;
    console.log('🔊 Nelie voice toggle:', newState);
    setAutoReadEnabled(newState);
    if (!newState) {
      stopSpeaking();
    }
  }, [autoReadEnabled, stopSpeaking]);

  const testSpeech = useCallback(() => {
    speakText('Hello! I am Nelie, your AI learning companion. Can you hear me clearly?', true);
  }, [speakText]);

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
