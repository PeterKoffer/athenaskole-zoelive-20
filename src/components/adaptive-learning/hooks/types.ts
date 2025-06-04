
export interface Question {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  learningObjectives: string[];
  estimatedTime: number;
  conceptsCovered: string[];
}

export interface UseDiverseQuestionGenerationProps {
  subject: string;
  skillArea: string;
  difficultyLevel: number;
  userId: string;
  gradeLevel?: number;
  standardsAlignment?: any;
}

export interface QuestionContext {
  gradeLevel?: number;
  standard?: any;
  contentPrompt?: string;
}
