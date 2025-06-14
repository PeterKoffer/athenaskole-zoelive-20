
import { getDefaultSpeechConfig, SpeechConfig } from './SpeechConfig';
import { SpeechState } from './SpeechState';
import { setupPageVisibilityListener, setupUserInteractionListeners } from './EventListeners';
import { SpeechSystemQueue } from "./SpeechSystemQueue";
import { initializeSpeechEngines } from "./SpeechInitializer";
import { SpeechStateManager } from './SpeechStateManager';
import { SpeechOrchestrator } from './SpeechOrchestrator';
import { SpeechQueueProcessor } from './SpeechQueueProcessor';

class UnifiedSpeechSystem {
  private config: SpeechConfig = getDefaultSpeechConfig();
  private stateManager = new SpeechStateManager();
  private queue = new SpeechSystemQueue();
  private orchestrator = new SpeechOrchestrator();
  private queueProcessor = new SpeechQueueProcessor(this.queue, this.orchestrator);

  constructor() {
    this.initializeSpeechSystem();
  }

  private async initializeSpeechSystem() {
    this.stateManager.updateState({ isCheckingElevenLabs: true, isLoading: true });
    
    try {
      await initializeSpeechEngines(
        this.config, 
        (updates) => this.stateManager.updateState(updates),
        this.stateManager.getState()
      );
    } catch (error) {
      console.error("[UnifiedSpeechSystem] CRITICAL ERROR during initialization:", error);
      this.stateManager.updateState({ 
          lastError: "Critical initialization error",
          isReady: false,
          isLoading: false,
      });
    } finally {
      this.stateManager.updateState({ isCheckingElevenLabs: false });
    }

    console.log("🔧 [UnifiedSpeechSystem] initializeSpeechSystem done", {
      usingElevenLabs: this.stateManager.getState().usingElevenLabs,
      isReady: this.stateManager.getState().isReady,
      isLoading: this.stateManager.getState().isLoading,
      lastError: this.stateManager.getState().lastError,
      isCheckingElevenLabs: this.stateManager.getState().isCheckingElevenLabs
    });

    const state = this.stateManager.getState();
    setupPageVisibilityListener(() => this.stop(), state.isSpeaking);
    setupUserInteractionListeners(
      () => this.stateManager.updateState({ hasUserInteracted: true }),
      state.hasUserInteracted
    );
  }

  subscribe(listener: (state: SpeechState) => void): () => void {
    return this.stateManager.subscribe(listener);
  }

  getState(): SpeechState {
    return this.stateManager.getState();
  }

  async speak(text: string, priority: boolean = false): Promise<void> {
    if (!text || text.trim().length === 0) {
      console.log('[UnifiedSpeechSystem] speak() called with empty or blank text, aborting.');
      return;
    }
    
    const state = this.stateManager.getState();
    console.log("📝 [UnifiedSpeechSystem] speak() called", {
      text,
      priority,
      isCheckingElevenLabs: state.isCheckingElevenLabs,
      usingElevenLabs: state.usingElevenLabs,
      isReady: state.isReady,
      hasUserInteracted: state.hasUserInteracted,
      isEnabled: state.isEnabled
    });

    if (state.isCheckingElevenLabs) {
      console.log('⏳ [UnifiedSpeechSystem] Waiting for ElevenLabs readiness before speaking:', text.substring(0, 40));
      setTimeout(() => this.speak(text, priority), 300);
      return;
    }

    if (!state.isReady) {
      console.log('[UnifiedSpeechSystem] Speech system not ready, re-initializing...');
      await this.initializeSpeechSystem();
    }

    console.log(`[UnifiedSpeechSystem] Adding item to queue: "${text.substring(0,40)}..." with priority=${priority}`);
    this.queue.addItem(text, priority);

    if (priority) {
      console.log('[UnifiedSpeechSystem] Priority speech requested, calling stop()');
      this.stop();
    }

    // Debug queue items
    console.log("[UnifiedSpeechSystem] Queue after add:", this.queue);

    this.processQueue();
  }

  async speakAsNelie(text: string, priority: boolean = false): Promise<void> {
    if (!text) return;
    const nelieText = this.orchestrator.addNeliePersonality(text);
    await this.speak(nelieText, priority);
  }

  private async processQueue(): Promise<void> {
    const state = this.stateManager.getState();
    console.log("[UnifiedSpeechSystem] processQueue called", {
      isSpeaking: state.isSpeaking,
      isReady: state.isReady,
      isEnabled: state.isEnabled,
      queue: this.queue,
    });
    await this.queueProcessor.processQueue(
      this.config,
      state,
      (updates) => this.stateManager.updateState(updates)
    );
  }

  stop(): void {
    console.log('[UnifiedSpeechSystem] stop() called - this will cancel current speech & clear queue');
    if (typeof speechSynthesis !== "undefined") speechSynthesis.cancel();
    this.queue.clear();
    this.stateManager.updateState({
      isSpeaking: false,
      currentUtterance: null,
    });
  }

  toggleEnabled(): void {
    const currentState = this.stateManager.getState();
    const newState = !currentState.isEnabled;
    console.log(`[UnifiedSpeechSystem] toggleEnabled() - switching isEnabled from ${currentState.isEnabled} to ${newState}`);
    this.stateManager.updateState({ isEnabled: newState });
    if (!newState) this.stop();
  }

  enableUserInteraction(): void {
    console.log("[UnifiedSpeechSystem] enableUserInteraction() called");
    this.stateManager.updateState({ hasUserInteracted: true });
  }

  async test(): Promise<void> {
    const testMessage = "Hi! I'm Nelie, your learning companion. My enhanced voice system with ElevenLabs is working perfectly! I'm so excited to help you learn!";
    await this.speak(testMessage, true);
  }
}

export const unifiedSpeech = new UnifiedSpeechSystem();

