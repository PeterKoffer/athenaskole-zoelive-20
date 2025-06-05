
import { useState, useRef, useCallback, useEffect } from 'react';

export const useWorkingSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoReadEnabled, setAutoReadEnabled] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');
  const currentUtterance = useRef<SpeechSynthesisUtterance | null>(null);
  const hasInitialized = useRef(false);

  // Initialize speech synthesis
  useEffect(() => {
    const initializeSpeech = () => {
      console.log('🎵 Initializing speech system...');
      setDebugInfo('Initializing...');
      
      if (typeof speechSynthesis === 'undefined') {
        console.error('❌ Speech synthesis not supported');
        setDebugInfo('Speech synthesis not supported in this browser');
        return;
      }

      try {
        // Cancel any existing speech
        speechSynthesis.cancel();
        
        // Get voices
        const voices = speechSynthesis.getVoices();
        console.log(`🎵 Found ${voices.length} voices:`, voices.map(v => v.name));
        
        if (voices.length > 0) {
          setIsReady(true);
          hasInitialized.current = true;
          setDebugInfo(`Ready with ${voices.length} voices`);
          console.log('✅ Speech system ready');
        } else {
          setDebugInfo('Waiting for voices to load...');
          // Voices might not be loaded yet, wait a bit
          setTimeout(initializeSpeech, 500);
        }
      } catch (error) {
        console.error('❌ Speech initialization error:', error);
        setDebugInfo(`Error: ${error.message}`);
      }
    };

    // Initialize speech
    initializeSpeech();

    // Listen for voices changed event
    const handleVoicesChanged = () => {
      console.log('🔄 Voices changed event fired');
      if (!hasInitialized.current) {
        initializeSpeech();
      }
    };

    if (typeof speechSynthesis !== 'undefined') {
      speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
      
      return () => {
        speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
      };
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    console.log('🔇 Stopping all speech');
    setDebugInfo('Stopping speech...');
    
    if (typeof speechSynthesis !== 'undefined') {
      speechSynthesis.cancel();
    }
    
    setIsSpeaking(false);
    currentUtterance.current = null;
    setDebugInfo('Speech stopped');
  }, []);

  const getBestVoice = useCallback(() => {
    if (typeof speechSynthesis === 'undefined') return null;
    
    const voices = speechSynthesis.getVoices();
    console.log(`🎵 Selecting from ${voices.length} available voices`);
    
    if (voices.length === 0) {
      console.warn('⚠️ No voices available');
      return null;
    }

    // Look for female English voices first
    const femaleVoices = voices.filter(voice => 
      voice.lang.startsWith('en') && 
      (voice.name.toLowerCase().includes('female') || 
       voice.name.toLowerCase().includes('karen') ||
       voice.name.toLowerCase().includes('samantha') ||
       voice.name.toLowerCase().includes('zira') ||
       voice.name.toLowerCase().includes('victoria'))
    );

    if (femaleVoices.length > 0) {
      console.log('🎵 Using female voice:', femaleVoices[0].name);
      return femaleVoices[0];
    }

    // Fallback to any English voice
    const englishVoice = voices.find(voice => voice.lang.startsWith('en'));
    if (englishVoice) {
      console.log('🎵 Using English voice:', englishVoice.name);
      return englishVoice;
    }

    // Last resort - use first voice
    console.log('🎵 Using first available voice:', voices[0].name);
    return voices[0];
  }, []);

  const speakText = useCallback((text: string, priority: boolean = false) => {
    console.log('🔊 SPEAK REQUEST:', { text: text.substring(0, 50), priority, autoReadEnabled, isReady });
    
    if (!text || text.trim() === '') {
      console.log('🚫 Empty text provided');
      setDebugInfo('Empty text provided');
      return;
    }

    if (!autoReadEnabled) {
      console.log('🚫 Auto-read disabled');
      setDebugInfo('Auto-read disabled');
      return;
    }

    if (typeof speechSynthesis === 'undefined') {
      console.log('🚫 Speech synthesis not available');
      setDebugInfo('Speech synthesis not available');
      return;
    }

    if (!isReady) {
      console.log('🚫 Speech system not ready');
      setDebugInfo('Speech system not ready');
      return;
    }

    try {
      // Stop any current speech if priority
      if (priority && isSpeaking) {
        stopSpeaking();
      }

      console.log('🎤 Creating utterance for:', text.substring(0, 50) + '...');
      setDebugInfo(`Speaking: ${text.substring(0, 30)}...`);

      const utterance = new SpeechSynthesisUtterance(text);
      currentUtterance.current = utterance;

      // Configure utterance
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      utterance.lang = 'en-US';

      // Set voice
      const voice = getBestVoice();
      if (voice) {
        utterance.voice = voice;
        console.log('🎵 Voice set to:', voice.name);
      }

      // Event handlers
      utterance.onstart = () => {
        console.log('✅ Speech STARTED');
        setIsSpeaking(true);
        setDebugInfo('Speaking...');
      };

      utterance.onend = () => {
        console.log('🏁 Speech ENDED');
        setIsSpeaking(false);
        setDebugInfo('Speech completed');
        currentUtterance.current = null;
      };

      utterance.onerror = (event) => {
        console.error('🚫 Speech ERROR:', event);
        setIsSpeaking(false);
        setDebugInfo(`Speech error: ${event.error}`);
        currentUtterance.current = null;
      };

      utterance.onpause = () => {
        console.log('⏸️ Speech PAUSED');
        setDebugInfo('Speech paused');
      };

      utterance.onresume = () => {
        console.log('▶️ Speech RESUMED');
        setDebugInfo('Speech resumed');
      };

      // Start speaking
      console.log('🚀 Starting speech synthesis...');
      speechSynthesis.speak(utterance);

      // Backup check - sometimes onstart doesn't fire
      setTimeout(() => {
        if (currentUtterance.current === utterance && !isSpeaking) {
          console.warn('⚠️ Speech may not have started, checking speechSynthesis.speaking');
          if (speechSynthesis.speaking) {
            console.log('📢 SpeechSynthesis says it\'s speaking, updating state');
            setIsSpeaking(true);
            setDebugInfo('Speaking (detected)');
          } else {
            console.error('❌ Speech failed to start');
            setDebugInfo('Speech failed to start');
          }
        }
      }, 500);

    } catch (error) {
      console.error('🚫 Error in speakText:', error);
      setDebugInfo(`Error: ${error.message}`);
      setIsSpeaking(false);
    }
  }, [autoReadEnabled, isReady, isSpeaking, getBestVoice, stopSpeaking]);

  const toggleMute = useCallback(() => {
    const newState = !autoReadEnabled;
    console.log('🔊 Toggling speech:', newState ? 'ENABLED' : 'DISABLED');
    setAutoReadEnabled(newState);
    setDebugInfo(newState ? 'Speech enabled' : 'Speech disabled');
    
    if (!newState) {
      stopSpeaking();
    }
  }, [autoReadEnabled, stopSpeaking]);

  const testSpeech = useCallback(() => {
    console.log('🧪 Testing speech system...');
    speakText('Hello! I am Nelie, your AI learning companion. This is a test of my voice system.', true);
  }, [speakText]);

  return {
    isSpeaking,
    autoReadEnabled,
    isReady,
    debugInfo,
    speakText,
    stopSpeaking,
    toggleMute,
    testSpeech
  };
};
