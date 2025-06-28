
export interface GenerateContentRequest {
  subject: string;
  skillArea: string;
  difficultyLevel: number;
  userId: string;
}

export interface GeneratedContent {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  learningObjectives: string[];
  estimatedTime: number;
  prompt_used?: string; // Added for AI-generated questions
  ai_estimated_difficulty?: number; // Added for AI-generated questions
}

export interface AdaptiveContentRecord {
  subject: string;
  skill_area: string;
  difficulty_level: number;
  title: string;
  content: any;
  learning_objectives: string[];
  estimated_time: number;
}
