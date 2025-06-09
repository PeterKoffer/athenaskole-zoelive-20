
export class FallbackQuestionGenerator {
  static createUniqueQuestion(subject: string, skillArea: string, timestamp: number, seed: number) {
    const uniqueId = Math.floor(timestamp + seed);
    const scenarios = [
      'At the space station',
      'During a treasure hunt', 
      'At the magical carnival',
      'In the enchanted forest',
      'At the robot factory',
      'During the dinosaur expedition',
      'At the underwater kingdom',
      'In the future city',
      'At the superhero academy',
      'During the time travel adventure'
    ];
    
    const characters = [
      'Captain Nova', 'Princess Luna', 'Robot Rex', 'Wizard Zane',
      'Explorer Emma', 'Detective Sam', 'Pilot Pete', 'Chef Clara',
      'Scientist Sara', 'Artist Alex', 'Builder Bob', 'Teacher Tina'
    ];

    const randomScenario = scenarios[uniqueId % scenarios.length];
    const randomCharacter = characters[uniqueId % characters.length];

    if (subject.toLowerCase().includes('math')) {
      return this.createMathQuestion(randomScenario, randomCharacter, uniqueId);
    } else if (subject.toLowerCase().includes('english')) {
      return this.createEnglishQuestion(randomScenario, randomCharacter, uniqueId);
    } else {
      return this.createGeneralQuestion(randomScenario, randomCharacter, uniqueId);
    }
  }

  private static createMathQuestion(scenario: string, character: string, uniqueId: number) {
    const operations = [
      { op: '+', symbol: '+', name: 'addition' },
      { op: '-', symbol: '-', name: 'subtraction' },
      { op: '*', symbol: '×', name: 'multiplication' },
      { op: 'division', symbol: '÷', name: 'division' }
    ];

    const operation = operations[uniqueId % operations.length];
    const num1 = (uniqueId % 20) + 5; // 5-24
    const num2 = (uniqueId % 15) + 3; // 3-17

    let question, answer, wrongAnswers;

    switch (operation.op) {
      case '+':
        answer = num1 + num2;
        question = `${scenario}: ${character} collected ${num1} magical crystals in the morning and ${num2} more in the afternoon. How many crystals does ${character} have altogether?`;
        wrongAnswers = [answer - 1, answer + 1, answer + 2];
        break;
      case '-':
        const larger = Math.max(num1, num2);
        const smaller = Math.min(num1, num2);
        answer = larger - smaller;
        question = `${scenario}: ${character} started with ${larger} power gems but used ${smaller} of them. How many power gems are left?`;
        wrongAnswers = [answer + 1, answer - 1, answer + 2];
        break;
      case '*':
        answer = Math.min(num1, 12) * Math.min(num2, 12);
        question = `${scenario}: ${character} found ${Math.min(num1, 12)} treasure chests, each containing ${Math.min(num2, 12)} gold coins. How many gold coins did ${character} find in total?`;
        wrongAnswers = [answer + Math.min(num1, 12), answer - Math.min(num2, 12), answer + 5];
        break;
      default: // division
        const dividend = num1 * num2;
        answer = num1;
        question = `${scenario}: ${character} needs to share ${dividend} magic potions equally among ${num2} friends. How many potions will each friend get?`;
        wrongAnswers = [answer + 1, answer - 1, num2];
    }

    const allOptions = [answer, ...wrongAnswers].sort(() => Math.random() - 0.5);
    const correctIndex = allOptions.indexOf(answer);

    return {
      question,
      options: allOptions.map(String),
      correct: correctIndex,
      explanation: `${character} solved this ${operation.name} problem! The answer is ${answer}.`,
      learningObjectives: [`${operation.name} practice`, 'Problem solving', 'Real-world math'],
      estimatedTime: 30,
      conceptsCovered: [operation.name]
    };
  }

  private static createEnglishQuestion(scenario: string, character: string, uniqueId: number) {
    const topics = [
      { type: 'synonym', word: 'happy', options: ['joyful', 'sad', 'angry', 'tired'], correct: 0 },
      { type: 'antonym', word: 'big', options: ['huge', 'small', 'wide', 'tall'], correct: 1 },
      { type: 'rhyme', word: 'cat', options: ['bat', 'dog', 'fish', 'bird'], correct: 0 },
      { type: 'plural', word: 'child', options: ['children', 'childs', 'childes', 'child'], correct: 0 }
    ];

    const topic = topics[uniqueId % topics.length];
    
    const question = `${scenario}: ${character} is learning about words! What ${topic.type} of "${topic.word}" should ${character} choose?`;
    
    return {
      question,
      options: topic.options,
      correct: topic.correct,
      explanation: `Great job! ${character} learned that "${topic.options[topic.correct]}" is the correct ${topic.type} for "${topic.word}".`,
      learningObjectives: [`${topic.type} identification`, 'Vocabulary building', 'Language skills'],
      estimatedTime: 30,
      conceptsCovered: [topic.type]
    };
  }

  private static createGeneralQuestion(scenario: string, character: string, uniqueId: number) {
    const topics = [
      { q: 'What color do you get when you mix red and blue?', options: ['purple', 'green', 'orange', 'yellow'], correct: 0 },
      { q: 'How many legs does a spider have?', options: ['6', '8', '10', '12'], correct: 1 },
      { q: 'What do plants need to grow?', options: ['music', 'sunlight', 'toys', 'books'], correct: 1 },
      { q: 'Which planet is closest to the sun?', options: ['Earth', 'Mars', 'Mercury', 'Venus'], correct: 2 }
    ];

    const topic = topics[uniqueId % topics.length];
    const question = `${scenario}: ${character} wants to know: ${topic.q}`;
    
    return {
      question,
      options: topic.options,
      correct: topic.correct,
      explanation: `Excellent! ${character} learned something new today!`,
      learningObjectives: ['General knowledge', 'Critical thinking', 'Learning exploration'],
      estimatedTime: 30,
      conceptsCovered: ['general knowledge']
    };
  }
}
