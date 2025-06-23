export interface ScalableGenerationConfig {
  subject: string;
  skillArea: string;
  difficultyLevel: number;
  userId: string;
  gradeLevel?: number;
  studentName?: string;
  personalizedContext?: Record<string, unknown>; // changed from any to unknown
  maxRetries?: number;
  cacheEnabled?: boolean;
}
