
interface SpeechConfig {
  rate: number;
  pitch: number;
  volume: number;
  voice?: SpeechSynthesisVoice;
}

interface SpeechState {
  isSpeaking: boolean;
  isEnabled: boolean;
  hasUserInteracted: boolean;
  isReady: boolean;
  currentUtterance: SpeechSynthesisUtterance | null;
  lastError?: string;
  isLoading: boolean;
}

export class UnifiedSpeechSystem {
  private static instance: UnifiedSpeechSystem;
  private state: SpeechState = {
    isSpeaking: false,
    isEnabled: true,
    hasUserInteracted: false,
    isReady: false,
    currentUtterance: null,
    lastError: undefined,
    isLoading: true
  };
  
  private config: SpeechConfig = {
    rate: 0.85,
    pitch: 1.0,
    volume: 0.9
  };
  
  private listeners: Set<(state: SpeechState) => void> = new Set();
  private voicesLoadedPromise: Promise<void>;
  private speechQueue: Array<{ text: string; priority: boolean }> = [];
  private isProcessingQueue = false;

  private constructor() {
    this.voicesLoadedPromise = this.waitForVoices();
    this.setupSpeechSynthesis();
  }

  static getInstance(): UnifiedSpeechSystem {
    if (!UnifiedSpeechSystem.instance) {
      UnifiedSpeechSystem.instance = new UnifiedSpeechSystem();
    }
    return UnifiedSpeechSystem.instance;
  }

  private async waitForVoices(): Promise<void> {
    return new Promise((resolve) => {
      const checkVoices = () => {
        const voices = speechSynthesis.getVoices();
        if (voices.length > 0) {
          speechSynthesis.removeEventListener('voiceschanged', checkVoices);
          this.updateState({ isLoading: false });
          console.log('🎤 Speech voices loaded:', voices.length);
          resolve();
          return true;
        }
        return false;
      };

      // Check immediately
      if (checkVoices()) return;

      // Listen for voices to load
      speechSynthesis.addEventListener('voiceschanged', checkVoices);
      
      // Fallback timeout with better error handling
      setTimeout(() => {
        speechSynthesis.removeEventListener('voiceschanged', checkVoices);
        const voices = speechSynthesis.getVoices();
        
        if (voices.length === 0) {
          console.warn('🚫 No speech voices loaded after timeout');
          this.updateState({ 
            lastError: 'Speech voices failed to load. Try refreshing the page.',
            isLoading: false 
          });
        } else {
          this.updateState({ isLoading: false });
        }
        
        resolve();
      }, 5000); // Increased timeout for slower devices
    });
  }

  private setupSpeechSynthesis(): void {
    if (!('speechSynthesis' in window)) {
      console.warn('🚫 Speech synthesis not supported in this browser');
      this.updateState({ 
        lastError: 'Speech synthesis not supported in this browser. Try Chrome, Edge, or Firefox.',
        isReady: false,
        isLoading: false 
      });
      return;
    }

    this.voicesLoadedPromise.then(() => {
      const voices = speechSynthesis.getVoices();
      
      if (voices.length === 0) {
        console.warn('🚫 No speech voices available');
        this.updateState({ 
          lastError: 'No speech voices available. Check browser settings or try a different browser.',
          isReady: false 
        });
        return;
      }

      // Enhanced voice selection with fallbacks
      const preferredVoice = this.selectBestVoice(voices);
      
      if (preferredVoice) {
        this.config.voice = preferredVoice;
        console.log('🎤 Selected voice:', preferredVoice.name, '(', preferredVoice.lang, ')');
      } else {
        console.warn('🚫 No suitable voice found, using default');
      }
      
      this.updateState({ 
        isReady: true,
        lastError: undefined 
      });
      console.log('🎤 Unified Speech System ready with', voices.length, 'voices available');
    }).catch((error) => {
      console.error('🚫 Failed to setup speech synthesis:', error);
      this.updateState({ 
        lastError: 'Failed to initialize speech system. Please try refreshing the page.',
        isReady: false 
      });
    });
  }

  private selectBestVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
    // Priority order: Google > Microsoft > Apple > other English voices > any voice
    const priorities = [
      (v: SpeechSynthesisVoice) => v.name.includes('Google') && v.lang.startsWith('en'),
      (v: SpeechSynthesisVoice) => v.name.includes('Microsoft') && v.lang.startsWith('en'),
      (v: SpeechSynthesisVoice) => v.name.includes('Apple') && v.lang.startsWith('en'),
      (v: SpeechSynthesisVoice) => v.lang.startsWith('en-US'),
      (v: SpeechSynthesisVoice) => v.lang.startsWith('en'),
      (v: SpeechSynthesisVoice) => v.default,
      () => true // Any voice as last resort
    ];

    for (const priority of priorities) {
      const voice = voices.find(priority);
      if (voice) return voice;
    }

    return voices[0] || null;
  }

  private updateState(updates: Partial<SpeechState>): void {
    this.state = { ...this.state, ...updates };
    this.listeners.forEach(listener => listener(this.state));
  }

  subscribe(listener: (state: SpeechState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getState(): SpeechState {
    return { ...this.state };
  }

  private getSpeechErrorMessage(error: SpeechSynthesisErrorEvent['error']): string {
    switch (error) {
      case 'network':
        return 'Network error during speech. Check your internet connection.';
      case 'synthesis-failed':
        return 'Speech synthesis failed. Try refreshing the page.';
      case 'synthesis-unavailable':
        return 'Speech synthesis unavailable. Try a different browser.';
      case 'audio-busy':
        return 'Audio system busy. Wait a moment and try again.';
      case 'audio-hardware':
        return 'Audio hardware issue. Check your speakers/headphones.';
      case 'language-unavailable':
        return 'Speech language not available. Trying default voice.';
      case 'voice-unavailable':
        return 'Selected voice unavailable. Using default voice.';
      case 'text-too-long':
        return 'Text too long for speech synthesis.';
      case 'invalid-argument':
        return 'Invalid speech parameters. Using defaults.';
      case 'not-allowed':
        return 'Speech not allowed. Check browser permissions.';
      default:
        return `Speech error: ${error}. Try refreshing the page.`;
    }
  }

  // Clear error state when user interaction is enabled
  enableUserInteraction(): void {
    if (!this.state.hasUserInteracted) {
      this.updateState({ 
        hasUserInteracted: true,
        lastError: undefined // Clear any previous errors
      });
      console.log('🎤 User interaction enabled for speech');
    }
  }

  toggleEnabled(): void {
    const newEnabled = !this.state.isEnabled;
    this.updateState({ isEnabled: newEnabled });
    
    if (!newEnabled && this.state.isSpeaking) {
      this.stop();
    }
    
    console.log('🎤 Speech', newEnabled ? 'enabled' : 'disabled');
  }

  async speak(text: string, priority: boolean = false): Promise<void> {
    if (!this.canSpeak()) {
      const reason = this.getCannotSpeakReason();
      console.log('🚫 Cannot speak:', reason);
      this.updateState({ lastError: reason });
      return;
    }

    if (priority) {
      this.speechQueue.unshift({ text, priority });
    } else {
      this.speechQueue.push({ text, priority });
    }

    if (!this.isProcessingQueue) {
      await this.processQueue();
    }
  }

  private getCannotSpeakReason(): string {
    if (!('speechSynthesis' in window)) {
      return 'Speech synthesis not supported in this browser. Try Chrome, Edge, or Firefox.';
    }
    if (!this.state.isEnabled) {
      return 'Speech is disabled. Click the volume button to enable it.';
    }
    if (!this.state.hasUserInteracted) {
      return 'User interaction required. Click any speech button to enable audio.';
    }
    if (!this.state.isReady) {
      if (this.state.isLoading) {
        return 'Speech system is still loading. Please wait...';
      }
      return 'Speech system not ready. Try refreshing the page.';
    }
    return 'Speech unavailable for unknown reason.';
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessingQueue || this.speechQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;

    while (this.speechQueue.length > 0) {
      const { text, priority } = this.speechQueue.shift()!;
      
      if (priority) {
        this.stop(); // Clear any current speech for priority messages
      }

      await this.speakImmediate(text);
    }

    this.isProcessingQueue = false;
  }

  private async speakImmediate(text: string): Promise<void> {
    return new Promise((resolve) => {
      if (!this.canSpeak()) {
        resolve();
        return;
      }

      // Clean up text
      const cleanText = text
        .replace(/\(Session:\s*\d+\)/gi, '')
        .replace(/\(\d{13,}\)/gi, '')
        .replace(/\s+/g, ' ')
        .trim();

      if (!cleanText) {
        resolve();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = this.config.rate;
      utterance.pitch = this.config.pitch;
      utterance.volume = this.config.volume;
      
      if (this.config.voice) {
        utterance.voice = this.config.voice;
      }

      utterance.onstart = () => {
        this.updateState({ isSpeaking: true, currentUtterance: utterance });
        console.log('🔊 Nelie speaking:', cleanText.substring(0, 50) + '...');
      };

      utterance.onend = () => {
        this.updateState({ isSpeaking: false, currentUtterance: null });
        console.log('🔇 Nelie finished speaking');
        resolve();
      };

      utterance.onerror = (event) => {
        console.error('🚫 Speech error:', event.error);
        const errorMessage = this.getSpeechErrorMessage(event.error);
        this.updateState({ 
          isSpeaking: false, 
          currentUtterance: null,
          lastError: errorMessage 
        });
        resolve();
      };

      speechSynthesis.speak(utterance);
    });
  }

  stop(): void {
    speechSynthesis.cancel();
    this.speechQueue.length = 0; // Clear queue
    this.updateState({ isSpeaking: false, currentUtterance: null });
    console.log('🛑 Nelie stopped speaking');
  }

  private canSpeak(): boolean {
    return (
      'speechSynthesis' in window &&
      this.state.isEnabled &&
      this.state.hasUserInteracted &&
      this.state.isReady
    );
  }

  // Test speech functionality
  async test(): Promise<void> {
    this.enableUserInteraction();
    await this.speak("Hello! I'm Nelie, your AI learning companion. Speech system test successful!", true);
  }

  // Nelie personality speaking
  async speakAsNelie(text: string, priority: boolean = false): Promise<void> {
    const nelieText = text.startsWith('Nelie') ? text : `Nelie says: ${text}`;
    await this.speak(nelieText, priority);
  }
}

export const unifiedSpeech = UnifiedSpeechSystem.getInstance();
