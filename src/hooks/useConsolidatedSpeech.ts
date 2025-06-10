
import { useUnifiedSpeech } from './useUnifiedSpeech';

/**
 * Consolidated speech hook that replaces all redundant speech hooks
 * This provides a unified interface for all speech functionality
 */
export const useConsolidatedSpeech = () => {
  const unifiedSpeech = useUnifiedSpeech();
  
  return {
    // Primary interface
    ...unifiedSpeech,
    
    // Legacy compatibility methods
    speakText: unifiedSpeech.speakAsNelie,
    handleMuteToggle: unifiedSpeech.toggleEnabled,
    isSpeechSynthesisSupported: typeof speechSynthesis !== 'undefined',
    
    // Additional convenience methods
    speakWithPersonality: unifiedSpeech.speakAsNelie,
    autoRead: unifiedSpeech.speakAsNelie,
    
    // State aliases for backward compatibility
    autoReadEnabled: unifiedSpeech.isEnabled,
    isReady: unifiedSpeech.isReady
  };
};

// Export specific variations for different use cases
export const useSpeechSynthesis = useConsolidatedSpeech;
export const useWorkingSpeech = useConsolidatedSpeech;
export const useWorkingNelieSpeech = useConsolidatedSpeech;
export const useSimplifiedSpeech = useConsolidatedSpeech;
