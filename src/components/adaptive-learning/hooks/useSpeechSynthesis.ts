
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

  // Ensure voices are loaded before attempting to use them
  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        setVoicesLoaded(true);
        console.log('🎵 Available voices loaded:', voices.length, 'voices found');
      }
    };

    // Load voices immediately if available
    loadVoices();
    
    // Also listen for the voiceschanged event
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
    
    // Priority order for female voices - enhanced list
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

    // First try exact name matches
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

    // Fallback: look for any voice with "female" in the name
    const fallbackVoice = voices.find(voice => 
      (voice.name.toLowerCase().includes('female') || 
       voice.name.toLowerCase().includes('woman')) &&
      (voice.lang.includes('en') || voice.lang.includes('EN'))
    );

    if (fallbackVoice) {
      console.log('🎵 Using fallback female voice:', fallbackVoice.name);
      return fallbackVoice;
    }

    // Last resort: use any English voice
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
    if (isSpeaking || speechSynthesis.speaking) {
      console.log('🔇 Stopping speech synthesis - user requested');
      cancelRequested.current = true;
      speechSynthesis.cancel();
      speechQueue.current = []; // Clear the queue
      setIsSpeaking(false);
      currentUtterance.current = null;
      isProcessingQueue.current = false;
      
      // Reset cancel flag after a short delay
      setTimeout(() => {
        cancelRequested.current = false;
      }, 500);
    }
  }, [isSpeaking]);

  const processNextInQueue = useCallback(async () => {
    if (isProcessingQueue.current || speechQueue.current.length === 0 || cancelRequested.current) {
      return;
    }

    isProcessingQueue.current = true;
    const textToSpeak = speechQueue.current.shift();
    
    if (!textToSpeak || !autoReadEnabled) {
      isProcessingQueue.current = false;
      return;
    }

    try {
      console.log('🎵 Nelie speaking from queue:', textToSpeak.substring(0, 50) + '...');
      setIsSpeaking(true);

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      currentUtterance.current = utterance;
      
      // Configure utterance for Nelie's voice
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      utterance.pitch = 1.3; // Higher pitch for female voice
      utterance.volume = 1.0;

      // Set the female voice
      const femaleVoice = getFemaleVoice();
      if (femaleVoice) {
        utterance.voice = femaleVoice;
        console.log('🎵 Using voice:', femaleVoice.name);
      }

      utterance.onstart = () => {
        if (!cancelRequested.current) {
          console.log('🎵 Nelie started speaking');
          setIsSpeaking(true);
        }
      };

      utterance.onend = () => {
        console.log('🎵 Nelie finished speaking');
        setIsSpeaking(false);
        currentUtterance.current = null;
        isProcessingQueue.current = false;
        
        // Process next item in queue after a short delay
        setTimeout(() => {
          if (!cancelRequested.current) {
            processNextInQueue();
          }
        }, 100);
      };

      utterance.onerror = (event) => {
        if (event.error === 'canceled' && cancelRequested.current) {
          console.log('🔇 Speech canceled by user request');
        } else {
          console.error('🚫 Speech synthesis error:', event.error);
        }
        setIsSpeaking(false);
        currentUtterance.current = null;
        isProcessingQueue.current = false;
      };

      // Only speak if not canceled
      if (!cancelRequested.current) {
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
  }, [autoReadEnabled, getFemaleVoice]);

  const speakText = useCallback(async (text: string) => {
    if (!text || text.trim() === '') {
      console.log('🚫 No text to speak');
      return;
    }

    if (!autoReadEnabled) {
      console.log('🔇 Auto-read is disabled');
      return;
    }

    // Wait for voices to load if they haven't yet
    if (!voicesLoaded && speechSynthesis.getVoices().length === 0) {
      console.log('⏳ Waiting for voices to load...');
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

    // Add to queue instead of speaking immediately
    speechQueue.current.push(text);
    console.log('🎵 Added to speech queue:', text.substring(0, 50) + '...');
    
    // Process queue if not already processing
    if (!isProcessingQueue.current && !cancelRequested.current) {
      processNextInQueue();
    }
  }, [autoReadEnabled, voicesLoaded, processNextInQueue]);

  const handleMuteToggle = useCallback(() => {
    console.log('🔊 Toggling auto-read:', !autoReadEnabled);
    if (autoReadEnabled) {
      // Turning off auto-read and stopping current speech
      setAutoReadEnabled(false);
      stopSpeaking();
    } else {
      // Turning on auto-read
      setAutoReadEnabled(true);
      cancelRequested.current = false;
    }
  }, [autoReadEnabled, stopSpeaking]);

  // Stop speaking when component unmounts
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
