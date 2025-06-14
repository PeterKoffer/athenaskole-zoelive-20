
import { SpeechStateManager } from './SpeechStateManager';
import { SpeechOrchestrator } from './SpeechOrchestrator';
import { SpeechSystemQueue } from './SpeechSystemQueue';
import { SpeechQueueProcessor } from './SpeechQueueProcessor';
import { getDefaultSpeechConfig } from './SpeechConfig';
import { speechDeduplication } from './SpeechDeduplicationManager';

class UnifiedSpeechSystem {
  private stateManager = new SpeechStateManager();
  private orchestrator = new SpeechOrchestrator();
  private queue = new SpeechSystemQueue();
  private processor = new SpeechQueueProcessor(this.queue, this.orchestrator);
  private config = getDefaultSpeechConfig();

  constructor() {
    this.initializeSpeechSystem();
  }

  private async initializeSpeechSystem() {
    console.log('🔧 [UnifiedSpeechSystem] Initializing...');
    await this.stateManager.initialize();
    console.log('🔧 [UnifiedSpeechSystem] initializeSpeechSystem done', this.stateManager.getState());
  }

  async speak(text: string, priority: boolean = false, context?: string): Promise<void> {
    if (!text?.trim()) return;

    // Check if this content has already been spoken
    if (speechDeduplication.hasBeenSpoken(text, context)) {
      console.log('🔇 Content already spoken, skipping:', text.substring(0, 50));
      return;
    }

    console.log('[UnifiedSpeechSystem] Speaking:', text.substring(0, 50), { priority, context });

    // Mark as spoken before adding to queue
    speechDeduplication.markAsSpoken(text, context);

    this.queue.addItem(text, priority);
    await this.processor.processQueue(
      this.config,
      this.stateManager.getState(),
      (updates) => this.stateManager.updateState(updates)
    );
  }

  async speakAsNelie(text: string, priority: boolean = false, context?: string): Promise<void> {
    if (!text?.trim()) return;

    // Check if this content has already been spoken
    if (speechDeduplication.hasBeenSpoken(text, context)) {
      console.log('🔇 Nelie content already spoken, skipping:', text.substring(0, 50));
      return;
    }

    const nelieText = this.orchestrator.addNeliePersonality(text);
    
    // Mark as spoken before processing
    speechDeduplication.markAsSpoken(text, context);
    
    console.log('[UnifiedSpeechSystem] Nelie speaking:', nelieText.substring(0, 50), { priority, context });

    this.queue.addItem(nelieText, priority);
    await this.processor.processQueue(
      this.config,
      this.stateManager.getState(),
      (updates) => this.stateManager.updateState(updates)
    );
  }

  // Allow content to be repeated (for manual repeat buttons)
  async repeatLastSpeech(text: string, context?: string): Promise<void> {
    if (!text?.trim()) return;

    console.log('[UnifiedSpeechSystem] Allowing repeat for:', text.substring(0, 50));
    speechDeduplication.allowRepeat(text, context);
    
    // Now speak it again
    await this.speak(text, true, context);
  }

  stop(): void {
    console.log('[UnifiedSpeechSystem] Stopping speech');
    this.queue.clear();
    this.stateManager.updateState({ 
      isSpeaking: false, 
      currentUtterance: null 
    });
  }

  toggleEnabled(): void {
    const currentState = this.stateManager.getState();
    const newEnabledState = !currentState.isEnabled;
    
    console.log('[UnifiedSpeechSystem] Toggling enabled:', newEnabledState);
    
    if (!newEnabledState) {
      this.stop();
      speechDeduplication.clearAll(); // Clear spoken content when disabling
    }
    
    this.stateManager.updateState({ isEnabled: newEnabledState });
  }

  enableUserInteraction(): void {
    console.log('[UnifiedSpeechSystem] Enabling user interaction');
    this.stateManager.updateState({ 
      hasUserInteracted: true,
      isEnabled: true 
    });
  }

  async test(): Promise<void> {
    const testText = "This is a test of Nelie's voice system.";
    // Don't use deduplication for test messages
    speechDeduplication.allowRepeat(testText, 'test');
    await this.speak(testText, true, 'test');
  }

  getState() {
    return this.stateManager.getState();
  }

  subscribe(callback: (state: any) => void) {
    return this.stateManager.subscribe(callback);
  }

  // Clear spoken content for new sessions
  clearSpokenContent(): void {
    speechDeduplication.clearAll();
  }
}

export const unifiedSpeech = new UnifiedSpeechSystem();
