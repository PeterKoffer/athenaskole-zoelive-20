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
    // ... (your template data here, unchanged)
  ];

  private sessionQuestions = new Map<string, Set<string>>();
  private templateUsage = new Map<string, number>();

  generateUniqueQuestion(
    subject: string,
    skillArea: string,
    sessionId: string,
    difficultyLevel: number = 1
  ): GeneratedQuestion {
    if (!this.sessionQuestions.has(sessionId)) {
      this.sessionQuestions.set(sessionId, new Set());
    }
    const usedTemplates = this.sessionQuestions.get(sessionId)!;

    let availableTemplates = this.mathTemplates.filter(template =>
      template.subject === subject &&
      (skillArea === 'general_math' || template.skillArea === skillArea) &&
      template.difficultyLevel <= difficultyLevel &&
      !usedTemplates.has(template.id)
    );

    if (availableTemplates.length === 0) {
      usedTemplates.clear();
      availableTemplates = this.mathTemplates.filter(template =>
        template.subject === subject &&
        (skillArea === 'general_math' || template.skillArea === skillArea)
      );
    }

    // Pick template with least usage
    const template = availableTemplates.sort(
      (a, b) => (this.templateUsage.get(a.id) || 0) - (this.templateUsage.get(b.id) || 0)
    )[0];

    const questionData = this.generateFromTemplate(template, sessionId);

    usedTemplates.add(template.id);
    this.templateUsage.set(template.id, (this.templateUsage.get(template.id) || 0) + 1);

    return questionData;
  }

  private generateFromTemplate(template: QuestionTemplate, sessionId: string): GeneratedQuestion {
    let question = template.template;
    let explanation = template.explanationTemplate;
    const variables: Record<string, string | number> = {};

    // Pick random values for variables and replace in templates
    for (const [key, values] of Object.entries(template.variables)) {
      const value = Array.isArray(values)
        ? values[Math.floor(Math.random() * values.length)]
        : values;
      variables[key] = value;
      const regex = new RegExp(`{${key}}`, 'g');
      question = question.replace(regex, String(value));
      explanation = explanation.replace(regex, String(value));
    }

    // Compute correct answer
    const correctAnswer = this.evaluateFormula(template.correctAnswerFormula, variables);
    explanation = explanation.replace('{answer}', String(correctAnswer));

    // Generate plausible wrong answers
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

  private evaluateFormula(formula: string, variables: Record<string, string | number>): number {
    let expression = formula;
    for (const [key, value] of Object.entries(variables)) {
      // Use word boundaries to avoid partial replacements
      expression = expression.replace(new RegExp(`\\b${key}\\b`, 'g'), String(value));
    }
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
        wrong.push(correct + Math.floor(Math.random() * 10) + 1);
        wrong.push(Math.max(1, correct - Math.floor(Math.random() * 10) - 1));
        wrong.push(Math.floor(correct * 1.5));
        break;
      }
      default: {
        wrong.push(correct + 5, correct - 3, correct * 2);
        break;
      }
    }
    return wrong.filter(w => w !== correct && w > 0).slice(0, 3);
  }

  clearSession(sessionId: string): void {
    this.sessionQuestions.delete(sessionId);
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
