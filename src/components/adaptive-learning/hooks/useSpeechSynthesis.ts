
import { useState, useRef, useEffect } from 'react';

export const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoReadEnabled, setAutoReadEnabled] = useState(true);
  const hasAutoRead = useRef(false);

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

      // Small delay to ensure cancellation is processed
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.8;
        utterance.pitch = 1.2; // Higher pitch for Nelie
        utterance.volume = 1.0;

        // Try to use a female voice for Nelie
        const voices = speechSynthesis.getVoices();
        const femaleVoice = voices.find(voice => 
          voice.name.toLowerCase().includes('female') ||
          voice.name.toLowerCase().includes('woman') ||
          voice.name.toLowerCase().includes('samantha') ||
          voice.name.toLowerCase().includes('karen') ||
          voice.name.toLowerCase().includes('victoria') ||
          voice.name.toLowerCase().includes('zira') ||
          (voice.name.toLowerCase().includes('alex') && voice.lang.includes('en'))
        );

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
