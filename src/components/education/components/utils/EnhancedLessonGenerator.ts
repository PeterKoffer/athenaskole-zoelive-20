
import { LessonActivity } from '../types/LessonTypes';

export interface EnhancedLessonConfig {
  id?: string;
  title?: string;
  overview?: string;
  phases?: LessonActivity[];
  gradeLevel?: number;
  learningStyle?: string;
  subject?: string;
  skillArea?: string;
  difficulty?: number;
  estimatedDuration?: number;
  objectives?: string[];
  prerequisites?: string[];
  assessmentCriteria?: string[];
  materials?: string[];
  extensions?: string[];
}

export interface LessonContainer {
  lesson: EnhancedLessonConfig;
  metadata?: {
    sessionId: string;
    generatedAt: Date;
    version: string;
  };
}
