
export interface Question {
  id: string; // Add missing id property
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  learningObjectives?: string[];
  estimatedTime?: number;
  conceptsCovered?: string[]; // Add missing conceptsCovered property
  isRecap?: boolean; // Flag to allow repeated questions for recap/review
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
