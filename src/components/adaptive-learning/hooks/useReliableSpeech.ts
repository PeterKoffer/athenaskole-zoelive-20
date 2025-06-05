
import { useState, useRef, useCallback, useEffect } from 'react';

export const useReliableSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoReadEnabled, setAutoReadEnabled] = useState(true);
  const currentUtterance = useRef<SpeechSynthesisUtterance | null>(null);
  const speechQueue = useRef<string[]>([]);
  const isProcessing = useRef(false);
  const hasInitialized = useRef(false);

  // Enhanced speech synthesis initialization
  useEffect(() => {
    const initializeSpeech = () => {
      if (typeof speechSynthesis !== 'undefined' && !hasInitialized.current) {
        // Cancel any existing speech
        speechSynthesis.cancel();
        
        // Load voices
        const voices = speechSynthesis.getVoices();
        console.log('🎵 Speech synthesis initialized with', voices.length, 'voices');
        hasInitialized.current = true;
        
        // Test speech synthesis availability
        if (voices.length > 0) {
          console.log('✅ Speech synthesis is ready with voices');
        }
      }
    };

    // Initialize immediately if voices are already loaded
    initializeSpeech();
    
    // Listen for voices changed event (some browsers load voices asynchronously)
    if (typeof speechSynthesis !== 'undefined') {
      speechSynthesis.addEventListener('voiceschanged', initializeSpeech);
      
      // Also try initialization after a short delay
      setTimeout(initializeSpeech, 1000);
      
      return () => {
        speechSynthesis.removeEventListener('voiceschanged', initializeSpeech);
      };
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
    console.log('🎵 Selecting from', voices.length, 'available voices');
    
    if (voices.length === 0) {
      console.warn('⚠️ No voices available yet');
      return null;
    }
    
    // Priority list for female voices
    const femaleVoiceNames = [
      'Google UK English Female',
      'Google US English Female', 
      'Microsoft Zira',
      'Karen',
      'Samantha',
      'Victoria',
      'Allison',
      'Susan',
      'Alex',
      'Fiona'
    ];

    // First try to find preferred female voices
    for (const voiceName of femaleVoiceNames) {
      const voice = voices.find(v => 
        v.name.toLowerCase().includes(voiceName.toLowerCase()) && 
        v.lang.startsWith('en')
      );
      if (voice) {
        console.log('🎵 Selected preferred voice:', voice.name);
        return voice;
      }
    }

    // Fallback to any English female voice
    const femaleVoice = voices.find(voice => 
      voice.lang.startsWith('en') && 
      (voice.name.toLowerCase().includes('female') || 
       voice.name.toLowerCase().includes('woman'))
    );
    
    if (femaleVoice) {
      console.log('🎵 Selected fallback female voice:', femaleVoice.name);
      return femaleVoice;
    }

    // Final fallback to any English voice
    const englishVoice = voices.find(voice => voice.lang.startsWith('en'));
    if (englishVoice) {
      console.log('🎵 Using fallback English voice:', englishVoice.name);
      return englishVoice;
    }

    // Last resort - use first available voice
    const firstVoice = voices[0];
    if (firstVoice) {
      console.log('🎵 Using first available voice:', firstVoice.name);
      return firstVoice;
    }

    return null;
  }, []);

  const processQueue = useCallback(() => {
    if (!autoReadEnabled || isProcessing.current || speechQueue.current.length === 0) {
      return;
    }

    const textToSpeak = speechQueue.current.shift();
    if (!textToSpeak || textToSpeak.trim() === '') {
      // Continue processing queue if this item was empty
      setTimeout(processQueue, 100);
      return;
    }

    console.log('🎤 Nelie is speaking:', textToSpeak.substring(0, 50) + '...');
    isProcessing.current = true;

    // Ensure any existing speech is stopped
    if (typeof speechSynthesis !== 'undefined') {
      speechSynthesis.cancel();
    }

    // Wait for cancel to complete, then start new speech
    setTimeout(() => {
      try {
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        currentUtterance.current = utterance;
        
        // Configure speech parameters
        utterance.lang = 'en-US';
        utterance.rate = 0.85;
        utterance.pitch = 1.1;
        utterance.volume = 1.0;

        // Set voice
        const voice = getFemaleVoice();
        if (voice) {
          utterance.voice = voice;
          console.log('🎵 Using voice:', voice.name);
        } else {
          console.warn('⚠️ No voice selected, using default');
        }

        // Set up event handlers
        utterance.onstart = () => {
          console.log('✅ Nelie STARTED speaking');
          setIsSpeaking(true);
        };

        utterance.onend = () => {
          console.log('🏁 Nelie FINISHED speaking');
          setIsSpeaking(false);
          currentUtterance.current = null;
          isProcessing.current = false;
          
          // Process next item in queue after a pause
          setTimeout(() => {
            processQueue();
          }, 500);
        };

        utterance.onerror = (event) => {
          console.error('🚫 Speech error:', event.error, event);
          setIsSpeaking(false);
          currentUtterance.current = null;
          isProcessing.current = false;
          
          // Continue with queue even after error
          setTimeout(() => {
            processQueue();
          }, 1000);
        };

        utterance.onpause = () => {
          console.log('⏸️ Speech paused');
        };

        utterance.onresume = () => {
          console.log('▶️ Speech resumed');
        };

        // Start speaking
        if (typeof speechSynthesis !== 'undefined') {
          console.log('🚀 Starting speech synthesis for:', textToSpeak.substring(0, 30) + '...');
          speechSynthesis.speak(utterance);
          
          // Additional check to ensure speech started
          setTimeout(() => {
            if (!isSpeaking && currentUtterance.current === utterance) {
              console.warn('⚠️ Speech may not have started, retrying...');
              speechSynthesis.cancel();
              speechSynthesis.speak(utterance);
            }
          }, 1000);
        } else {
          console.error('🚫 Speech synthesis not available');
          isProcessing.current = false;
        }
      } catch (error) {
        console.error('🚫 Error creating utterance:', error);
        isProcessing.current = false;
        // Continue with queue
        setTimeout(processQueue, 1000);
      }
    }, 250);
  }, [autoReadEnabled, getFemaleVoice, isSpeaking]);

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
      console.log('🔥 Priority speech - clearing queue');
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
        }, 200);
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

  // Ensure speech synthesis is working
  const testSpeech = useCallback(() => {
    if (typeof speechSynthesis !== 'undefined' && autoReadEnabled) {
      console.log('🧪 Testing speech synthesis...');
      speakText('Hello, I am Nelie, your AI learning companion!', true);
    }
  }, [autoReadEnabled, speakText]);

  return {
    isSpeaking,
    autoReadEnabled,
    speakText,
    stopSpeaking,
    toggleMute,
    testSpeech,
    isReady: typeof speechSynthesis !== 'undefined' && hasInitialized.current
  };
};
