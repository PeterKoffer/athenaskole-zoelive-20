
import { useState, useRef, useCallback, useEffect } from 'react';

export const useSimplifiedSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoReadEnabled, setAutoReadEnabled] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const currentUtterance = useRef<SpeechSynthesisUtterance | null>(null);
  const speechQueue = useRef<string[]>([]);
  const isProcessingQueue = useRef(false);

  // Check if speech synthesis is available
  const isReady = typeof speechSynthesis !== 'undefined';

  // Enable auto-read with user interaction
  const enableSpeechWithUserInteraction = useCallback(() => {
    console.log('🎵 User interaction detected - enabling speech');
    setHasUserInteracted(true);
    setAutoReadEnabled(true);
    
    // Test speech immediately after enabling
    setTimeout(() => {
      speakText('Hello! I am Nelie, your AI learning companion!', true);
    }, 100);
  }, []);

  const stopSpeaking = useCallback(() => {
    console.log('🔇 Stopping speech');
    if (typeof speechSynthesis !== 'undefined') {
      speechSynthesis.cancel();
    }
    speechQueue.current = [];
    isProcessingQueue.current = false;
    setIsSpeaking(false);
    currentUtterance.current = null;
  }, []);

  const processQueue = useCallback(() => {
    if (!autoReadEnabled || !hasUserInteracted || isProcessingQueue.current || speechQueue.current.length === 0) {
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
        console.log('🎵 Using voice:', femaleVoice.name);
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
  }, [autoReadEnabled, hasUserInteracted]);

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
      console.log('🚫 Speech synthesis not supported');
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
    isReady
  };
};
