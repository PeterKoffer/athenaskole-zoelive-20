
import { useUnifiedSpeech } from './useUnifiedSpeech';
import { useRef, useCallback } from 'react';

/**
 * Consolidated speech hook that replaces all redundant speech hooks
 * This provides a unified interface for all speech functionality with improved reliability
 */
export const useConsolidatedSpeech = () => {
  const unifiedSpeech = useUnifiedSpeech();
  const hasAutoRead = useRef(false);
  const lastReadContent = useRef('');
  const lastReadTime = useRef(0);
  
  // Enhanced speak function with repetition prevention
  const enhancedSpeak = useCallback(async (text: string, priority: boolean = false) => {
    if (!text || text.trim().length === 0) {
      console.log('🚫 Empty text provided to enhancedSpeak');
      return;
    }

    const now = Date.now();
    const timeSinceLastRead = now - lastReadTime.current;
    
    // Prevent reading the same content within 5 seconds
    if (text === lastReadContent.current && timeSinceLastRead < 5000) {
      console.log('🚫 Preventing duplicate speech:', text.substring(0, 30) + '...');
      return;
    }

    lastReadContent.current = text;
    lastReadTime.current = now;
    
    await unifiedSpeech.speakAsNelie(text, priority);
  }, [unifiedSpeech]);

  // Auto-read with smart prevention
  const smartAutoRead = useCallback(async (text: string) => {
    if (!unifiedSpeech.isEnabled || !unifiedSpeech.hasUserInteracted) {
      console.log('🚫 Auto-read skipped: speech not enabled or no user interaction');
      return;
    }

    if (hasAutoRead.current) {
      console.log('🚫 Auto-read already performed for this content');
      return;
    }

    hasAutoRead.current = true;
    setTimeout(() => {
      enhancedSpeak(text, false);
    }, 1500); // Delay to prevent overwhelming user
  }, [unifiedSpeech.isEnabled, unifiedSpeech.hasUserInteracted, enhancedSpeak]);

  // Reset auto-read flag
  const resetAutoRead = useCallback(() => {
    hasAutoRead.current = false;
  }, []);

  return {
    // Primary interface with enhanced functions
    speak: enhancedSpeak,
    speakAsNelie: enhancedSpeak,
    autoRead: smartAutoRead,
    resetAutoRead,
    
    // State from unified speech
    isSpeaking: unifiedSpeech.isSpeaking,
    isEnabled: unifiedSpeech.isEnabled,
    hasUserInteracted: unifiedSpeech.hasUserInteracted,
    isReady: unifiedSpeech.isReady,
    lastError: unifiedSpeech.lastError,
    isLoading: unifiedSpeech.isLoading,
    
    // Actions
    stop: unifiedSpeech.stop,
    toggleEnabled: unifiedSpeech.toggleEnabled,
    enableUserInteraction: unifiedSpeech.enableUserInteraction,
    test: unifiedSpeech.test,
    
    // Legacy compatibility methods
    speakText: enhancedSpeak,
    handleMuteToggle: unifiedSpeech.toggleEnabled,
    isSpeechSynthesisSupported: typeof speechSynthesis !== 'undefined',
    speakWithPersonality: enhancedSpeak,
    
    // State aliases for backward compatibility
    autoReadEnabled: unifiedSpeech.isEnabled,
    stopSpeaking: unifiedSpeech.stop,
    testSpeech: unifiedSpeech.test,
    
    // Add the hasAutoRead ref for components that need it
    hasAutoRead
  };
};

// Export specific variations for different use cases
export const useSpeechSynthesis = useConsolidatedSpeech;
export const useWorkingSpeech = useConsolidatedSpeech;
export const useWorkingNelieSpeech = useConsolidatedSpeech;
export const useSimplifiedSpeech = useConsolidatedSpeech;
