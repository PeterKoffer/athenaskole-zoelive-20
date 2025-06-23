interface QuestionTemplate {
  id: string;
  subject: string;
  skillArea: string;
  type: 'word_problem' | 'calculation' | 'concept' | 'visual';
  difficultyLevel: number;
  template: string;
  variables: Record<string, string[] | number[]>;
  correctAnswerFormula: string;
  explanationTemplate: string;
  learningObjectives: string[];
}

interface GeneratedQuestion {
  id: string;
  templateId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  sessionId: string;
  timestamp: number;
}

class QuestionTemplateSystem {
  private mathTemplates: QuestionTemplate[] = [
    {
      id: 'math_addition_word_1',
      subject: 'mathematics',
      skillArea: 'addition',
      type: 'word_problem',
      difficultyLevel: 1,
      template: 'At the {location}, {character} collected {num1} {item1}. Later, they found {num2} more {item1}. How many {item1} does {character} have in total?',
      variables: {
        location: ['magical forest', 'secret garden', 'treasure island', 'ancient castle', 'crystal cave', 'rainbow bridge', 'wonder park'],
        character: ['Explorer Maya', 'Captain Alex', 'Scientist Luna', 'Artist Sam', 'Detective Riley', 'Chef Jordan', 'Pilot Casey'],
        item1: ['gems', 'coins', 'crystals', 'flowers', 'shells', 'books', 'stars'],
        num1: [15, 23, 18, 27, 31, 19, 25],
        num2: [12, 16, 14, 18, 13, 21, 17]
      },
      correctAnswerFormula: 'num1 + num2',
      explanationTemplate: '{character} started with {num1} {item1} and found {num2} more. So {num1} + {num2} = {answer}.',
      learningObjectives: ['Addition', 'Word problem solving', 'Real-world application']
    },
    {
      id: 'math_subtraction_word_1',
      subject: 'mathematics',
      skillArea: 'subtraction',
      type: 'word_problem',
      difficultyLevel: 1,
      template: '{character} started their {adventure} with {num1} {item}. They used {num2} {item} to {action}. How many {item} does {character} have left?',
      variables: {
        character: ['Brave Knight Zoe', 'Space Explorer Max', 'Ocean Diver Aria', 'Mountain Climber Leo', 'Forest Ranger Nova'],
        adventure: ['epic quest', 'space mission', 'underwater expedition', 'mountain adventure', 'jungle exploration'],
        item: ['energy points', 'magic supplies', 'tools', 'food portions', 'special coins'],
        num1: [45, 52, 38, 41, 49, 36, 44],
        num2: [18, 23, 16, 19, 21, 14, 17],
        action: ['solve puzzles', 'power their ship', 'build equipment', 'feed animals', 'unlock doors']
      },
      correctAnswerFormula: 'num1 - num2',
      explanationTemplate: '{character} had {num1} {item} and used {num2}. So {num1} - {num2} = {answer}.',
      learningObjectives: ['Subtraction', 'Problem solving', 'Story comprehension']
    },
    {
      id: 'math_multiplication_word_1',
      subject: 'mathematics',
      skillArea: 'multiplication',
      type: 'word_problem',
      difficultyLevel: 2,
      template: 'In the {location}, there are {num1} groups of {item}. Each group has {num2} {item}. How many {item} are there in total?',
      variables: {
        location: ['enchanted orchard', 'robot factory', 'butterfly garden', 'star observatory', 'music hall', 'art studio'],
        item: ['magical apples', 'dancing robots', 'colorful butterflies', 'twinkling stars', 'musical notes', 'paint brushes'],
        num1: [6, 7, 8, 9, 4, 5],
        num2: [7, 6, 5, 4, 8, 9]
      },
      correctAnswerFormula: 'num1 * num2',
      explanationTemplate: 'There are {num1} groups with {num2} {item} each. So {num1} × {num2} = {answer}.',
      learningObjectives: ['Multiplication', 'Grouping', 'Arrays']
    }
  ];

  private sessionQuestions = new Map<string, Set<string>>();
  private templateUsage = new Map<string, number>();

  generateUniqueQuestion(
    subject: string,
    skillArea: string,
    sessionId: string,
    difficultyLevel: number = 1
  ): GeneratedQuestion {
    console.log(`🎯 Generating UNIQUE template question for ${subject}/${skillArea} (Session: ${sessionId})`);

    // Get session's used templates
    if (!this.sessionQuestions.has(sessionId)) {
      this.sessionQuestions.set(sessionId, new Set());
    }
    const usedTemplates = this.sessionQuestions.get(sessionId)!;

    // Find available templates
    const availableTemplates = this.mathTemplates.filter(template =>
      template.subject === subject &&
      (skillArea === 'general_math' || template.skillArea === skillArea) &&
      template.difficultyLevel <= difficultyLevel &&
      !usedTemplates.has(template.id)
    );

    // If no templates available, reset and use all
    if (availableTemplates.length === 0) {
      console.log('🔄 No unused templates, resetting session templates');
      usedTemplates.clear();
      availableTemplates.push(...this.mathTemplates.filter(template =>
        template.subject === subject &&
        (skillArea === 'general_math' || template.skillArea === skillArea)
      ));
    }

    // Select template with least usage
    const template = availableTemplates.sort((a, b) =>
      (this.templateUsage.get(a.id) || 0) - (this.templateUsage.get(b.id) || 0)
    )[0];

    // Generate question from template
    const questionData = this.generateFromTemplate(template, sessionId);

    // Track usage
    usedTemplates.add(template.id);
    this.templateUsage.set(template.id, (this.templateUsage.get(template.id) || 0) + 1);

    console.log(`✅ Generated template question: ${questionData.question.substring(0, 50)}...`);
    return questionData;
  }

  private generateFromTemplate(template: QuestionTemplate, sessionId: string): GeneratedQuestion {
    let question = template.template;
    let explanation = template.explanationTemplate;
    const variables: Record<string, unknown> = {};

    // Replace all variables
    for (const [key, values] of Object.entries(template.variables)) {
      const value = Array.isArray(values)
        ? values[Math.floor(Math.random() * values.length)]
        : values;
      variables[key] = value;

      const regex = new RegExp(`{${key}}`, 'g');
      question = question.replace(regex, String(value));
      explanation = explanation.replace(regex, String(value));
    }

    // Calculate correct answer
    const correctAnswer = this.evaluateFormula(template.correctAnswerFormula, variables);
    explanation = explanation.replace('{answer}', String(correctAnswer));

    // Generate wrong answers
    const wrongAnswers = this.generateWrongAnswers(correctAnswer, template.type);
    const allOptions = [correctAnswer, ...wrongAnswers].map(String);

    // Shuffle options
    const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);
    const correctIndex = shuffledOptions.indexOf(String(correctAnswer));

    return {
      id: `${template.id}_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      templateId: template.id,
      question,
      options: shuffledOptions,
      correctAnswer: correctIndex,
      explanation,
      sessionId,
      timestamp: Date.now()
    };
  }

  private evaluateFormula(formula: string, variables: Record<string, unknown>): number {
    let expression = formula;
    for (const [key, value] of Object.entries(variables)) {
      expression = expression.replace(new RegExp(key, 'g'), String(value));
    }

    // Safe evaluation for basic arithmetic
    try {
      // eslint-disable-next-line no-new-func
      return Function(`"use strict"; return (${expression})`)();
    } catch {
      return 0;
    }
  }

  private generateWrongAnswers(correct: number, type: string): number[] {
    const wrong: number[] = [];
    switch (type) {
      case 'word_problem': {
        // Generate plausible wrong answers
        wrong.push(correct + Math.floor(Math.random() * 10) + 1);
        wrong.push(Math.max(1, correct - Math.floor(Math.random() * 10) - 1));
        wrong.push(Math.floor(correct * 1.5));
        break;
      }
      default: {
        wrong.push(correct + 5, correct - 3, correct * 2);
      }
    }

    return wrong.filter(w => w !== correct && w > 0).slice(0, 3);
  }

  clearSession(sessionId: string): void {
    this.sessionQuestions.delete(sessionId);
    console.log(`🧹 Cleared template session: ${sessionId}`);
  }

  getStats(): Record<string, unknown> {
    return {
      totalTemplates: this.mathTemplates.length,
      activeSessions: this.sessionQuestions.size,
      templateUsage: Object.fromEntries(this.templateUsage)
    };
  }
}

export const questionTemplateSystem = new QuestionTemplateSystem();
export type { QuestionTemplate, GeneratedQuestion };
