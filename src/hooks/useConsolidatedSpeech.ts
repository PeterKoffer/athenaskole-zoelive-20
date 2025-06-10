
import { useUnifiedSpeech } from './useUnifiedSpeech';
import { useRef } from 'react';

/**
 * Consolidated speech hook that replaces all redundant speech hooks
 * This provides a unified interface for all speech functionality
 */
export const useConsolidatedSpeech = () => {
  const unifiedSpeech = useUnifiedSpeech();
  const hasAutoRead = useRef(false);
  
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
    isReady: unifiedSpeech.isReady,
    
    // Add the hasAutoRead ref for components that need it
    hasAutoRead
  };
};

// Export specific variations for different use cases
export const useSpeechSynthesis = useConsolidatedSpeech;
export const useWorkingSpeech = useConsolidatedSpeech;
export const useWorkingNelieSpeech = useConsolidatedSpeech;
export const useSimplifiedSpeech = useConsolidatedSpeech;
