import natural from 'natural';

class NlpService {
  private classifier: natural.BayesClassifier;

  constructor() {
    this.classifier = new natural.BayesClassifier();

    this.classifier.addDocument('I need help', 'help');
    this.classifier.addDocument('I don\'t understand', 'help');
    this.classifier.addDocument('Can you explain that again?', 'help');
    this.classifier.addDocument('What is a noun?', 'question');
    this.classifier.addDocument('What is the capital of France?', 'question');
    this.classifier.addDocument('Tell me a joke', 'joke');
    this.classifier.addDocument('Tell me something funny', 'joke');

    this.classifier.train();
  }

  public getIntent(text: string): string {
    return this.classifier.classify(text);
  }
}

export const nlpService = new NlpService();
