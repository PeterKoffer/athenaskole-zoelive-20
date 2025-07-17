
import { Question } from '../hooks/types';

export class EnhancedFallbackGenerator {
  private static usedQuestions = new Set<string>();
  
  static generateFallbackQuestion(subject: string, skillArea: string, difficultyLevel: number): Question {
    const timestamp = Date.now();
    const uniqueId = `${subject}-${skillArea}-${difficultyLevel}-${timestamp}`;
    
    // Clear used questions if we have too many to ensure variety
    if (this.usedQuestions.size > 100) {
      this.usedQuestions.clear();
    }
    
    let question: Question;
    let attempts = 0;
    
    do {
      question = this.createQuestion(subject, skillArea, difficultyLevel, timestamp + attempts);
      attempts++;
    } while (this.usedQuestions.has(question.question) && attempts < 10);
    
    this.usedQuestions.add(question.question);
    return question;
  }
  
  private static createQuestion(subject: string, skillArea: string, difficultyLevel: number, seed: number): Question {
    const subjectLower = subject.toLowerCase();
    
    if (subjectLower.includes('math') || subjectLower.includes('matematik')) {
      return this.createMathQuestion(skillArea, difficultyLevel, seed);
    } else if (subjectLower.includes('english') || subjectLower.includes('dansk')) {
      return this.createLanguageQuestion(skillArea, difficultyLevel, seed);
    } else if (subjectLower.includes('science') || subjectLower.includes('naturteknik')) {
      return this.createScienceQuestion(skillArea, difficultyLevel, seed);
    } else {
      return this.createGeneralQuestion(subject, skillArea, difficultyLevel, seed);
    }
  }
  
  private static createMathQuestion(skillArea: string, difficultyLevel: number, seed: number): Question {
    const scenarios = [
      'At the space academy', 'During treasure hunting', 'In the robot factory',
      'At the magical school', 'During the adventure', 'In the future city'
    ];
    
    const characters = [
      'Alex', 'Sam', 'Jordan', 'Riley', 'Morgan', 'Casey'
    ];
    
    const scenarioIndex = seed % scenarios.length;
    const characterIndex = (seed * 7) % characters.length;
    
    const scenario = scenarios[scenarioIndex];
    const character = characters[characterIndex];
    
    // Generate numbers based on difficulty
    const baseRange = Math.max(5, difficultyLevel * 5);
    const num1 = (seed % baseRange) + 5;
    const num2 = ((seed * 3) % (baseRange - 2)) + 3;
    
    const operations = ['+', '-', '×'];
    const operation = operations[seed % operations.length];
    
    let question: string;
    let correctAnswer: number;
    let explanation: string;
    
    switch (operation) {
      case '+':
        correctAnswer = num1 + num2;
        question = `${scenario}: ${character} collected ${num1} crystals and found ${num2} more. How many crystals does ${character} have in total?`;
        explanation = `${character} has ${num1} + ${num2} = ${correctAnswer} crystals.`;
        break;
      case '-':
        const larger = Math.max(num1, num2);
        const smaller = Math.min(num1, num2);
        correctAnswer = larger - smaller;
        question = `${scenario}: ${character} had ${larger} energy points and used ${smaller}. How many energy points are left?`;
        explanation = `${character} has ${larger} - ${smaller} = ${correctAnswer} energy points left.`;
        break;
      case '×':
        const factor1 = Math.min(num1, 12);
        const factor2 = Math.min(num2, 8);
        correctAnswer = factor1 * factor2;
        question = `${scenario}: ${character} found ${factor1} boxes with ${factor2} items each. How many items in total?`;
        explanation = `${character} found ${factor1} × ${factor2} = ${correctAnswer} items.`;
        break;
      default:
        correctAnswer = num1 + num2;
        question = `${scenario}: ${character} needs to solve ${num1} + ${num2}. What's the answer?`;
        explanation = `The answer is ${num1} + ${num2} = ${correctAnswer}.`;
    }
    
    // Generate wrong answers
    const wrongAnswers = [
      correctAnswer + 1,
      correctAnswer - 1,
      correctAnswer + Math.floor(Math.random() * 5) + 2
    ].filter(ans => ans !== correctAnswer && ans > 0);
    
    const options = [correctAnswer, ...wrongAnswers.slice(0, 3)]
      .sort(() => Math.random() - 0.5)
      .map(String);
    
    const correctIndex = options.indexOf(String(correctAnswer));
    
    return {
      id: `enhanced-fallback-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      question,
      options,
      correct: correctIndex,
      explanation,
      learningObjectives: [`${operation} practice`, 'Problem solving', 'Mathematical reasoning'],
      estimatedTime: 45,
      conceptsCovered: [skillArea, 'arithmetic']
    };
  }
  
  private static createLanguageQuestion(skillArea: string, difficultyLevel: number, seed: number): Question {
    const topics = [
      {
        question: 'Which word means the same as "happy"?',
        options: ['joyful', 'sad', 'angry', 'tired'],
        correct: 0,
        explanation: 'Joyful is a synonym for happy, meaning feeling pleasure or contentment.'
      },
      {
        question: 'What is the opposite of "big"?',
        options: ['huge', 'small', 'wide', 'tall'],
        correct: 1,
        explanation: 'Small is the antonym (opposite) of big.'
      },
      {
        question: 'Which word rhymes with "cat"?',
        options: ['bat', 'dog', 'bird', 'fish'],
        correct: 0,
        explanation: 'Bat rhymes with cat - they both end with the "-at" sound.'
      },
      {
        question: 'What is the plural of "child"?',
        options: ['children', 'childs', 'childes', 'child'],
        correct: 0,
        explanation: 'Children is the correct plural form of child - it\'s an irregular plural.'
      }
    ];
    
    const topic = topics[seed % topics.length];
    
    return {
      id: `enhanced-fallback-lang-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      question: topic.question,
      options: topic.options,
      correct: topic.correct,
      explanation: topic.explanation,
      learningObjectives: ['Vocabulary building', 'Language comprehension', 'Word relationships'],
      estimatedTime: 35,
      conceptsCovered: [skillArea, 'vocabulary']
    };
  }
  
  private static createScienceQuestion(skillArea: string, difficultyLevel: number, seed: number): Question {
    const topics = [
      {
        question: 'What do plants need to make their own food?',
        options: ['sunlight', 'rocks', 'metal', 'plastic'],
        correct: 0,
        explanation: 'Plants need sunlight to perform photosynthesis and make their own food.'
      },
      {
        question: 'How many legs does a spider have?',
        options: ['6', '8', '10', '4'],
        correct: 1,
        explanation: 'Spiders are arachnids and have 8 legs, which distinguishes them from insects.'
      },
      {
        question: 'What happens to water when it gets very cold?',
        options: ['it disappears', 'it turns to ice', 'it becomes hot', 'it changes color'],
        correct: 1,
        explanation: 'When water gets cold enough (0°C or 32°F), it freezes and becomes ice.'
      },
      {
        question: 'Which planet is closest to the Sun?',
        options: ['Earth', 'Mars', 'Mercury', 'Venus'],
        correct: 2,
        explanation: 'Mercury is the planet closest to the Sun in our solar system.'
      }
    ];
    
    const topic = topics[seed % topics.length];
    
    return {
      id: `enhanced-fallback-science-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      question: topic.question,
      options: topic.options,
      correct: topic.correct,
      explanation: topic.explanation,
      learningObjectives: ['Scientific knowledge', 'Natural world understanding', 'Critical thinking'],
      estimatedTime: 40,
      conceptsCovered: [skillArea, 'science']
    };
  }
  
  private static createGeneralQuestion(subject: string, skillArea: string, difficultyLevel: number, seed: number): Question {
    return {
      id: `enhanced-fallback-general-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      question: `What is an important skill when learning about ${skillArea.replace(/_/g, ' ')}?`,
      options: [
        'Practice regularly',
        'Give up quickly', 
        'Avoid asking questions',
        'Skip the basics'
      ],
      correct: 0,
      explanation: `Regular practice is key to mastering ${skillArea.replace(/_/g, ' ')} and building strong foundational skills.`,
      learningObjectives: ['Learning strategies', 'Study skills', 'Growth mindset'],
      estimatedTime: 30,
      conceptsCovered: [skillArea]
    };
  }
}
