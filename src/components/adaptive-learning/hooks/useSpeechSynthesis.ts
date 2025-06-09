import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import { useRef } from 'react';

export const useSpeechSynthesis = () => {
  const unifiedSpeech = useUnifiedSpeech();
  const hasAutoRead = useRef(false);
  
  return {
    ...unifiedSpeech,
    // Keep the original method names for backward compatibility
    speakText: unifiedSpeech.speakAsNelie,
    handleMuteToggle: unifiedSpeech.toggleEnabled,
    isSpeechSynthesisSupported: typeof speechSynthesis !== 'undefined',
    hasAutoRead
  };
};
