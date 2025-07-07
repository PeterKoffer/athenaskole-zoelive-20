
export interface Question {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  learningObjectives: string[];
  estimatedTime: number;
  conceptsCovered: string[];
  isRecap?: boolean;
}

export interface UseDiverseQuestionGenerationProps {
  subject: string;
  skillArea: string;
  difficultyLevel: number;
  userId: string;
  gradeLevel: number;
  standardsAlignment?: string[];
}
