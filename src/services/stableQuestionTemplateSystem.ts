
interface StableQuestionTemplate {
  id: string;
  subject: string;
  skillArea: string;
  type: 'word_problem' | 'calculation' | 'concept';
  difficultyLevel: number;
  template: string;
  variables: Record<string, string[] | number[]>;
  correctAnswerFormula: string;
  explanationTemplate: string;
}

interface PrecompiledQuestion {
  id: string;
  templateId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  metadata: {
    subject: string;
    skillArea: string;
    difficultyLevel: number;
    timestamp: number;
  };
}

class StableQuestionTemplateSystem {
  private precompiledQuestions = new Map<string, PrecompiledQuestion[]>();
  private sessionQuestions = new Map<string, Set<string>>();
  private batchSize = 50; // Pre-compile 50 questions per template
  
  private mathTemplates: StableQuestionTemplate[] = [
    {
      id: 'math_addition_gems',
      subject: 'mathematics',
      skillArea: 'addition',
      type: 'word_problem',
      difficultyLevel: 1,
      template: 'At the {location}, {character} collected {num1} {item}. Later, they found {num2} more {item}. How many {item} does {character} have in total?',
      variables: {
        location: ['magical forest', 'crystal cave', 'treasure island', 'enchanted garden', 'wonder park', 'star valley', 'rainbow bridge'],
        character: ['Explorer Maya', 'Scientist Luna', 'Detective Riley', 'Captain Alex', 'Artist Sam', 'Chef Jordan', 'Pilot Casey'],
        item: ['gems', 'crystals', 'coins', 'flowers', 'shells', 'books', 'stars'],
        num1: [15, 23, 18, 27, 31, 19, 25, 22, 16, 29],
        num2: [12, 16, 14, 18, 13, 21, 17, 19, 15, 24]
      },
      correctAnswerFormula: 'num1 + num2',
      explanationTemplate: '{character} started with {num1} {item} and found {num2} more. So {num1} + {num2} = {answer}.'
    },
    {
      id: 'math_subtraction_adventure',
      subject: 'mathematics',
      skillArea: 'subtraction',
      type: 'word_problem',
      difficultyLevel: 1,
      template: '{character} started their {adventure} with {num1} {item}. They used {num2} {item} to {action}. How many {item} does {character} have left?',
      variables: {
        character: ['Brave Knight Zoe', 'Space Explorer Max', 'Ocean Diver Aria', 'Mountain Climber Leo', 'Forest Ranger Nova'],
        adventure: ['epic quest', 'space mission', 'underwater expedition', 'mountain adventure', 'jungle exploration'],
        item: ['energy points', 'magic supplies', 'tools', 'food portions', 'special coins'],
        num1: [45, 52, 38, 41, 49, 36, 44, 47, 43, 50],
        num2: [18, 23, 16, 19, 21, 14, 17, 20, 15, 22],
        action: ['solve puzzles', 'power their ship', 'build equipment', 'feed animals', 'unlock doors']
      },
      correctAnswerFormula: 'num1 - num2',
      explanationTemplate: '{character} had {num1} {item} and used {num2}. So {num1} - {num2} = {answer}.'
    },
    {
      id: 'math_multiplication_groups',
      subject: 'mathematics',
      skillArea: 'multiplication',
      type: 'word_problem',
      difficultyLevel: 2,
      template: 'In the {location}, there are {num1} groups of {item}. Each group has {num2} {item}. How many {item} are there in total?',
      variables: {
        location: ['enchanted orchard', 'robot factory', 'butterfly garden', 'star observatory', 'music hall', 'art studio'],
        item: ['magical apples', 'dancing robots', 'colorful butterflies', 'twinkling stars', 'musical notes', 'paint brushes'],
        num1: [6, 7, 8, 9, 4, 5, 3],
        num2: [7, 6, 5, 4, 8, 9, 12]
      },
      correctAnswerFormula: 'num1 * num2',
      explanationTemplate: 'There are {num1} groups with {num2} {item} each. So {num1} × {num2} = {answer}.'
    }
  ];

  constructor() {
    // Pre-compile questions on initialization to prevent runtime delays
    this.precompileAllQuestions();
  }

  private precompileAllQuestions(): void {
    console.log('🏭 Pre-compiling stable question templates...');
    
    for (const template of this.mathTemplates) {
      const questions: PrecompiledQuestion[] = [];
      
      // Generate multiple variations of each template
      for (let i = 0; i < this.batchSize; i++) {
        const question = this.generateFromTemplate(template, i);
        questions.push(question);
      }
      
      this.precompiledQuestions.set(template.id, questions);
      console.log(`✅ Pre-compiled ${questions.length} questions for template: ${template.id}`);
    }
    
    console.log(`🎯 Total pre-compiled questions: ${this.getTotalPrecompiledCount()}`);
  }

  private generateFromTemplate(template: StableQuestionTemplate, seed: number): PrecompiledQuestion {
    let question = template.template;
    let explanation = template.explanationTemplate;
    const variables: Record<string, any> = {};

    // Use seed to ensure deterministic but varied generation
    const random = this.seededRandom(seed);

    // Replace all variables with seeded random selection
    for (const [key, values] of Object.entries(template.variables)) {
      const value = Array.isArray(values) 
        ? values[Math.floor(random() * values.length)]
        : values;
      variables[key] = value;
      
      const regex = new RegExp(`{${key}}`, 'g');
      question = question.replace(regex, String(value));
      explanation = explanation.replace(regex, String(value));
    }

    // Calculate correct answer
    const correctAnswer = this.evaluateFormula(template.correctAnswerFormula, variables);
    explanation = explanation.replace('{answer}', String(correctAnswer));

    // Generate consistent wrong answers using the same seed
    const wrongAnswers = this.generateSeededWrongAnswers(correctAnswer, template.type, seed);
    const allOptions = [correctAnswer, ...wrongAnswers].map(String);
    
    // Shuffle options consistently
    const shuffledOptions = this.seededShuffle(allOptions, seed);
    const correctIndex = shuffledOptions.indexOf(String(correctAnswer));

    return {
      id: `${template.id}_precompiled_${seed}`,
      templateId: template.id,
      question,
      options: shuffledOptions,
      correctAnswer: correctIndex,
      explanation,
      metadata: {
        subject: template.subject,
        skillArea: template.skillArea,
        difficultyLevel: template.difficultyLevel,
        timestamp: Date.now()
      }
    };
  }

  private seededRandom(seed: number): () => number {
    let value = seed;
    return () => {
      value = (value * 9301 + 49297) % 233280;
      return value / 233280;
    };
  }

  private seededShuffle<T>(array: T[], seed: number): T[] {
    const shuffled = [...array];
    const random = this.seededRandom(seed);
    
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled;
  }

  private evaluateFormula(formula: string, variables: Record<string, any>): number {
    let expression = formula;
    for (const [key, value] of Object.entries(variables)) {
      expression = expression.replace(new RegExp(key, 'g'), String(value));
    }
    
    try {
      return Function(`"use strict"; return (${expression})`)();
    } catch {
      return 0;
    }
  }

  private generateSeededWrongAnswers(correct: number, type: string, seed: number): number[] {
    const random = this.seededRandom(seed + 1000); // Different seed for wrong answers
    const wrong: number[] = [];
    
    switch (type) {
      case 'word_problem':
        wrong.push(correct + Math.floor(random() * 10) + 1);
        wrong.push(Math.max(1, correct - Math.floor(random() * 10) - 1));
        wrong.push(Math.floor(correct * (0.5 + random() * 0.5)));
        break;
      default:
        wrong.push(correct + 5, correct - 3, correct * 2);
    }
    
    return wrong.filter(w => w !== correct && w > 0).slice(0, 3);
  }

  getStableQuestion(
    subject: string,
    skillArea: string,
    sessionId: string,
    difficultyLevel: number = 1
  ): PrecompiledQuestion | null {
    console.log(`🎯 Getting stable question for ${subject}/${skillArea} (Session: ${sessionId})`);
    
    // Get session's used questions
    if (!this.sessionQuestions.has(sessionId)) {
      this.sessionQuestions.set(sessionId, new Set());
    }
    const usedQuestions = this.sessionQuestions.get(sessionId)!;

    // Find available templates
    const availableTemplates = this.mathTemplates.filter(template => 
      template.subject === subject &&
      (skillArea === 'general_math' || template.skillArea === skillArea) &&
      template.difficultyLevel <= difficultyLevel
    );

    if (availableTemplates.length === 0) {
      console.warn('⚠️ No matching templates found');
      return null;
    }

    // Try each template to find unused questions
    for (const template of availableTemplates) {
      const precompiledQuestions = this.precompiledQuestions.get(template.id) || [];
      const availableQuestions = precompiledQuestions.filter(q => !usedQuestions.has(q.id));
      
      if (availableQuestions.length > 0) {
        const selectedQuestion = availableQuestions[0]; // Take first available
        usedQuestions.add(selectedQuestion.id);
        
        console.log(`✅ Retrieved stable question: ${selectedQuestion.question.substring(0, 50)}...`);
        return selectedQuestion;
      }
    }

    // If all questions used, reset session and try again
    console.log('🔄 All questions used, resetting session');
    usedQuestions.clear();
    return this.getStableQuestion(subject, skillArea, sessionId, difficultyLevel);
  }

  clearSession(sessionId: string): void {
    this.sessionQuestions.delete(sessionId);
    console.log(`🧹 Cleared stable question session: ${sessionId}`);
  }

  getTotalPrecompiledCount(): number {
    let total = 0;
    for (const questions of this.precompiledQuestions.values()) {
      total += questions.length;
    }
    return total;
  }

  getStats(): Record<string, any> {
    return {
      totalTemplates: this.mathTemplates.length,
      totalPrecompiledQuestions: this.getTotalPrecompiledCount(),
      activeSessions: this.sessionQuestions.size,
      questionsPerTemplate: this.batchSize
    };
  }
}

export const stableQuestionTemplateSystem = new StableQuestionTemplateSystem();
export type { StableQuestionTemplate, PrecompiledQuestion };
