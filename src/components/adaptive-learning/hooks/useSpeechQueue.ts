
import { useRef, useCallback, useState } from 'react';
import { useFemaleVoiceSelection } from './useFemaleVoiceSelection';

export const useSpeechQueue = (autoReadEnabled: boolean) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const currentUtterance = useRef<SpeechSynthesisUtterance | null>(null);
  const speechQueue = useRef<string[]>([]);
  const isProcessing = useRef(false);
  const { getFemaleVoice } = useFemaleVoiceSelection();

  const processQueue = useCallback(() => {
    if (!autoReadEnabled || isProcessing.current || speechQueue.current.length === 0) {
      return;
    }

    const textToSpeak = speechQueue.current.shift();
    if (!textToSpeak || textToSpeak.trim() === '') {
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
        
        // Configure speech parameters for Nelie
        utterance.lang = 'en-US';
        utterance.rate = 0.85;
        utterance.pitch = 1.1;
        utterance.volume = 1.0;

        // Set voice
        const voice = getFemaleVoice();
        if (voice) {
          utterance.voice = voice;
          console.log('🎵 Using voice:', voice.name);
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
          setTimeout(processQueue, 500);
        };

        utterance.onerror = (event) => {
          console.error('🚫 Speech error:', event.error, event);
          setIsSpeaking(false);
          currentUtterance.current = null;
          isProcessing.current = false;
          
          // Continue with queue even after error
          setTimeout(processQueue, 1000);
        };

        // Start speaking
        if (typeof speechSynthesis !== 'undefined') {
          console.log('🚀 Starting speech synthesis for:', textToSpeak.substring(0, 30) + '...');
          speechSynthesis.speak(utterance);
          
          // Backup check to ensure speech started
          setTimeout(() => {
            if (!isSpeaking && currentUtterance.current === utterance) {
              console.warn('⚠️ Speech may not have started, retrying...');
              if (speechSynthesis.speaking) {
                setIsSpeaking(true);
              } else {
                speechSynthesis.speak(utterance);
              }
            }
          }, 1000);
        }
      } catch (error) {
        console.error('🚫 Error creating utterance:', error);
        isProcessing.current = false;
        setTimeout(processQueue, 1000);
      }
    }, 250);
  }, [autoReadEnabled, getFemaleVoice, isSpeaking]);

  const addToQueue = useCallback((text: string, priority: boolean = false) => {
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
      // Stop current speech
      if (typeof speechSynthesis !== 'undefined') {
        speechSynthesis.cancel();
      }
      speechQueue.current = [];
      isProcessing.current = false;
      setIsSpeaking(false);
      currentUtterance.current = null;
      setTimeout(processQueue, 300);
    } else {
      // Add to queue
      speechQueue.current.push(text);
      if (!isProcessing.current) {
        setTimeout(processQueue, 200);
      }
    }
  }, [autoReadEnabled, processQueue]);

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

  return {
    isSpeaking,
    addToQueue,
    stopSpeaking
  };
};
