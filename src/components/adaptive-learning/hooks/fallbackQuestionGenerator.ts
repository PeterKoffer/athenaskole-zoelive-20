
export class FallbackQuestionGenerator {
  private static usedQuestions = new Set<string>();
  
  static createUniqueQuestion(subject: string, skillArea: string, timestamp: number, seed: number) {
    let attempts = 0;
    let question;
    
    do {
      const uniqueId = Math.floor(timestamp + seed + attempts);
      question = this.generateQuestion(subject, skillArea, uniqueId);
      attempts++;
    } while (this.usedQuestions.has(question.question) && attempts < 10);
    
    this.usedQuestions.add(question.question);
    return question;
  }
  
  private static generateQuestion(subject: string, skillArea: string, uniqueId: number) {
    // Expanded scenarios for more variety
    const scenarios = [
      'At the space station', 'During a treasure hunt', 'At the magical carnival',
      'In the enchanted forest', 'At the robot factory', 'During the dinosaur expedition',
      'At the underwater kingdom', 'In the future city', 'At the superhero academy',
      'During the time travel adventure', 'At the crystal palace', 'In the cloud city',
      'At the dragon sanctuary', 'During the pirate voyage', 'In the secret laboratory',
      'At the fairy garden', 'During the space race', 'In the candy kingdom',
      'At the ancient temple', 'During the arctic expedition'
    ];
    
    // Expanded character list for more variety
    const characters = [
      'Captain Nova', 'Princess Luna', 'Robot Rex', 'Wizard Zane',
      'Explorer Emma', 'Detective Sam', 'Pilot Pete', 'Chef Clara',
      'Scientist Sara', 'Artist Alex', 'Builder Bob', 'Teacher Tina',
      'Admiral Zoom', 'Queen Stella', 'Inventor Max', 'Knight Aria',
      'Dr. Phoenix', 'Commander Sky', 'Ranger Jade', 'Professor Bolt'
    ];

    // Use multiple hash functions for better distribution
    const scenarioIndex = this.hashWithSeed(uniqueId, 'scenario') % scenarios.length;
    const characterIndex = this.hashWithSeed(uniqueId, 'character') % characters.length;
    
    const randomScenario = scenarios[scenarioIndex];
    const randomCharacter = characters[characterIndex];
    const uniqueSuffix = `(${Date.now()}-${uniqueId})`;

    if (subject.toLowerCase().includes('math')) {
      return this.createMathQuestion(randomScenario, randomCharacter, uniqueId, uniqueSuffix);
    } else if (subject.toLowerCase().includes('english')) {
      return this.createEnglishQuestion(randomScenario, randomCharacter, uniqueId, uniqueSuffix);
    } else {
      return this.createGeneralQuestion(randomScenario, randomCharacter, uniqueId, uniqueSuffix);
    }
  }

  private static createMathQuestion(scenario: string, character: string, uniqueId: number, suffix: string) {
    const operations = [
      { op: '+', symbol: '+', name: 'addition' },
      { op: '-', symbol: '-', name: 'subtraction' },
      { op: '*', symbol: '×', name: 'multiplication' },
      { op: 'division', symbol: '÷', name: 'division' },
      { op: 'comparison', symbol: '>', name: 'comparison' },
      { op: 'pattern', symbol: '...', name: 'pattern recognition' }
    ];

    const operation = operations[uniqueId % operations.length];
    
    // Generate numbers with more variety based on uniqueId
    const baseNum1 = (this.hashWithSeed(uniqueId, 'num1') % 25) + 5;
    const baseNum2 = (this.hashWithSeed(uniqueId, 'num2') % 20) + 3;
    const num1 = Math.max(baseNum1, baseNum2);
    const num2 = Math.min(baseNum1, baseNum2);

    let question, answer, wrongAnswers;

    switch (operation.op) {
      case '+':
        answer = num1 + num2;
        question = `${scenario}: ${character} collected ${num1} magical crystals in the morning and ${num2} more in the afternoon. How many crystals does ${character} have altogether? ${suffix}`;
        wrongAnswers = [answer - 1, answer + 1, answer + num2];
        break;
      case '-':
        answer = num1 - num2;
        question = `${scenario}: ${character} started with ${num1} power gems but used ${num2} of them. How many power gems are left? ${suffix}`;
        wrongAnswers = [answer + 1, answer - 1, num2];
        break;
      case '*':
        const mult1 = Math.min(num1, 12);
        const mult2 = Math.min(num2, 12);
        answer = mult1 * mult2;
        question = `${scenario}: ${character} found ${mult1} treasure chests, each containing ${mult2} gold coins. How many gold coins did ${character} find in total? ${suffix}`;
        wrongAnswers = [answer + mult1, answer - mult2, answer + 5];
        break;
      case 'division':
        const divisor = Math.max(num2, 2);
        const dividend = num1 * divisor;
        answer = num1;
        question = `${scenario}: ${character} needs to share ${dividend} magic potions equally among ${divisor} friends. How many potions will each friend get? ${suffix}`;
        wrongAnswers = [answer + 1, answer - 1, divisor];
        break;
      case 'comparison':
        answer = num1 > num2 ? 0 : 1;
        question = `${scenario}: ${character} has ${num1} energy points and needs at least ${num2} points for the next level. Does ${character} have enough energy? ${suffix}`;
        wrongAnswers = num1 > num2 ? ['No', 'Maybe', 'Not sure'] : ['Yes', 'Maybe', 'Not sure'];
        const options = num1 > num2 ? ['Yes', ...wrongAnswers] : ['No', ...wrongAnswers];
        return {
          question,
          options,
          correct: 0,
          explanation: `${character} ${num1 > num2 ? 'has enough' : 'needs more'} energy points! ${num1} ${num1 > num2 ? '≥' : '<'} ${num2}`,
          learningObjectives: ['comparison skills', 'number sense', 'logical reasoning'],
          estimatedTime: 35,
          conceptsCovered: ['comparison']
        };
      case 'pattern':
        const pattern = [num2, num2 + 3, num2 + 6, num2 + 9];
        answer = num2 + 12;
        question = `${scenario}: ${character} found a sequence of numbers: ${pattern.join(', ')}, ___. What number comes next? ${suffix}`;
        wrongAnswers = [answer - 3, answer + 3, answer - 6];
        break;
      default:
        answer = num1 + num2;
        question = `${scenario}: ${character} has a math puzzle to solve: ${num1} + ${num2} = ? ${suffix}`;
        wrongAnswers = [answer - 1, answer + 1, answer + 2];
    }

    const allOptions = [answer, ...wrongAnswers].sort(() => Math.random() - 0.5);
    const correctIndex = allOptions.indexOf(answer);

    return {
      question,
      options: allOptions.map(String),
      correct: correctIndex,
      explanation: `${character} solved this ${operation.name} problem! The answer is ${answer}.`,
      learningObjectives: [`${operation.name} practice`, 'Problem solving', 'Real-world math'],
      estimatedTime: 30 + (operation.op === 'pattern' ? 10 : 0),
      conceptsCovered: [operation.name]
    };
  }

  private static createEnglishQuestion(scenario: string, character: string, uniqueId: number, suffix: string) {
    const topics = [
      { type: 'synonym', word: 'happy', options: ['joyful', 'sad', 'angry', 'tired'], correct: 0 },
      { type: 'antonym', word: 'big', options: ['huge', 'small', 'wide', 'tall'], correct: 1 },
      { type: 'rhyme', word: 'cat', options: ['bat', 'dog', 'fish', 'bird'], correct: 0 },
      { type: 'plural', word: 'child', options: ['children', 'childs', 'childes', 'child'], correct: 0 },
      { type: 'synonym', word: 'fast', options: ['quick', 'slow', 'lazy', 'tired'], correct: 0 },
      { type: 'antonym', word: 'hot', options: ['warm', 'cold', 'cool', 'nice'], correct: 1 },
      { type: 'rhyme', word: 'sun', options: ['fun', 'moon', 'star', 'sky'], correct: 0 },
      { type: 'plural', word: 'mouse', options: ['mice', 'mouses', 'mouse', 'mousies'], correct: 0 },
      { type: 'verb tense', word: 'run', options: ['ran', 'running', 'runs', 'runner'], correct: 0 },
      { type: 'synonym', word: 'smart', options: ['clever', 'dumb', 'silly', 'funny'], correct: 0 }
    ];

    const topic = topics[uniqueId % topics.length];
    
    const question = `${scenario}: ${character} is learning about words! What ${topic.type} of "${topic.word}" should ${character} choose? ${suffix}`;
    
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

  private static createGeneralQuestion(scenario: string, character: string, uniqueId: number, suffix: string) {
    const topics = [
      { q: 'What color do you get when you mix red and blue?', options: ['purple', 'green', 'orange', 'yellow'], correct: 0 },
      { q: 'How many legs does a spider have?', options: ['6', '8', '10', '12'], correct: 1 },
      { q: 'What do plants need to grow?', options: ['music', 'sunlight', 'toys', 'books'], correct: 1 },
      { q: 'Which planet is closest to the sun?', options: ['Earth', 'Mars', 'Mercury', 'Venus'], correct: 2 }
    ];

    const topic = topics[uniqueId % topics.length];
    const question = `${scenario}: ${character} wants to know: ${topic.q} ${suffix}`;
    
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
  
  static clearUsedQuestions() {
    this.usedQuestions.clear();
  }

  // Helper function for better hash distribution
  private static hashWithSeed(value: number, seed: string): number {
    let hash = 0;
    const combined = value.toString() + seed;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }
}
