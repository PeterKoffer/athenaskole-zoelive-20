
import { SpeechSystemQueue } from './SpeechSystemQueue';
import { SpeechOrchestrator } from './SpeechOrchestrator';
import { SpeechConfig } from './SpeechConfig';
import { SpeechState } from './SpeechState';

export class SpeechQueueProcessor {
  private isProcessing = false;

  constructor(
    private queue: SpeechSystemQueue,
    private orchestrator: SpeechOrchestrator
  ) {}

  async processQueue(
    config: SpeechConfig,
    state: SpeechState,
    updateState: (updates: Partial<SpeechState>) => void
  ): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) return;
    
    if (!state.isEnabled || !state.hasUserInteracted) {
      console.warn("[SpeechQueueProcessor] Speech is not enabled or user has not interacted - queue will be cleared.");
      this.queue.clear();
      return;
    }

    this.isProcessing = true;
    
    while (this.queue.length > 0) {
      const item = this.queue.shift()!;
      console.log("[SpeechQueueProcessor] Processing next speech item:", item.text.substring(0, 50));
      
      await this.orchestrator.processSpeechRequest(
        item.text,
        config,
        state,
        updateState,
        () => {} // onComplete callback
      );
      
      await new Promise((res) => setTimeout(res, 300));
    }
    
    this.isProcessing = false;
  }

  get isProcessingQueue(): boolean {
    return this.isProcessing;
  }
}
