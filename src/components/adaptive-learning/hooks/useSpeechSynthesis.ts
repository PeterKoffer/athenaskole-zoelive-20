
import { useState, useRef, useEffect, useCallback } from 'react';

export const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoReadEnabled, setAutoReadEnabled] = useState(true);
  const currentUtterance = useRef<SpeechSynthesisUtterance | null>(null);
  const hasAutoRead = useRef(false);
  const isProcessing = useRef(false);

  const isSpeechSynthesisSupported = typeof speechSynthesis !== 'undefined';

  const stopSpeaking = useCallback(() => {
    console.log('🔇 Stopping all speech');
    
    if (!isSpeechSynthesisSupported) return;
    
    isProcessing.current = false;
    speechSynthesis.cancel();
    setIsSpeaking(false);
    currentUtterance.current = null;
  }, [isSpeechSynthesisSupported]);

  const getFemaleVoice = useCallback(() => {
    if (!isSpeechSynthesisSupported) return null;
    
    const voices = speechSynthesis.getVoices();
    
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

    if (isProcessing.current) {
      console.log('🚫 Already processing speech, skipping');
      return;
    }

    console.log('🔊 NELIE STARTING SPEECH:', text.substring(0, 50) + '...');

    // Stop any current speech
    speechSynthesis.cancel();
    isProcessing.current = true;

    // Small delay to ensure previous speech is stopped
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      currentUtterance.current = utterance;
      
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
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
        isProcessing.current = false;
      };

      utterance.onerror = (event) => {
        console.error('🚫 Speech error:', event.error);
        setIsSpeaking(false);
        currentUtterance.current = null;
        isProcessing.current = false;
      };

      speechSynthesis.speak(utterance);
    }, 200);
  }, [autoReadEnabled, getFemaleVoice, isSpeechSynthesisSupported]);

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
