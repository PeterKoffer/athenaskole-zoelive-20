
import { useState, useRef, useEffect, useCallback } from 'react';

export const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoReadEnabled, setAutoReadEnabled] = useState(true);
  const currentUtterance = useRef<SpeechSynthesisUtterance | null>(null);
  const hasAutoRead = useRef(false);
  const speechQueue = useRef<string[]>([]);
  const isProcessingQueue = useRef(false);

  const isSpeechSynthesisSupported = typeof speechSynthesis !== 'undefined';

  const stopSpeaking = useCallback(() => {
    console.log('🔇 Stopping all speech and clearing queue');
    
    if (!isSpeechSynthesisSupported) return;
    
    // Clear the queue and stop processing
    speechQueue.current = [];
    isProcessingQueue.current = false;
    
    // Cancel current speech
    speechSynthesis.cancel();
    setIsSpeaking(false);
    currentUtterance.current = null;
  }, [isSpeechSynthesisSupported]);

  const getFemaleVoice = useCallback(() => {
    if (!isSpeechSynthesisSupported) return null;
    
    const voices = speechSynthesis.getVoices();
    console.log('🎵 Available voices:', voices.length);
    
    if (voices.length === 0) {
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

    const englishVoice = voices.find(voice => voice.lang.startsWith('en'));
    if (englishVoice) {
      console.log('🎵 Using fallback English voice:', englishVoice.name);
      return englishVoice;
    }

    return voices[0] || null;
  }, [isSpeechSynthesisSupported]);

  const processQueue = useCallback(() => {
    if (!autoReadEnabled || isProcessingQueue.current || speechQueue.current.length === 0) {
      return;
    }

    const textToSpeak = speechQueue.current.shift();
    if (!textToSpeak) return;

    console.log('🎤 Processing speech queue:', textToSpeak.substring(0, 50) + '...');
    isProcessingQueue.current = true;

    // Ensure any previous speech is completely stopped
    speechSynthesis.cancel();

    // Wait for cancel to complete
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      currentUtterance.current = utterance;
      
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1.2;
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
        }, 800);
      };

      utterance.onerror = (event) => {
        console.error('🚫 Speech error:', event.error);
        setIsSpeaking(false);
        currentUtterance.current = null;
        isProcessingQueue.current = false;
        
        // Continue with queue even after error
        setTimeout(() => {
          processQueue();
        }, 1000);
      };

      console.log('🚀 Starting speech synthesis...');
      speechSynthesis.speak(utterance);
    }, 300);
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
    
    // Add to queue
    speechQueue.current.push(text);
    
    // Start processing if not already processing
    if (!isProcessingQueue.current) {
      setTimeout(() => {
        processQueue();
      }, 200);
    }
  }, [autoReadEnabled, processQueue, isSpeechSynthesisSupported]);

  const handleMuteToggle = useCallback(() => {
    const newAutoReadState = !autoReadEnabled;
    console.log('🔊 Toggling auto-read to:', newAutoReadState);
    
    setAutoReadEnabled(newAutoReadState);
    
    if (!newAutoReadState) {
      stopSpeaking();
    }
  }, [autoReadEnabled, stopSpeaking]);

  // Initialize voices on component mount
  useEffect(() => {
    if (isSpeechSynthesisSupported) {
      const loadVoices = () => {
        speechSynthesis.getVoices();
        console.log('🎵 Speech synthesis voices loaded');
      };
      
      loadVoices();
      speechSynthesis.addEventListener('voiceschanged', loadVoices);
      
      return () => {
        speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      };
    }
  }, [isSpeechSynthesisSupported]);

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
