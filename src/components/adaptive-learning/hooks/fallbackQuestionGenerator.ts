
import { Question } from './types';

export class FallbackQuestionGenerator {
  static createUniqueQuestion(subject: string, skillArea: string, timestamp: number, uniqueId: number): Question {
    const id = `${timestamp}-${uniqueId}`;
    
    if (subject === 'mathematics') {
      return this.createMathQuestion(id);
    } else if (subject === 'english') {
      return this.createEnglishQuestion(id);
    } else if (subject === 'science') {
      return this.createScienceQuestion(id);
    }
    
    return this.createGenericQuestion(id, skillArea);
  }

  private static createMathQuestion(id: string): Question {
    const num1 = Math.floor(Math.random() * 50) + 10;
    const num2 = Math.floor(Math.random() * 30) + 5;
    const operations = ['+', '-', '×'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let answer = 0;
    let questionText = '';
    
    switch (operation) {
      case '+':
        answer = num1 + num2;
        questionText = `Calculate: ${num1} + ${num2} = ?`;
        break;
      case '-':
        answer = num1 - num2;
        questionText = `Calculate: ${num1} - ${num2} = ?`;
        break;
      case '×':
        answer = num1 * num2;
        questionText = `Calculate: ${num1} × ${num2} = ?`;
        break;
    }
    
    const wrongAnswers = [
      answer + Math.floor(Math.random() * 10) + 1,
      answer - Math.floor(Math.random() * 10) - 1,
      answer + Math.floor(Math.random() * 20) + 10
    ];
    
    const options = [answer.toString(), ...wrongAnswers.map(w => w.toString())];
    const shuffledOptions = options.sort(() => Math.random() - 0.5);
    const correctIndex = shuffledOptions.indexOf(answer.toString());
    
    return {
      question: `${questionText} (ID: ${id})`,
      options: shuffledOptions,
      correct: correctIndex,
      explanation: `${num1} ${operation} ${num2} = ${answer}`,
      learningObjectives: ['Arithmetic'],
      estimatedTime: 30,
      conceptsCovered: ['arithmetic']
    };
  }

  private static createEnglishQuestion(id: string): Question {
    const scenarios = [
      { text: 'The bright moon shines in the dark sky', question: 'What shines in the sky?', answer: 'moon', options: ['moon', 'star', 'sun', 'cloud'] },
      { text: 'The red car drives down the busy street', question: 'What drives down the street?', answer: 'car', options: ['car', 'bike', 'bus', 'truck'] },
      { text: 'The small bird sings loudly in the tree', question: 'Where does the bird sing?', answer: 'tree', options: ['tree', 'house', 'sky', 'ground'] },
      { text: 'The happy child plays with colorful toys', question: 'What does the child play with?', answer: 'toys', options: ['toys', 'books', 'games', 'friends'] },
      { text: 'The warm sun melts the white snow', question: 'What melts the snow?', answer: 'sun', options: ['sun', 'rain', 'wind', 'heat'] }
    ];
    
    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    const correctIndex = scenario.options.indexOf(scenario.answer);
    
    return {
      question: `Read: "${scenario.text}" ${scenario.question} (ID: ${id})`,
      options: scenario.options,
      correct: correctIndex,
      explanation: `The text says "${scenario.text}", so the answer is "${scenario.answer}".`,
      learningObjectives: ['Reading comprehension'],
      estimatedTime: 25,
      conceptsCovered: ['reading_comprehension']
    };
  }

  private static createScienceQuestion(id: string): Question {
    const facts = [
      { question: 'What gas do we breathe in?', answer: 'oxygen', options: ['oxygen', 'nitrogen', 'carbon dioxide', 'helium'] },
      { question: 'What do plants use to make food?', answer: 'sunlight', options: ['sunlight', 'water only', 'soil only', 'air only'] },
      { question: 'How many legs does a spider have?', answer: '8', options: ['8', '6', '4', '10'] },
      { question: 'What is the closest star to Earth?', answer: 'Sun', options: ['Sun', 'Moon', 'Mars', 'Venus'] },
      { question: 'What do fish use to breathe underwater?', answer: 'gills', options: ['gills', 'lungs', 'nose', 'mouth'] }
    ];
    
    const fact = facts[Math.floor(Math.random() * facts.length)];
    const correctIndex = fact.options.indexOf(fact.answer);
    
    return {
      question: `${fact.question} (ID: ${id})`,
      options: fact.options,
      correct: correctIndex,
      explanation: `The correct answer is ${fact.answer}.`,
      learningObjectives: ['Science facts'],
      estimatedTime: 30,
      conceptsCovered: ['general_science']
    };
  }

  private static createGenericQuestion(id: string, skillArea: string): Question {
    return {
      question: `Practice question ${id}`,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correct: 0,
      explanation: 'This is a practice question.',
      learningObjectives: [skillArea],
      estimatedTime: 30,
      conceptsCovered: [skillArea]
    };
  }
}
