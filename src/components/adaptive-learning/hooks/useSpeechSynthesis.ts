
import { useState, useRef, useEffect } from 'react';

export const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoReadEnabled, setAutoReadEnabled] = useState(true);
  const hasAutoRead = useRef(false);
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  // Ensure voices are loaded before attempting to use them
  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        setVoicesLoaded(true);
        console.log('📢 Available voices loaded:', voices.map(v => `${v.name} (${v.lang})`));
      }
    };

    loadVoices();
    speechSynthesis.addEventListener('voiceschanged', loadVoices);

    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, []);

  const getFemaleVoice = () => {
    const voices = speechSynthesis.getVoices();
    
    // Priority order for female voices
    const femaleVoiceNames = [
      'Samantha',
      'Karen',
      'Victoria',
      'Zira',
      'Female',
      'Woman',
      'Google UK English Female',
      'Microsoft Zira Desktop',
      'Microsoft Hazel Desktop'
    ];

    // First try exact name matches
    for (const voiceName of femaleVoiceNames) {
      const voice = voices.find(v => 
        v.name.toLowerCase().includes(voiceName.toLowerCase()) && 
        v.lang.includes('en')
      );
      if (voice) {
        console.log('🎵 Selected female voice:', voice.name);
        return voice;
      }
    }

    // Fallback: look for any voice with "female" in the name
    const fallbackVoice = voices.find(voice => 
      (voice.name.toLowerCase().includes('female') || 
       voice.name.toLowerCase().includes('woman')) &&
      voice.lang.includes('en')
    );

    if (fallbackVoice) {
      console.log('🎵 Using fallback female voice:', fallbackVoice.name);
      return fallbackVoice;
    }

    console.log('🎵 No female voice found, using default');
    return null;
  };

  const stopSpeaking = () => {
    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const speakText = async (text: string) => {
    if (isSpeaking) {
      stopSpeaking();
      return;
    }

    try {
      setIsSpeaking(true);
      speechSynthesis.cancel(); // Stop any current speech

      // Wait for voices to load if they haven't yet
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

      // Small delay to ensure cancellation is processed
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.8;
        utterance.pitch = 1.3; // Higher pitch for female voice
        utterance.volume = 1.0;

        // Set the female voice
        const femaleVoice = getFemaleVoice();
        if (femaleVoice) {
          utterance.voice = femaleVoice;
        }

        utterance.onend = () => {
          setIsSpeaking(false);
        };

        utterance.onerror = () => {
          setIsSpeaking(false);
        };

        speechSynthesis.speak(utterance);
      }, 100);
    } catch (error) {
      console.error('Speech synthesis error:', error);
      setIsSpeaking(false);
    }
  };

  const handleMuteToggle = () => {
    if (autoReadEnabled) {
      // Turning off auto-read and stopping current speech
      setAutoReadEnabled(false);
      stopSpeaking();
    } else {
      // Turning on auto-read
      setAutoReadEnabled(true);
    }
  };

  // Stop speaking when component unmounts
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  return {
    isSpeaking,
    autoReadEnabled,
    hasAutoRead,
    speakText,
    stopSpeaking,
    handleMuteToggle,
    setAutoReadEnabled
  };
};
