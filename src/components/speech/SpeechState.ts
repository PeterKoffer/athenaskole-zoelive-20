
export interface SpeechState {
  isSpeaking: boolean;
  isEnabled: boolean;
  hasUserInteracted: boolean;
  isReady: boolean;
  currentUtterance: SpeechSynthesisUtterance | null;
  lastError: string | null;
  isLoading: boolean;
  voicesLoaded: boolean;
  usingElevenLabs: boolean;
}

// Factory for default state
export function getDefaultSpeechState(): SpeechState {
  return {
    isSpeaking: false,
    isEnabled: true,
    hasUserInteracted: false,
    isReady: false,
    currentUtterance: null,
    lastError: null,
    isLoading: false,
    voicesLoaded: false,
    usingElevenLabs: false,
  };
}
