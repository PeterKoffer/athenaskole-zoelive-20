
import { useUnifiedSpeech } from './useUnifiedSpeech';

// Compatibility wrapper for components that still reference useConsolidatedSpeech
export const useConsolidatedSpeech = () => {
  const unifiedSpeech = useUnifiedSpeech();
  
  return {
    ...unifiedSpeech,
    // Add any legacy method names if needed
    speakText: unifiedSpeech.speak,
    stopSpeaking: unifiedSpeech.stop,
    autoReadEnabled: unifiedSpeech.isEnabled,
    handleMuteToggle: unifiedSpeech.toggleEnabled
  };
};
