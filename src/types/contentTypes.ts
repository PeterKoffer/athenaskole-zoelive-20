// Add content source tracking to existing types
export interface GeneratedContent {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  learningObjectives: string[];
  estimatedTime: number;
  contentSource?: 'catalog' | 'ai' | 'fallback';
}

export interface GenerateContentRequest {
  subject?: string;
  gradeLevel?: string;
  curriculum?: string;
  [key: string]: any;
}