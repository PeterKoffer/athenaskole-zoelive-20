
export interface SpeechState {
  isSpeaking: boolean;
  currentUtterance: any;
  isEnabled: boolean;
  hasUserInteracted: boolean;
  isReady: boolean;
  isLoading: boolean;
  lastError: string | null;
  voicesLoaded: boolean;
  usingElevenLabs: boolean;
  isCheckingElevenLabs: boolean;
}

export function getDefaultSpeechState() : SpeechState {
  return {
    isSpeaking: false,
    currentUtterance: null,
    isEnabled: false,
    hasUserInteracted: false,
    isReady: false,
    isLoading: false,
    lastError: null,
    voicesLoaded: false,
    usingElevenLabs: false,
    isCheckingElevenLabs: true,
  }
}
