
export interface RequestBody {
  subject: string;
  skillArea: string;
  difficultyLevel: number;
  userId: string;
  previousQuestions: string[];
}

export interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export interface GeneratedContent {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  learningObjectives: string[];
  estimatedTime?: number;
}

export interface ValidationResult {
  hasQuestion: boolean;
  hasOptions: boolean;
  optionsLength: number;
  hasCorrect: boolean;
  correctInRange: boolean;
  hasExplanation: boolean;
}

export interface ErrorResponse {
  success: false;
  error: string;
  debug?: any;
}

export interface SuccessResponse {
  success: true;
  generatedContent: GeneratedContent;
}
