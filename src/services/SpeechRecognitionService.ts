class SpeechRecognitionService {
  private recognition: any;

  constructor() {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';
  }

  public onResult(callback: (result: string) => void): void {
    this.recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result) => result.transcript)
        .join('');
      callback(transcript);
    };
  }

  public start(): void {
    this.recognition.start();
  }

  public stop(): void {
    this.recognition.stop();
  }
}

export const speechRecognitionService = new SpeechRecognitionService();
