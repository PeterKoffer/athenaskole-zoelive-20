import nlp from 'compromise';

class NlpService {
  public getIntentAndEntities(text: string): { intent: string; entities: any } {
    const doc = nlp(text);
    let intent = 'unknown';
    const entities: any = {
      nouns: doc.nouns().out('array'),
      verbs: doc.verbs().out('array'),
      adjectives: doc.adjectives().out('array'),
    };

    if (doc.has('help')) {
      intent = 'help';
    } else if (doc.has('what is')) {
      intent = 'question';
      const question = doc.match('what is .*').text();
      entities['question'] = question;
    } else if (doc.has('joke')) {
      intent = 'joke';
    }

    return { intent, entities };
  }
}

export const nlpService = new NlpService();
