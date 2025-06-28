
export interface QuestionGenerationRequest {
  subject: string;
  skillArea: string;
  difficultyLevel: number;
  userId: string;
  questionIndex?: number;
  promptVariation?: string;
  specificContext?: string;
}

export interface GeneratedQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface QuestionValidationResult {
  isValid: boolean;
  correctedIndex?: number;
  error?: string;
}
