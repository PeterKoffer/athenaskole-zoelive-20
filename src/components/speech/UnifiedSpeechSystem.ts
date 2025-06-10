
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
  lastError: string | null;
  isLoading: boolean;
  voicesLoaded: boolean;
}

interface SpeechQueue {
  text: string;
  priority: boolean;
  timestamp: number;
  id: string;
}

class UnifiedSpeechSystem {
  private state: SpeechState = {
    isSpeaking: false,
    isEnabled: true,
    hasUserInteracted: false,
    isReady: false,
    currentUtterance: null,
    lastError: null,
    isLoading: false,
    voicesLoaded: false
  };

  private config: SpeechConfig = {
    rate: 0.85,
    pitch: 1.1,
    volume: 0.9
  };

  private listeners: ((state: SpeechState) => void)[] = [];
  private speechQueue: SpeechQueue[] = [];
  private isProcessingQueue = false;
  private lastSpokenText = '';
  private lastSpokenTime = 0;
  private repeatPreventionTime = 3000; // Prevent same text within 3 seconds
  private maxRetries = 3;
  private retryCount = 0;

  constructor() {
    this.initializeSpeechSystem();
  }

  private async initializeSpeechSystem() {
    console.log('🎤 Initializing Unified Speech System...');
    
    if (typeof speechSynthesis === 'undefined') {
      this.updateState({ 
        lastError: 'Speech synthesis not supported in this browser',
        isReady: false 
      });
      return;
    }

    this.updateState({ isLoading: true });

    // Wait for voices to load with timeout
    await this.waitForVoices();
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Test basic functionality
    await this.performInitialTest();
  }

  private async waitForVoices(timeout = 5000): Promise<void> {
    return new Promise((resolve) => {
      const checkVoices = () => {
        const voices = speechSynthesis.getVoices();
        if (voices.length > 0) {
          console.log('✅ Speech voices loaded:', voices.length);
          this.selectOptimalVoice(voices);
          this.updateState({ 
            voicesLoaded: true,
            isLoading: false,
            isReady: true,
            lastError: null 
          });
          resolve();
        }
      };

      // Check immediately
      checkVoices();
      
      // Set up event listener for voice changes
      speechSynthesis.addEventListener('voiceschanged', checkVoices);
      
      // Timeout fallback
      setTimeout(() => {
        if (!this.state.voicesLoaded) {
          console.log('⚠️ Voice loading timeout - using browser default');
          this.updateState({ 
            voicesLoaded: true,
            isLoading: false,
            isReady: true,
            lastError: 'Using browser default voice'
          });
        }
        resolve();
      }, timeout);
    });
  }

  private selectOptimalVoice(voices: SpeechSynthesisVoice[]) {
    // Priority order for voice selection
    const preferredVoices = [
      'Google US English Female',
      'Microsoft Zira',
      'Samantha',
      'Karen',
      'Victoria',
      'Google UK English Female'
    ];

    let selectedVoice = null;

    // Try to find preferred voices
    for (const preferred of preferredVoices) {
      selectedVoice = voices.find(voice => 
        voice.name.includes(preferred) && voice.lang.startsWith('en')
      );
      if (selectedVoice) break;
    }

    // Fallback to any female English voice
    if (!selectedVoice) {
      selectedVoice = voices.find(voice => 
        voice.lang.startsWith('en') && 
        (voice.name.toLowerCase().includes('female') || 
         voice.name.toLowerCase().includes('woman'))
      );
    }

    // Final fallback to any English voice
    if (!selectedVoice) {
      selectedVoice = voices.find(voice => voice.lang.startsWith('en'));
    }

    this.config.voice = selectedVoice || undefined;
    console.log('🎤 Selected voice:', selectedVoice?.name || 'Browser default');
  }

  private setupEventListeners() {
    // Listen for visibility changes to pause/resume speech
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.state.isSpeaking) {
        this.stop();
      }
    });

    // Listen for user interaction to enable speech
    const enableOnInteraction = () => {
      if (!this.state.hasUserInteracted) {
        this.updateState({ hasUserInteracted: true });
        console.log('✅ User interaction detected - speech enabled');
      }
    };

    ['click', 'touchstart', 'keydown'].forEach(event => {
      document.addEventListener(event, enableOnInteraction, { once: true });
    });
  }

  private async performInitialTest(): Promise<void> {
    try {
      // Test if speech synthesis is working
      const testUtterance = new SpeechSynthesisUtterance('');
      testUtterance.volume = 0; // Silent test
      speechSynthesis.speak(testUtterance);
      
      console.log('✅ Speech synthesis test passed');
    } catch (error) {
      console.error('❌ Speech synthesis test failed:', error);
      this.updateState({ 
        lastError: 'Speech test failed: ' + (error as Error).message 
      });
    }
  }

  private updateState(updates: Partial<SpeechState>) {
    this.state = { ...this.state, ...updates };
    this.notifyListeners();
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.state));
  }

  subscribe(listener: (state: SpeechState) => void): () => void {
    this.listeners.push(listener);
    listener(this.state); // Immediate call with current state
    
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  getState(): SpeechState {
    return { ...this.state };
  }

  async speak(text: string, priority: boolean = false): Promise<void> {
    if (!text || text.trim().length === 0) {
      console.log('🚫 Empty text, skipping speech');
      return;
    }

    // Prevent repetition
    const now = Date.now();
    if (text === this.lastSpokenText && (now - this.lastSpokenTime) < this.repeatPreventionTime) {
      console.log('🚫 Preventing repetition of:', text.substring(0, 30) + '...');
      return;
    }

    const speechItem: SpeechQueue = {
      text: text.trim(),
      priority,
      timestamp: now,
      id: Math.random().toString(36).substr(2, 9)
    };

    if (priority) {
      this.speechQueue.unshift(speechItem); // Add to front
      this.stop(); // Stop current speech
    } else {
      this.speechQueue.push(speechItem); // Add to end
    }

    this.processQueue();
  }

  async speakAsNelie(text: string, priority: boolean = false): Promise<void> {
    if (!text) return;
    
    // Add Nelie's personality to the speech
    const nelieText = text.startsWith('Nelie') ? text : text;
    await this.speak(nelieText, priority);
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessingQueue || this.speechQueue.length === 0) {
      return;
    }

    if (!this.state.isEnabled || !this.state.hasUserInteracted) {
      console.log('🚫 Speech disabled or no user interaction');
      this.speechQueue = []; // Clear queue
      return;
    }

    this.isProcessingQueue = true;

    while (this.speechQueue.length > 0) {
      const item = this.speechQueue.shift()!;
      await this.speakItem(item);
      
      // Small delay between items
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    this.isProcessingQueue = false;
  }

  private async speakItem(item: SpeechQueue): Promise<void> {
    return new Promise((resolve) => {
      if (typeof speechSynthesis === 'undefined') {
        console.error('❌ Speech synthesis not available');
        resolve();
        return;
      }

      console.log('🔊 Nelie speaking:', item.text.substring(0, 50) + '...');

      const utterance = new SpeechSynthesisUtterance(item.text);
      
      // Apply configuration
      utterance.rate = this.config.rate;
      utterance.pitch = this.config.pitch;
      utterance.volume = this.config.volume;
      
      if (this.config.voice) {
        utterance.voice = this.config.voice;
      }

      // Set up event handlers
      utterance.onstart = () => {
        this.updateState({ 
          isSpeaking: true, 
          currentUtterance: utterance,
          lastError: null 
        });
      };

      utterance.onend = () => {
        this.updateState({ 
          isSpeaking: false, 
          currentUtterance: null 
        });
        this.lastSpokenText = item.text;
        this.lastSpokenTime = Date.now();
        this.retryCount = 0;
        resolve();
      };

      utterance.onerror = (event) => {
        console.error('❌ Speech error:', event.error);
        this.updateState({ 
          isSpeaking: false, 
          currentUtterance: null,
          lastError: `Speech error: ${event.error}` 
        });
        
        // Retry logic
        if (this.retryCount < this.maxRetries && event.error !== 'canceled') {
          this.retryCount++;
          console.log(`🔄 Retrying speech (${this.retryCount}/${this.maxRetries})`);
          setTimeout(() => {
            speechSynthesis.speak(utterance);
          }, 1000);
        } else {
          resolve();
        }
      };

      // Cancel any existing speech
      speechSynthesis.cancel();
      
      // Start speaking
      try {
        speechSynthesis.speak(utterance);
      } catch (error) {
        console.error('❌ Failed to start speech:', error);
        this.updateState({ 
          lastError: 'Failed to start speech: ' + (error as Error).message 
        });
        resolve();
      }
    });
  }

  stop(): void {
    if (typeof speechSynthesis !== 'undefined') {
      speechSynthesis.cancel();
    }
    
    this.speechQueue = []; // Clear queue
    this.updateState({ 
      isSpeaking: false, 
      currentUtterance: null 
    });
    
    console.log('🔇 Speech stopped and queue cleared');
  }

  toggleEnabled(): void {
    const newState = !this.state.isEnabled;
    this.updateState({ isEnabled: newState });
    
    if (!newState) {
      this.stop(); // Stop current speech when disabled
    }
    
    console.log(newState ? '🔊 Speech enabled' : '🔇 Speech disabled');
  }

  enableUserInteraction(): void {
    this.updateState({ hasUserInteracted: true });
    console.log('✅ User interaction manually enabled');
  }

  async test(): Promise<void> {
    const testMessage = "Hi! I'm Nelie, your learning companion. My voice system is working perfectly!";
    console.log('🧪 Testing Nelie\'s voice...');
    await this.speak(testMessage, true);
  }
}

// Create singleton instance
export const unifiedSpeech = new UnifiedSpeechSystem();
