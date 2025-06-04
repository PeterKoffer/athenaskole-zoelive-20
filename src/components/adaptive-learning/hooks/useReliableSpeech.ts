
import { useState, useRef, useCallback, useEffect } from 'react';

export const useReliableSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoReadEnabled, setAutoReadEnabled] = useState(true);
  const currentUtterance = useRef<SpeechSynthesisUtterance | null>(null);
  const speechQueue = useRef<string[]>([]);
  const isProcessing = useRef(false);

  // Ensure speech synthesis is ready
  useEffect(() => {
    const initializeSpeech = () => {
      if (typeof speechSynthesis !== 'undefined') {
        // Load voices
        speechSynthesis.getVoices();
        console.log('🎵 Speech synthesis initialized');
      }
    };

    initializeSpeech();
    
    // Listen for voices changed event
    if (typeof speechSynthesis !== 'undefined') {
      speechSynthesis.addEventListener('voiceschanged', initializeSpeech);
      return () => speechSynthesis.removeEventListener('voiceschanged', initializeSpeech);
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    console.log('🔇 Stopping Nelie speech');
    if (typeof speechSynthesis !== 'undefined') {
      speechSynthesis.cancel();
    }
    speechQueue.current = [];
    isProcessing.current = false;
    setIsSpeaking(false);
    currentUtterance.current = null;
  }, []);

  const getFemaleVoice = useCallback(() => {
    if (typeof speechSynthesis === 'undefined') return null;
    
    const voices = speechSynthesis.getVoices();
    console.log('🎵 Available voices:', voices.length);
    
    // Priority list for female voices
    const femaleVoiceNames = [
      'Google UK English Female',
      'Google US English Female', 
      'Microsoft Zira',
      'Karen',
      'Samantha',
      'Victoria',
      'Allison',
      'Susan'
    ];

    for (const voiceName of femaleVoiceNames) {
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
      console.log('🎵 Using fallback voice:', englishVoice.name);
      return englishVoice;
    }

    return voices[0] || null;
  }, []);

  const processQueue = useCallback(() => {
    if (!autoReadEnabled || isProcessing.current || speechQueue.current.length === 0) {
      return;
    }

    const textToSpeak = speechQueue.current.shift();
    if (!textToSpeak) return;

    console.log('🎤 Nelie is speaking:', textToSpeak.substring(0, 50) + '...');
    isProcessing.current = true;

    // Stop any existing speech
    if (typeof speechSynthesis !== 'undefined') {
      speechSynthesis.cancel();
    }

    // Wait a bit for cancel to complete
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
        console.log('✅ Nelie started speaking');
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        console.log('🏁 Nelie finished speaking');
        setIsSpeaking(false);
        currentUtterance.current = null;
        isProcessing.current = false;
        
        // Process next item in queue
        setTimeout(() => {
          processQueue();
        }, 800);
      };

      utterance.onerror = (event) => {
        console.error('🚫 Speech error:', event.error);
        setIsSpeaking(false);
        currentUtterance.current = null;
        isProcessing.current = false;
        
        // Continue with queue
        setTimeout(() => {
          processQueue();
        }, 1000);
      };

      if (typeof speechSynthesis !== 'undefined') {
        speechSynthesis.speak(utterance);
      }
    }, 200);
  }, [autoReadEnabled, getFemaleVoice]);

  const speakText = useCallback((text: string, priority: boolean = false) => {
    if (!text || text.trim() === '' || typeof speechSynthesis === 'undefined') {
      console.log('🚫 Cannot speak - invalid text or no speech synthesis');
      return;
    }

    if (!autoReadEnabled) {
      console.log('🚫 Cannot speak - auto read disabled');
      return;
    }

    console.log('🔊 NELIE QUEUING SPEECH:', text.substring(0, 50) + '...');
    
    if (priority) {
      // High priority speech - clear queue and speak immediately
      speechQueue.current = [text];
      stopSpeaking();
      setTimeout(() => {
        processQueue();
      }, 300);
    } else {
      // Add to queue
      speechQueue.current.push(text);
      if (!isProcessing.current) {
        setTimeout(() => {
          processQueue();
        }, 500);
      }
    }
  }, [autoReadEnabled, processQueue, stopSpeaking]);

  const toggleMute = useCallback(() => {
    const newState = !autoReadEnabled;
    console.log('🔊 Toggling Nelie speech to:', newState);
    setAutoReadEnabled(newState);
    
    if (!newState) {
      stopSpeaking();
    }
  }, [autoReadEnabled, stopSpeaking]);

  return {
    isSpeaking,
    autoReadEnabled,
    speakText,
    stopSpeaking,
    toggleMute,
    isReady: typeof speechSynthesis !== 'undefined'
  };
};
