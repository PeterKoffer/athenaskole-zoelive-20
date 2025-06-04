
import { useState, useRef, useEffect, useCallback } from 'react';

export const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoReadEnabled, setAutoReadEnabled] = useState(true);
  const hasAutoRead = useRef(false);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const currentUtterance = useRef<SpeechSynthesisUtterance | null>(null);

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
    
    // Priority order for female voices
    const femaleVoiceNames = [
      'Microsoft Zira Desktop',
      'Microsoft Hazel Desktop', 
      'Google UK English Female',
      'Samantha',
      'Karen',
      'Victoria',
      'Zira',
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
      console.log('🔇 Stopping speech synthesis');
      speechSynthesis.cancel();
      setIsSpeaking(false);
      currentUtterance.current = null;
    }
  }, [isSpeaking]);

  const speakText = useCallback(async (text: string) => {
    if (!text || text.trim() === '') {
      console.log('🚫 No text to speak');
      return;
    }

    // Stop any current speech
    if (isSpeaking || speechSynthesis.speaking) {
      stopSpeaking();
      // Wait a bit for the cancellation to take effect
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    if (!autoReadEnabled) {
      console.log('🔇 Auto-read is disabled');
      return;
    }

    try {
      console.log('🎵 Nelie attempting to speak:', text.substring(0, 50) + '...');
      setIsSpeaking(true);

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

      const utterance = new SpeechSynthesisUtterance(text);
      currentUtterance.current = utterance;
      
      // Configure utterance
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      utterance.pitch = 1.2; // Higher pitch for female voice
      utterance.volume = 1.0;

      // Set the female voice
      const femaleVoice = getFemaleVoice();
      if (femaleVoice) {
        utterance.voice = femaleVoice;
        console.log('🎵 Using voice:', femaleVoice.name);
      }

      utterance.onstart = () => {
        console.log('🎵 Speech started');
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        console.log('🎵 Speech ended');
        setIsSpeaking(false);
        currentUtterance.current = null;
      };

      utterance.onerror = (event) => {
        console.error('🚫 Speech synthesis error:', event.error);
        setIsSpeaking(false);
        currentUtterance.current = null;
      };

      // Speak the text
      speechSynthesis.speak(utterance);

    } catch (error) {
      console.error('🚫 Speech synthesis error:', error);
      setIsSpeaking(false);
      currentUtterance.current = null;
    }
  }, [autoReadEnabled, voicesLoaded, getFemaleVoice, stopSpeaking, isSpeaking]);

  const handleMuteToggle = useCallback(() => {
    console.log('🔊 Toggling auto-read:', !autoReadEnabled);
    if (autoReadEnabled) {
      // Turning off auto-read and stopping current speech
      setAutoReadEnabled(false);
      stopSpeaking();
    } else {
      // Turning on auto-read
      setAutoReadEnabled(true);
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
