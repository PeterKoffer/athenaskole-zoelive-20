
interface SpeechState {
  isSpeaking: boolean;
  isEnabled: boolean;
  hasUserInteracted: boolean;
  isReady: boolean;
  lastError: string | null;
  isLoading: boolean;
  isCheckingElevenLabs: boolean;
}

class UnifiedSpeechSystem {
  private state: SpeechState = {
    isSpeaking: false,
    isEnabled: true,
    hasUserInteracted: false,
    isReady: false,
    lastError: null,
    isLoading: false,
    isCheckingElevenLabs: false
  };

  private subscribers: ((state: SpeechState) => void)[] = [];
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private spokenContent = new Set<string>();

  constructor() {
    this.initialize();
  }

  private initialize() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.state.isReady = true;
      this.notifySubscribers();
    }
  }

  subscribe(callback: (state: SpeechState) => void) {
    this.subscribers.push(callback);
    callback(this.state); // Send current state immediately
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  private notifySubscribers() {
    this.subscribers.forEach(callback => callback(this.state));
  }

  getState() {
    return { ...this.state };
  }

  async speak(text: string, priority: boolean = false, context?: string) {
    return this.speakAsNelie(text, priority, context);
  }

  async speakAsNelie(text: string, priority: boolean = false, _context?: string) {
    if (!this.state.isEnabled || !text.trim()) return;

    // Simple deduplication
    const textKey = text.toLowerCase().trim();
    if (this.spokenContent.has(textKey) && !priority) {
      console.log('🔇 Skipping duplicate speech:', textKey.substring(0, 50));
      return;
    }

    try {
      this.stop();
      this.state.isSpeaking = true;
      this.notifySubscribers();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;

      utterance.onend = () => {
        this.state.isSpeaking = false;
        this.currentUtterance = null;
        this.spokenContent.add(textKey);
        this.notifySubscribers();
      };

      utterance.onerror = (error) => {
        console.error('Speech error:', error);
        this.state.isSpeaking = false;
        this.state.lastError = error.error;
        this.currentUtterance = null;
        this.notifySubscribers();
      };

      this.currentUtterance = utterance;
      speechSynthesis.speak(utterance);

      console.log('🔊 Nelie speaking:', text.substring(0, 50) + '...');
    } catch (error) {
      console.error('Speech synthesis error:', error);
      this.state.isSpeaking = false;
      this.state.lastError = error instanceof Error ? error.message : 'Unknown error';
      this.notifySubscribers();
    }
  }

  async repeatLastSpeech(text: string, _context?: string) {
    return this.speakAsNelie(text, true, context);
  }

  stop() {
    if (this.currentUtterance) {
      speechSynthesis.cancel();
      this.currentUtterance = null;
    }
    this.state.isSpeaking = false;
    this.notifySubscribers();
  }

  forceStopAll() {
    speechSynthesis.cancel();
    this.currentUtterance = null;
    this.state.isSpeaking = false;
    this.notifySubscribers();
  }

  toggleEnabled() {
    this.state.isEnabled = !this.state.isEnabled;
    if (!this.state.isEnabled) {
      this.stop();
    }
    this.notifySubscribers();
  }

  enableUserInteraction() {
    this.state.hasUserInteracted = true;
    this.notifySubscribers();
  }

  async test() {
    await this.speakAsNelie('Hello! I am Nelie, your AI learning companion!', true);
  }

  clearSpokenContent() {
    this.spokenContent.clear();
  }
}

export const unifiedSpeech = new UnifiedSpeechSystem();
