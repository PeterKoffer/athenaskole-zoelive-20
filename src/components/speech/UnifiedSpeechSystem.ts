
// The unified orchestrator: now delegates state, config, queue, listener logic to submodules.

import { elevenLabsSpeechEngine } from './ElevenLabsSpeechEngine';
import { browserSpeechEngine } from './BrowserSpeechEngine';
import { getDefaultSpeechConfig, SpeechConfig } from './SpeechConfig';
import { SpeechState, getDefaultSpeechState } from './SpeechState';
import { setupPageVisibilityListener, setupUserInteractionListeners } from './EventListeners';
import { speakWithEngines } from './SpeechEngines';
import { SpeechSystemQueue } from "./SpeechSystemQueue";
import { initializeSpeechEngines } from "./SpeechInitializer";

class UnifiedSpeechSystem {
  private state: SpeechState = getDefaultSpeechState();
  private config: SpeechConfig = getDefaultSpeechConfig();

  private listeners: ((state: SpeechState) => void)[] = [];
  private queue = new SpeechSystemQueue();
  private isProcessingQueue = false;
  private lastSpokenText = '';
  private lastSpokenTime = 0;
  private repeatPreventionTime = 3000;
  private maxRetries = 3;
  private retryCount = 0;

  constructor() {
    this.initializeSpeechSystem();
  }

  private async initializeSpeechSystem() {
    await initializeSpeechEngines(this.config, (updates) => this.updateState(updates), this.state);
    setupPageVisibilityListener(() => this.stop(), this.state.isSpeaking);
    setupUserInteractionListeners(() => this.updateState({ hasUserInteracted: true }), this.state.hasUserInteracted);
  }

  private updateState(updates: Partial<SpeechState>) {
    this.state = { ...this.state, ...updates };
    this.notifyListeners();
  }

  private notifyListeners() {
    this.listeners.forEach((l) => l(this.state));
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
    if (!text || text.trim().length === 0) return;
    if (!this.state.isReady) await this.initializeSpeechSystem();

    const now = Date.now();
    if (text === this.lastSpokenText && now - this.lastSpokenTime < this.repeatPreventionTime) return;

    this.queue.addItem(text, priority);
    if (priority) this.stop();
    this.processQueue();
  }

  async speakAsNelie(text: string, priority: boolean = false): Promise<void> {
    if (!text) return;
    let nelieText = text;
    if (
      Math.random() < 0.2 &&
      !text.includes('Hi') &&
      !text.includes('Let')
    ) {
      const phrases = [
        'Hi there!',
        'Let me help you with that!',
        "That's a great question!",
      ];
      nelieText = `${phrases[Math.floor(Math.random() * phrases.length)]} ${text}`;
    }
    await this.speak(nelieText, priority);
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessingQueue || this.queue.length === 0) return;
    if (!this.state.isEnabled || !this.state.hasUserInteracted) {
      this.queue.clear();
      return;
    }
    this.isProcessingQueue = true;
    while (this.queue.length > 0) {
      const item = this.queue.shift()!;
      await new Promise<void>((resolve) => {
        speakWithEngines(
          item.text,
          this.state.usingElevenLabs,
          this.config,
          (upd) => this.updateState(upd),
          () => {
            this.lastSpokenText = item.text;
            this.lastSpokenTime = Date.now();
            this.retryCount = 0;
            resolve();
          },
          this.config.preferElevenLabs
        );
      });
      await new Promise((res) => setTimeout(res, 300));
    }
    this.isProcessingQueue = false;
  }

  stop(): void {
    if (typeof speechSynthesis !== "undefined") speechSynthesis.cancel();
    this.queue.clear();
    this.updateState({
      isSpeaking: false,
      currentUtterance: null,
    });
  }

  toggleEnabled(): void {
    const newState = !this.state.isEnabled;
    this.updateState({ isEnabled: newState });
    if (!newState) this.stop();
  }

  enableUserInteraction(): void {
    this.updateState({ hasUserInteracted: true });
  }

  async test(): Promise<void> {
    const testMessage =
      "Hi! I'm Nelie, your learning companion. My enhanced voice system with ElevenLabs is working perfectly! I'm so excited to help you learn!";
    await this.speak(testMessage, true);
  }
}

export const unifiedSpeech = new UnifiedSpeechSystem();

