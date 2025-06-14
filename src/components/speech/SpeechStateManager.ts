
import { SpeechState, getDefaultSpeechState } from './SpeechState';
import { elevenLabsSpeechEngine } from './ElevenLabsSpeechEngine';

export class SpeechStateManager {
  private state: SpeechState = getDefaultSpeechState();
  private listeners: ((state: SpeechState) => void)[] = [];

  async initialize(): Promise<void> {
    console.log('🔧 [SpeechStateManager] Initializing...');
    
    // Check ElevenLabs availability first
    this.updateState({ isCheckingElevenLabs: true });
    
    try {
      const elevenLabsAvailable = await elevenLabsSpeechEngine.isAvailable();
      console.log('🎭 [SpeechStateManager] ElevenLabs available:', elevenLabsAvailable);
      
      if (elevenLabsAvailable) {
        console.log('🎤 [SpeechStateManager] Using ElevenLabs with Fena voice');
        this.updateState({
          isReady: true,
          isLoading: false,
          voicesLoaded: true,
          usingElevenLabs: true,
          isCheckingElevenLabs: false
        });
      } else {
        console.warn('⚠️ [SpeechStateManager] ElevenLabs not available, falling back to browser');
        this.updateState({
          isReady: true,
          isLoading: false,
          voicesLoaded: true,
          usingElevenLabs: false,
          isCheckingElevenLabs: false
        });
      }
    } catch (error) {
      console.error('❌ [SpeechStateManager] Error during initialization:', error);
      this.updateState({
        isReady: true,
        isLoading: false,
        voicesLoaded: true,
        usingElevenLabs: false,
        isCheckingElevenLabs: false,
        lastError: 'Failed to initialize ElevenLabs'
      });
    }
    
    console.log('🔧 [SpeechStateManager] Initialization complete');
  }

  getState(): SpeechState {
    return { ...this.state };
  }

  updateState(updates: Partial<SpeechState>): void {
    this.state = { ...this.state, ...updates };
    console.log("🔄 [SpeechStateManager] State updated", this.state);
    this.notifyListeners();
  }

  subscribe(listener: (state: SpeechState) => void): () => void {
    this.listeners.push(listener);
    listener(this.state);

    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.state));
  }
}
