import { StableQuestionTemplate, PrecompiledQuestion } from './types';

export class QuestionGenerator {
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

  private evaluateFormula(formula: string, variables: Record<string, unknown>): number {
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
    const random = this.seededRandom(seed + 1000);
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

  generateFromTemplate(template: StableQuestionTemplate, seed: number): PrecompiledQuestion {
    let question = template.template;
    let explanation = template.explanationTemplate;
    const variables: Record<string, unknown> = {};

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
}
