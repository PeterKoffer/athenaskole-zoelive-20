import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';

export const useWorkingNelieSpeech = () => {
  const unifiedSpeech = useUnifiedSpeech();
  
  return {
    ...unifiedSpeech,
    // Keep the original method names for backward compatibility
    speakText: unifiedSpeech.speakAsNelie,
    handleMuteToggle: unifiedSpeech.toggleEnabled
  };
};
