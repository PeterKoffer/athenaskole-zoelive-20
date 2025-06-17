
export interface StableQuestionTemplate {
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

export interface PrecompiledQuestion {
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
