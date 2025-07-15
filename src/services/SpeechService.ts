class SpeechService {
  private synth: SpeechSynthesis;

  constructor() {
    this.synth = window.speechSynthesis;
  }

  public speak(text: string): void {
    const utterance = new SpeechSynthesisUtterance(text);
    this.synth.speak(utterance);
  }
}

export const speechService = new SpeechService();
