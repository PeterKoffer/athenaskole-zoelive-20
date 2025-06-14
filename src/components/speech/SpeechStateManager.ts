
import { SpeechState, getDefaultSpeechState } from './SpeechState';

export class SpeechStateManager {
  private state: SpeechState = getDefaultSpeechState();
  private listeners: ((state: SpeechState) => void)[] = [];

  async initialize(): Promise<void> {
    console.log('🔧 [SpeechStateManager] Initializing...');
    
    // Initialize speech state
    this.updateState({
      isReady: true,
      isLoading: false,
      voicesLoaded: true,
      isCheckingElevenLabs: false
    });
    
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
