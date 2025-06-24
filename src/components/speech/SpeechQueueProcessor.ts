
import { SpeechConfig } from './SpeechConfig';
import { SpeechState } from './SpeechState';
import { SpeechOrchestrator } from './SpeechOrchestrator';
import { SpeechSystemQueue } from './SpeechSystemQueue';
import { speakWithEngines } from './SpeechEngines';
import { ElevenLabsEngine } from './engine/ElevenLabsEngine';

export class SpeechQueueProcessor {
  constructor(
    private queue: SpeechSystemQueue,
    private orchestrator: SpeechOrchestrator
  ) {}

  async processQueue(
    config: SpeechConfig,
    currentState: SpeechState,
    updateState: (updates: Partial<SpeechState>) => void
  ): Promise<void> {
    if (currentState.isSpeaking || this.queue.isEmpty()) {
      return;
    }

    const nextItem = this.queue.getNext();
    if (!nextItem) return;

    console.log('🎤 [SpeechQueueProcessor] Processing:', nextItem.substring(0, 50) + '...');

    // Always try ElevenLabs first if enabled in config
    const shouldTryElevenLabs = config.preferElevenLabs && config.useElevenLabs;
    console.log('🔍 [SpeechQueueProcessor] Should try ElevenLabs:', shouldTryElevenLabs);

    try {
      await speakWithEngines(
        nextItem,
        config.useElevenLabs,
        config,
        updateState,
        () => {
          console.log('🏁 [SpeechQueueProcessor] Speech completed');
          updateState({ isSpeaking: false });
        },
        shouldTryElevenLabs
      );
    } catch (error) {
      console.error('❌ [SpeechQueueProcessor] Error processing speech:', error);
      updateState({ 
        isSpeaking: false, 
        lastError: error instanceof Error ? error.message : 'Speech processing failed' 
      });
    }
  }
}
