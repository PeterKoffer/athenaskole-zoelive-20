
import { SpeechState } from './SpeechState';

class SpeechStateManager {
  private state: SpeechState = {
    isSpeaking: false,
    currentUtterance: null,
    isEnabled: false,
    hasUserInteracted: false,
    isReady: false,
    isLoading: false,
    lastError: null,
    voicesLoaded: false,
    usingElevenLabs: false,
    isCheckingElevenLabs: false
  };

  private listeners: ((state: SpeechState) => void)[] = [];

  constructor() {
    this.initializeSpeechSystem();
  }

  private initializeSpeechSystem() {
    console.log('🔧 [SpeechStateManager] Initializing speech system...');
    
    if (typeof speechSynthesis !== 'undefined') {
      // Force load voices
      const loadVoices = () => {
        const voices = speechSynthesis.getVoices();
        console.log(`🎵 [SpeechStateManager] Loaded ${voices.length} voices`);
        
        // Log available female voices for debugging
        const femaleVoices = voices.filter(v => 
          v.lang.startsWith('en') && 
          (v.name.toLowerCase().includes('female') || 
           v.name.toLowerCase().includes('karen') ||
           v.name.toLowerCase().includes('samantha') ||
           v.name.toLowerCase().includes('zira'))
        );
        
        if (femaleVoices.length > 0) {
          console.log('👩 [SpeechStateManager] Available female voices:', femaleVoices.map(v => v.name));
        } else {
          console.warn('⚠️ [SpeechStateManager] No clearly female voices detected');
        }
        
        this.updateState({ 
          voicesLoaded: true, 
          isReady: true 
        });
      };

      // Load voices immediately if available
      if (speechSynthesis.getVoices().length > 0) {
        loadVoices();
      } else {
        // Wait for voices to load
        speechSynthesis.addEventListener('voiceschanged', loadVoices);
        
        // Fallback timeout
        setTimeout(() => {
          if (!this.state.voicesLoaded) {
            console.log('🔄 [SpeechStateManager] Forcing voice load after timeout');
            loadVoices();
          }
        }, 1000);
      }
    } else {
      console.warn('⚠️ [SpeechStateManager] Speech synthesis not supported');
      this.updateState({ isReady: true });
    }
  }

  getState(): SpeechState {
    return { ...this.state };
  }

  updateState(updates: Partial<SpeechState>) {
    const prevState = { ...this.state };
    this.state = { ...this.state, ...updates };
    
    console.log('🔄 [SpeechStateManager] State updated', this.state);
    
    this.listeners.forEach(listener => {
      try {
        listener(this.state);
      } catch (error) {
        console.error('❌ [SpeechStateManager] Error in listener:', error);
      }
    });
  }

  subscribe(listener: (state: SpeechState) => void): () => void {
    this.listeners.push(listener);
    
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }
}

export const speechStateManager = new SpeechStateManager();
