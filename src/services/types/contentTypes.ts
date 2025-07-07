
export interface GeneratedContent {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  learningObjectives: string[];
  estimatedTime: number;
  conceptsCovered?: string[];
}

export interface GenerateContentRequest {
  subject: string;
  skillArea: string;
  difficultyLevel: number;
  userId?: string;
  previousQuestions?: string[];
}

export interface AdaptiveContentRecord {
  id?: string;
  subject: string;
  skill_area: string;
  difficulty_level: number;
  title: string;
  content: any;
  learning_objectives?: string[];
  estimated_time?: number;
  content_type?: string;
  created_at?: string;
}
