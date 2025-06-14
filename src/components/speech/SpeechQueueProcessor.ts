
import { SpeechSystemQueue } from './SpeechSystemQueue';
import { SpeechOrchestrator } from './SpeechOrchestrator';
import { SpeechConfig } from './SpeechConfig';
import { SpeechState } from './SpeechState';
import { speakWithEngines } from './SpeechEngines';

export class SpeechQueueProcessor {
  constructor(
    private queue: SpeechSystemQueue,
    private orchestrator: SpeechOrchestrator
  ) {}

  async processQueue(
    config: SpeechConfig,
    state: SpeechState,
    updateState: (updates: Partial<SpeechState>) => void
  ): Promise<void> {
    if (state.isSpeaking || this.queue.isEmpty()) {
      return;
    }

    const nextItem = this.queue.getNext();
    if (!nextItem) {
      return;
    }

    console.log('🎤 [SpeechQueueProcessor] Processing:', nextItem.substring(0, 50));
    
    updateState({ isSpeaking: true, currentUtterance: null });

    try {
      await speakWithEngines(
        nextItem,
        config.preferElevenLabs && state.usingElevenLabs, // Use ElevenLabs if available and preferred
        config,
        updateState,
        () => {
          console.log('🏁 [SpeechQueueProcessor] Speech completed');
          updateState({ isSpeaking: false, currentUtterance: null });
          // Process next item in queue
          setTimeout(() => {
            this.processQueue(config, { ...state, isSpeaking: false }, updateState);
          }, 100);
        },
        state.usingElevenLabs || false, // shouldTryElevenLabs
        state.isCheckingElevenLabs
      );
    } catch (error) {
      console.error('❌ [SpeechQueueProcessor] Error processing speech:', error);
      updateState({ 
        isSpeaking: false, 
        currentUtterance: null,
        lastError: error instanceof Error ? error.message : 'Speech processing failed'
      });
    }
  }
}
