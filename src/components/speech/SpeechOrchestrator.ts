
import { SpeechConfig } from './SpeechConfig';
import { SpeechState } from './SpeechState';
import { speakWithEngines } from './SpeechEngines';

export class SpeechOrchestrator {
  private lastSpokenText = '';
  private lastSpokenTime = 0;
  private repeatPreventionTime = 3000;

  async processSpeechRequest(
    text: string,
    config: SpeechConfig,
    state: SpeechState,
    updateState: (updates: Partial<SpeechState>) => void,
    onComplete: () => void
  ): Promise<void> {
    /*
    const now = Date.now();
    if (text === this.lastSpokenText && now - this.lastSpokenTime < this.repeatPreventionTime) {
      onComplete();
      return;
    }
    */

    console.log("[SpeechOrchestrator] Processing speech request:", text.substring(0, 50));
    
    await new Promise<void>((resolve) => {
      speakWithEngines(
        text,
        state.usingElevenLabs,
        config,
        updateState,
        () => {
          this.lastSpokenText = text;
          this.lastSpokenTime = Date.now();
          resolve();
        },
        config.preferElevenLabs,
        state.isCheckingElevenLabs
      );
    });

    onComplete();
  }

  addNeliePersonality(text: string): string {
    if (!text) return text;
    
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
      return `${phrases[Math.floor(Math.random() * phrases.length)]} ${text}`;
    }
    
    return text;
  }
}
