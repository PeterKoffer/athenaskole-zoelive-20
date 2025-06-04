
import { useState, useRef, useEffect, useCallback } from 'react';

export const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoReadEnabled, setAutoReadEnabled] = useState(true);
  const hasAutoRead = useRef(false);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const currentUtterance = useRef<SpeechSynthesisUtterance | null>(null);
  const speechQueue = useRef<string[]>([]);
  const isProcessingQueue = useRef(false);
  const cancelRequested = useRef(false);
  const speakingTimeout = useRef<NodeJS.Timeout | null>(null);

  // Ensure voices are loaded before attempting to use them
  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        setVoicesLoaded(true);
        console.log('🎵 Available voices loaded:', voices.length, 'voices found');
      }
    };

    loadVoices();
    speechSynthesis.addEventListener('voiceschanged', loadVoices);

    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, []);

  const getFemaleVoice = useCallback(() => {
    const voices = speechSynthesis.getVoices();
    
    if (voices.length === 0) {
      console.log('🎵 No voices available yet');
      return null;
    }
    
    const femaleVoiceNames = [
      'Microsoft Zira Desktop',
      'Microsoft Hazel Desktop', 
      'Google UK English Female',
      'Google US English Female',
      'Samantha',
      'Karen',
      'Victoria',
      'Zira',
      'Aria',
      'Female',
      'Woman'
    ];

    for (const voiceName of femaleVoiceNames) {
      const voice = voices.find(v => 
        v.name.toLowerCase().includes(voiceName.toLowerCase()) && 
        (v.lang.includes('en') || v.lang.includes('EN'))
      );
      if (voice) {
        console.log('🎵 Selected female voice:', voice.name, voice.lang);
        return voice;
      }
    }

    const fallbackVoice = voices.find(voice => 
      (voice.name.toLowerCase().includes('female') || 
       voice.name.toLowerCase().includes('woman')) &&
      (voice.lang.includes('en') || voice.lang.includes('EN'))
    );

    if (fallbackVoice) {
      console.log('🎵 Using fallback female voice:', fallbackVoice.name);
      return fallbackVoice;
    }

    const englishVoice = voices.find(voice => 
      voice.lang.includes('en') || voice.lang.includes('EN')
    );

    if (englishVoice) {
      console.log('🎵 Using English voice:', englishVoice.name);
      return englishVoice;
    }

    console.log('🎵 No suitable voice found, using default');
    return voices[0] || null;
  }, []);

  const stopSpeaking = useCallback(() => {
    console.log('🔇 Stopping speech - cleanup all speech state');
    
    // Clear any pending timeouts
    if (speakingTimeout.current) {
      clearTimeout(speakingTimeout.current);
      speakingTimeout.current = null;
    }
    
    // Set cancel flag before doing anything else
    cancelRequested.current = true;
    
    // Cancel speech synthesis
    if (speechSynthesis.speaking || speechSynthesis.pending) {
      speechSynthesis.cancel();
    }
    
    // Clear queue and reset state
    speechQueue.current = [];
    setIsSpeaking(false);
    currentUtterance.current = null;
    isProcessingQueue.current = false;
    
    // Reset cancel flag after a delay
    setTimeout(() => {
      cancelRequested.current = false;
      console.log('🔄 Speech cancel flag reset');
    }, 1000);
  }, []);

  const processNextInQueue = useCallback(async () => {
    if (isProcessingQueue.current || speechQueue.current.length === 0 || cancelRequested.current || !autoReadEnabled) {
      return;
    }

    isProcessingQueue.current = true;
    const textToSpeak = speechQueue.current.shift();
    
    if (!textToSpeak) {
      isProcessingQueue.current = false;
      return;
    }

    try {
      console.log('🎵 Nelie starting to speak:', textToSpeak.substring(0, 50) + '...');
      
      // Wait for voices if needed
      if (!voicesLoaded) {
        await new Promise(resolve => {
          const checkVoices = () => {
            if (speechSynthesis.getVoices().length > 0) {
              setVoicesLoaded(true);
              resolve(true);
            } else {
              setTimeout(checkVoices, 100);
            }
          };
          checkVoices();
        });
      }

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      currentUtterance.current = utterance;
      
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      utterance.pitch = 1.3;
      utterance.volume = 1.0;

      const femaleVoice = getFemaleVoice();
      if (femaleVoice) {
        utterance.voice = femaleVoice;
        console.log('🎵 Using voice:', femaleVoice.name);
      }

      utterance.onstart = () => {
        if (!cancelRequested.current) {
          console.log('🎵 Nelie speech started successfully');
          setIsSpeaking(true);
        }
      };

      utterance.onend = () => {
        console.log('🎵 Nelie finished speaking');
        setIsSpeaking(false);
        currentUtterance.current = null;
        isProcessingQueue.current = false;
        
        // Process next item after delay
        speakingTimeout.current = setTimeout(() => {
          if (!cancelRequested.current && speechQueue.current.length > 0) {
            processNextInQueue();
          }
        }, 500);
      };

      utterance.onerror = (event) => {
        if (event.error !== 'canceled') {
          console.error('🚫 Speech synthesis error:', event.error);
        }
        setIsSpeaking(false);
        currentUtterance.current = null;
        isProcessingQueue.current = false;
      };

      // Only speak if not canceled and auto-read is enabled
      if (!cancelRequested.current && autoReadEnabled) {
        speechSynthesis.speak(utterance);
      } else {
        isProcessingQueue.current = false;
      }

    } catch (error) {
      console.error('🚫 Speech synthesis error:', error);
      setIsSpeaking(false);
      currentUtterance.current = null;
      isProcessingQueue.current = false;
    }
  }, [autoReadEnabled, voicesLoaded, getFemaleVoice]);

  const speakText = useCallback(async (text: string) => {
    if (!text || text.trim() === '' || !autoReadEnabled) {
      console.log('🚫 Cannot speak - no text or auto-read disabled');
      return;
    }

    console.log('🎵 Adding to speech queue:', text.substring(0, 50) + '...');
    speechQueue.current.push(text);
    
    // Start processing if not already processing
    if (!isProcessingQueue.current && !cancelRequested.current) {
      setTimeout(() => processNextInQueue(), 200);
    }
  }, [autoReadEnabled, processNextInQueue]);

  const handleMuteToggle = useCallback(() => {
    const newAutoReadState = !autoReadEnabled;
    console.log('🔊 Toggling auto-read to:', newAutoReadState);
    
    setAutoReadEnabled(newAutoReadState);
    
    if (!newAutoReadState) {
      // Turning off - stop all speech
      stopSpeaking();
    } else {
      // Turning on - reset cancel flag
      cancelRequested.current = false;
    }
  }, [autoReadEnabled, stopSpeaking]);

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, [stopSpeaking]);

  return {
    isSpeaking,
    autoReadEnabled,
    hasAutoRead,
    voicesLoaded,
    speakText,
    stopSpeaking,
    handleMuteToggle,
    setAutoReadEnabled
  };
};
