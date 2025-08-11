
import { SpeechConfig } from './SpeechConfig';
import { SpeechState } from './SpeechState';
import { speakWithEngines } from './SpeechEngines';

export class SpeechOrchestrator {
  private _lastSpokenText = '';
  private _lastSpokenTime = 0;
  private _repeatPreventionTime = 3000;

  async processSpeechRequest(
    text: string,
    config: SpeechConfig,
    _state: SpeechState,
    updateState: (updates: Partial<SpeechState>) => void,
    onComplete: () => void
  ): Promise<void> {
    console.log("[SpeechOrchestrator] Processing speech request:", text.substring(0, 50));
    
    await new Promise<void>((resolve) => {
      speakWithEngines(
        text,
        config.useElevenLabs,
        config,
        updateState,
        () => {
          this._lastSpokenText = text;
          this._lastSpokenTime = Date.now();
          resolve();
        },
        config.preferElevenLabs
      );
    });

    onComplete();
  }

  addNeliePersonality(text: string): string {
    if (!text) return text;
    
    // Removed "That's a great question!" and similar phrases
    if (Math.random() < 0.15 && !text.includes('Hi') && !text.includes('Let')) {
      const phrases = [
        'Hi there!',
        'Let me help you with that!',
        'Excellent work!',
        'Keep going!',
        'You\'re doing great!'
      ];
      return `${phrases[Math.floor(Math.random() * phrases.length)]} ${text}`;
    }
    
    return text;
  }
}
