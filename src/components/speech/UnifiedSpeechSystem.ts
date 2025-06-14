
import { elevenLabsService } from './ElevenLabsService';

interface SpeechConfig {
  rate: number;
  pitch: number;
  volume: number;
  voice?: SpeechSynthesisVoice;
  preferElevenLabs: boolean;
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
  usingElevenLabs: boolean;
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
    voicesLoaded: false,
    usingElevenLabs: false
  };

  private config: SpeechConfig = {
    rate: 0.8,
    pitch: 1.1,
    volume: 0.85,
    preferElevenLabs: true
  };

  private listeners: ((state: SpeechState) => void)[] = [];
  private speechQueue: SpeechQueue[] = [];
  private isProcessingQueue = false;
  private lastSpokenText = '';
  private lastSpokenTime = 0;
  private repeatPreventionTime = 3000;
  private maxRetries = 3;
  private retryCount = 0;
  private currentAudio: HTMLAudioElement | null = null;

  constructor() {
    this.initializeSpeechSystem();
  }

  private async initializeSpeechSystem() {
    console.log('🎤 Initializing Enhanced Speech System with ElevenLabs...');
    
    this.updateState({ isLoading: true });

    // Check ElevenLabs availability
    const elevenLabsAvailable = elevenLabsService.isServiceAvailable();
    
    if (elevenLabsAvailable && this.config.preferElevenLabs) {
      console.log('✅ ElevenLabs available - using high-quality voice synthesis');
      this.updateState({ 
        usingElevenLabs: true,
        isReady: true,
        isLoading: false,
        lastError: null 
      });
    } else {
      console.log('🔄 Falling back to browser speech synthesis');
      await this.initializeBrowserSpeech();
    }

    this.setupEventListeners();
  }

  private async initializeBrowserSpeech() {
    if (typeof speechSynthesis === 'undefined') {
      this.updateState({ 
        lastError: 'Speech synthesis not supported in this browser',
        isReady: false,
        isLoading: false
      });
      return;
    }

    await this.waitForVoices();
    await this.performInitialTest();
  }

  private async waitForVoices(timeout = 5000): Promise<void> {
    return new Promise((resolve) => {
      const checkVoices = () => {
        const voices = speechSynthesis.getVoices();
        if (voices.length > 0) {
          console.log('✅ Browser speech voices loaded:', voices.length);
          this.selectOptimalVoiceForNelie(voices);
          this.updateState({ 
            voicesLoaded: true,
            isLoading: false,
            isReady: true,
            lastError: null 
          });
          resolve();
        }
      };

      checkVoices();
      speechSynthesis.addEventListener('voiceschanged', checkVoices);
      
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

  private selectOptimalVoiceForNelie(voices: SpeechSynthesisVoice[]) {
    const preferredVoices = [
      'Google US English Female',
      'Microsoft Zira Desktop',
      'Karen',
      'Samantha',
      'Victoria'
    ];

    let selectedVoice = null;

    for (const preferred of preferredVoices) {
      selectedVoice = voices.find(voice => 
        voice.name.includes(preferred) && voice.lang.startsWith('en')
      );
      if (selectedVoice) {
        console.log('🎯 Found preferred voice for Nelie:', selectedVoice.name);
        break;
      }
    }

    if (!selectedVoice) {
      selectedVoice = voices.find(voice => 
        voice.lang.startsWith('en') && 
        (voice.name.toLowerCase().includes('female') || 
         voice.name.toLowerCase().includes('woman'))
      );
    }

    if (!selectedVoice) {
      selectedVoice = voices.find(voice => voice.lang.startsWith('en'));
    }

    this.config.voice = selectedVoice || undefined;
    console.log('🎤 Selected browser voice for Nelie:', selectedVoice?.name || 'Browser default');
  }

  private setupEventListeners() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.state.isSpeaking) {
        this.stop();
      }
    });

    const enableOnInteraction = () => {
      if (!this.state.hasUserInteracted) {
        this.updateState({ hasUserInteracted: true });
        console.log('✅ User interaction detected - Nelie can now speak!');
      }
    };

    ['click', 'touchstart', 'keydown'].forEach(event => {
      document.addEventListener(event, enableOnInteraction, { once: true });
    });
  }

  private async performInitialTest(): Promise<void> {
    try {
      const testUtterance = new SpeechSynthesisUtterance('');
      testUtterance.volume = 0;
      speechSynthesis.speak(testUtterance);
      
      console.log('✅ Browser speech synthesis test passed');
    } catch (error) {
      console.error('❌ Browser speech synthesis test failed:', error);
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
    listener(this.state);
    
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
      this.speechQueue.unshift(speechItem);
      this.stop();
    } else {
      this.speechQueue.push(speechItem);
    }

    this.processQueue();
  }

  async speakAsNelie(text: string, priority: boolean = false): Promise<void> {
    if (!text) return;
    
    let nelieText = text;
    if (Math.random() < 0.2 && !text.includes('Hi') && !text.includes('Let')) {
      const phrases = [
        "Hi there!",
        "Let me help you with that!",
        "That's a great question!"
      ];
      const phrase = phrases[Math.floor(Math.random() * phrases.length)];
      nelieText = `${phrase} ${text}`;
    }
    
    await this.speak(nelieText, priority);
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessingQueue || this.speechQueue.length === 0) {
      return;
    }

    if (!this.state.isEnabled || !this.state.hasUserInteracted) {
      console.log('🚫 Speech disabled or no user interaction');
      this.speechQueue = [];
      return;
    }

    this.isProcessingQueue = true;

    while (this.speechQueue.length > 0) {
      const item = this.speechQueue.shift()!;
      await this.speakItem(item);
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    this.isProcessingQueue = false;
  }

  private async speakItem(item: SpeechQueue): Promise<void> {
    return new Promise(async (resolve) => {
      console.log('🔊 Nelie speaking:', item.text.substring(0, 50) + '...');

      // Try ElevenLabs first if available and preferred
      if (this.state.usingElevenLabs && this.config.preferElevenLabs) {
        try {
          const audioResponse = await elevenLabsService.generateSpeech(item.text);
          
          if (audioResponse.audioContent && !audioResponse.error) {
            this.updateState({ 
              isSpeaking: true, 
              lastError: null 
            });

            await elevenLabsService.playAudio(audioResponse.audioContent);
            
            this.updateState({ 
              isSpeaking: false 
            });
            
            this.lastSpokenText = item.text;
            this.lastSpokenTime = Date.now();
            console.log('🎤 ElevenLabs speech completed successfully');
            resolve();
            return;
          } else {
            console.log('🔄 ElevenLabs failed, falling back to browser speech:', audioResponse.error);
            // Fall through to browser speech
          }
        } catch (error) {
          console.log('🔄 ElevenLabs error, falling back to browser speech:', error);
          // Fall through to browser speech
        }
      }

      // Fallback to browser speech synthesis
      this.speakWithBrowserSynthesis(item, resolve);
    });
  }

  private speakWithBrowserSynthesis(item: SpeechQueue, resolve: () => void): void {
    if (typeof speechSynthesis === 'undefined') {
      console.error('❌ Browser speech synthesis not available');
      resolve();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(item.text);
    
    utterance.rate = this.config.rate;
    utterance.pitch = this.config.pitch;
    utterance.volume = this.config.volume;
    
    if (this.config.voice) {
      utterance.voice = this.config.voice;
    }

    utterance.onstart = () => {
      this.updateState({ 
        isSpeaking: true, 
        currentUtterance: utterance,
        lastError: null 
      });
      console.log('🎤 Browser speech started');
    };

    utterance.onend = () => {
      this.updateState({ 
        isSpeaking: false, 
        currentUtterance: null 
      });
      this.lastSpokenText = item.text;
      this.lastSpokenTime = Date.now();
      this.retryCount = 0;
      console.log('🎤 Browser speech finished');
      resolve();
    };

    utterance.onerror = (event) => {
      console.error('❌ Browser speech error:', event.error);
      this.updateState({ 
        isSpeaking: false, 
        currentUtterance: null,
        lastError: `Browser speech error: ${event.error}` 
      });
      
      if (this.retryCount < this.maxRetries && event.error !== 'canceled') {
        this.retryCount++;
        console.log(`🔄 Retrying browser speech (${this.retryCount}/${this.maxRetries})`);
        setTimeout(() => {
          speechSynthesis.speak(utterance);
        }, 1000);
      } else {
        resolve();
      }
    };

    speechSynthesis.cancel();
    
    try {
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('❌ Failed to start browser speech:', error);
      this.updateState({ 
        lastError: 'Failed to start speech: ' + (error as Error).message 
      });
      resolve();
    }
  }

  stop(): void {
    // Stop ElevenLabs audio if playing
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }

    // Stop browser speech synthesis
    if (typeof speechSynthesis !== 'undefined') {
      speechSynthesis.cancel();
    }
    
    this.speechQueue = [];
    this.updateState({ 
      isSpeaking: false, 
      currentUtterance: null 
    });
    
    console.log('🔇 All Nelie speech stopped and queue cleared');
  }

  toggleEnabled(): void {
    const newState = !this.state.isEnabled;
    this.updateState({ isEnabled: newState });
    
    if (!newState) {
      this.stop();
    }
    
    console.log(newState ? '🔊 Nelie speech enabled' : '🔇 Nelie speech disabled');
  }

  enableUserInteraction(): void {
    this.updateState({ hasUserInteracted: true });
    console.log('✅ User interaction manually enabled for Nelie');
  }

  async test(): Promise<void> {
    const testMessage = "Hi! I'm Nelie, your learning companion. My enhanced voice system with ElevenLabs is working perfectly! I'm so excited to help you learn!";
    console.log('🧪 Testing Nelie\'s enhanced ElevenLabs voice...');
    await this.speak(testMessage, true);
  }
}

export const unifiedSpeech = new UnifiedSpeechSystem();
