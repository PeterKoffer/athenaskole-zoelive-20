
import { useState, useRef, useEffect, useCallback } from 'react';

export const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoReadEnabled, setAutoReadEnabled] = useState(true);
  const currentUtterance = useRef<SpeechSynthesisUtterance | null>(null);
  const speechQueue = useRef<string[]>([]);
  const isProcessingQueue = useRef(false);
  const hasAutoRead = useRef(false);

  // Check if speech synthesis is available
  const isSpeechSynthesisSupported = typeof speechSynthesis !== 'undefined';

  const stopSpeaking = useCallback(() => {
    console.log('🔇 Stopping all speech');
    
    if (!isSpeechSynthesisSupported) return;
    
    // Clear the queue and stop processing
    speechQueue.current = [];
    isProcessingQueue.current = false;
    
    // Stop any current speech
    speechSynthesis.cancel();
    setIsSpeaking(false);
    currentUtterance.current = null;
  }, [isSpeechSynthesisSupported]);

  const getFemaleVoice = useCallback(() => {
    if (!isSpeechSynthesisSupported) return null;
    
    const voices = speechSynthesis.getVoices();
    console.log('🎵 Available voices:', voices.length);
    
    if (voices.length === 0) {
      console.log('🎵 No voices available yet');
      return null;
    }
    
    // Try to find a good female voice
    const preferredVoices = [
      'Google UK English Female',
      'Google US English Female',
      'Microsoft Zira',
      'Karen',
      'Samantha',
      'Victoria'
    ];

    for (const voiceName of preferredVoices) {
      const voice = voices.find(v => 
        v.name.toLowerCase().includes(voiceName.toLowerCase()) && 
        v.lang.startsWith('en')
      );
      if (voice) {
        console.log('🎵 Selected voice:', voice.name);
        return voice;
      }
    }

    // Fallback to any English voice
    const englishVoice = voices.find(voice => voice.lang.startsWith('en'));
    if (englishVoice) {
      console.log('🎵 Using fallback English voice:', englishVoice.name);
      return englishVoice;
    }

    console.log('🎵 Using default voice');
    return voices[0] || null;
  }, [isSpeechSynthesisSupported]);

  const processQueue = useCallback(() => {
    if (!autoReadEnabled || isProcessingQueue.current || speechQueue.current.length === 0) {
      return;
    }

    isProcessingQueue.current = true;
    const textToSpeak = speechQueue.current.shift();
    
    if (!textToSpeak) {
      isProcessingQueue.current = false;
      return;
    }

    console.log('🎤 Processing speech queue:', textToSpeak.substring(0, 50) + '...');

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    currentUtterance.current = utterance;
    
    // Configure voice settings
    utterance.lang = 'en-US';
    utterance.rate = 0.9; // Slightly slower for better clarity
    utterance.pitch = 1.1;
    utterance.volume = 1.0;

    const voice = getFemaleVoice();
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onstart = () => {
      console.log('✅ Nelie speech STARTED');
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      console.log('🏁 Nelie speech ENDED');
      setIsSpeaking(false);
      currentUtterance.current = null;
      isProcessingQueue.current = false;
      
      // Process next item in queue after a short delay
      setTimeout(() => {
        processQueue();
      }, 300);
    };

    utterance.onerror = (event) => {
      console.error('🚫 Speech error:', event.error);
      setIsSpeaking(false);
      currentUtterance.current = null;
      isProcessingQueue.current = false;
      
      // Continue with queue processing after error
      setTimeout(() => {
        processQueue();
      }, 500);
    };

    // Start speaking
    console.log('🚀 Starting speech synthesis...');
    speechSynthesis.speak(utterance);
  }, [autoReadEnabled, getFemaleVoice]);

  const speakText = useCallback((text: string) => {
    if (!isSpeechSynthesisSupported) {
      console.error('🚫 Speech synthesis not supported');
      return;
    }

    if (!text || text.trim() === '') {
      console.log('🚫 Cannot speak - no text provided');
      return;
    }

    if (!autoReadEnabled) {
      console.log('🚫 Cannot speak - auto read disabled');
      return;
    }

    console.log('🔊 NELIE QUEUING SPEECH:', text.substring(0, 50) + '...');

    // Clear existing queue and add new text
    speechQueue.current = [text];
    
    // Stop current speech and start new one
    if (currentUtterance.current) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      currentUtterance.current = null;
      isProcessingQueue.current = false;
    }
    
    // Start processing immediately
    setTimeout(() => {
      processQueue();
    }, 100);
  }, [autoReadEnabled, processQueue, isSpeechSynthesisSupported]);

  const handleMuteToggle = useCallback(() => {
    const newAutoReadState = !autoReadEnabled;
    console.log('🔊 Toggling auto-read to:', newAutoReadState);
    
    setAutoReadEnabled(newAutoReadState);
    
    if (!newAutoReadState) {
      stopSpeaking();
    }
  }, [autoReadEnabled, stopSpeaking]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      speechQueue.current = [];
      if (currentUtterance.current) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  return {
    isSpeaking,
    autoReadEnabled,
    hasAutoRead,
    speakText,
    stopSpeaking,
    handleMuteToggle,
    setAutoReadEnabled,
    isSpeechSynthesisSupported
  };
};
