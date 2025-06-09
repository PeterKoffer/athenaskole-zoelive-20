
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
}

export class UnifiedSpeechSystem {
  private static instance: UnifiedSpeechSystem;
  private state: SpeechState = {
    isSpeaking: false,
    isEnabled: true,
    hasUserInteracted: false,
    isReady: false,
    currentUtterance: null
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
      if (speechSynthesis.getVoices().length > 0) {
        resolve();
        return;
      }

      const checkVoices = () => {
        if (speechSynthesis.getVoices().length > 0) {
          speechSynthesis.removeEventListener('voiceschanged', checkVoices);
          resolve();
        }
      };

      speechSynthesis.addEventListener('voiceschanged', checkVoices);
      
      // Fallback timeout
      setTimeout(() => {
        speechSynthesis.removeEventListener('voiceschanged', checkVoices);
        resolve();
      }, 3000);
    });
  }

  private setupSpeechSynthesis(): void {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported');
      return;
    }

    this.voicesLoadedPromise.then(() => {
      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Google') && voice.lang.startsWith('en') ||
        voice.name.includes('Microsoft') && voice.lang.startsWith('en') ||
        voice.lang.startsWith('en-US')
      );
      
      if (preferredVoice) {
        this.config.voice = preferredVoice;
      }
      
      this.updateState({ isReady: true });
      console.log('🎤 Unified Speech System ready with voice:', preferredVoice?.name || 'default');
    });
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

  enableUserInteraction(): void {
    if (!this.state.hasUserInteracted) {
      this.updateState({ hasUserInteracted: true });
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
      console.log('🚫 Cannot speak:', { 
        enabled: this.state.isEnabled, 
        hasUserInteracted: this.state.hasUserInteracted,
        isReady: this.state.isReady 
      });
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
        this.updateState({ isSpeaking: false, currentUtterance: null });
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
