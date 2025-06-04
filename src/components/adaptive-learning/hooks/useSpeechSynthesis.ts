
import { useState, useRef, useEffect, useCallback } from 'react';

export const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoReadEnabled, setAutoReadEnabled] = useState(true);
  const hasAutoRead = useRef(false);
  const currentUtterance = useRef<SpeechSynthesisUtterance | null>(null);
  const isProcessing = useRef(false);

  // Check if speech synthesis is available
  const isSpeechSynthesisSupported = typeof speechSynthesis !== 'undefined';

  const stopSpeaking = useCallback(() => {
    console.log('🔇 Stopping all speech');
    
    if (!isSpeechSynthesisSupported) return;
    
    // Set processing flag to prevent new speech
    isProcessing.current = true;
    
    // Stop any current speech
    speechSynthesis.cancel();
    setIsSpeaking(false);
    currentUtterance.current = null;
    
    // Clear processing flag after a delay
    setTimeout(() => {
      isProcessing.current = false;
    }, 500);
  }, [isSpeechSynthesisSupported]);

  const getFemaleVoice = useCallback(() => {
    if (!isSpeechSynthesisSupported) return null;
    
    const voices = speechSynthesis.getVoices();
    console.log('🎵 Available voices:', voices.length);
    
    if (voices.length === 0) {
      console.log('🎵 No voices available yet');
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

    // Fallback to any English voice
    const englishVoice = voices.find(voice => voice.lang.startsWith('en'));
    if (englishVoice) {
      console.log('🎵 Using fallback English voice:', englishVoice.name);
      return englishVoice;
    }

    console.log('🎵 Using default voice');
    return voices[0] || null;
  }, [isSpeechSynthesisSupported]);

  const speakText = useCallback(async (text: string) => {
    if (!isSpeechSynthesisSupported) {
      console.error('🚫 Speech synthesis not supported');
      return;
    }

    if (!text || text.trim() === '' || !autoReadEnabled || isProcessing.current) {
      console.log('🚫 Cannot speak - conditions not met:', {
        hasText: !!text,
        autoReadEnabled,
        isProcessing: isProcessing.current
      });
      return;
    }

    console.log('🔊 NELIE SPEAKING:', text.substring(0, 50) + '...');

    try {
      // Set processing flag
      isProcessing.current = true;

      // Stop any existing speech without triggering the cancellation loop
      if (currentUtterance.current) {
        speechSynthesis.cancel();
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      const utterance = new SpeechSynthesisUtterance(text);
      currentUtterance.current = utterance;
      
      // Configure voice settings
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1.2;
      utterance.volume = 1.0;

      // Wait for voices to load if needed
      if (speechSynthesis.getVoices().length === 0) {
        console.log('⏳ Waiting for voices to load...');
        await new Promise(resolve => {
          const checkVoices = () => {
            if (speechSynthesis.getVoices().length > 0) {
              resolve(true);
            } else {
              setTimeout(checkVoices, 100);
            }
          };
          checkVoices();
        });
      }

      const voice = getFemaleVoice();
      if (voice) {
        utterance.voice = voice;
      }

      utterance.onstart = () => {
        console.log('✅ Nelie speech STARTED');
        setIsSpeaking(true);
        isProcessing.current = false;
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

      // Start speaking
      console.log('🚀 Starting speech synthesis...');
      speechSynthesis.speak(utterance);

    } catch (error) {
      console.error('🚫 Speech synthesis error:', error);
      setIsSpeaking(false);
      currentUtterance.current = null;
      isProcessing.current = false;
    }
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
    voicesLoaded: true,
    speakText,
    stopSpeaking,
    handleMuteToggle,
    setAutoReadEnabled,
    isSpeechSynthesisSupported
  };
};
