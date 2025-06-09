import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';

export const useWorkingSpeech = () => {
  const unifiedSpeech = useUnifiedSpeech();
  
  return {
    ...unifiedSpeech,
    // Keep the original method names for backward compatibility
    speakText: unifiedSpeech.speakAsNelie
  };
};
