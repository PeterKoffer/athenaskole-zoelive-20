
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

export const generateEnhancedLesson = async (
  subject: string,
  skillArea: string,
  gradeLevel?: number,
  learningStyle?: string
): Promise<EnhancedLessonConfig> => {
  // Basic lesson structure
  const lesson: EnhancedLessonConfig = {
    id: `lesson_${Date.now()}`,
    title: `${subject} - ${skillArea}`,
    overview: `Interactive ${subject} lesson focusing on ${skillArea}`,
    gradeLevel: gradeLevel || 3,
    learningStyle: learningStyle || 'visual',
    subject,
    skillArea,
    difficulty: 1,
    estimatedDuration: 30,
    objectives: [
      `Understand key concepts in ${skillArea}`,
      `Apply knowledge through interactive exercises`,
      `Demonstrate mastery through assessment`
    ],
    prerequisites: [],
    assessmentCriteria: [
      'Correct completion of exercises',
      'Understanding of key concepts',
      'Ability to apply knowledge'
    ],
    materials: ['Interactive whiteboard', 'Practice worksheets'],
    extensions: ['Additional practice problems', 'Related reading materials'],
    phases: []
  };

  return lesson;
};

export const validateEnhancedLesson = (lesson: EnhancedLessonConfig): boolean => {
  if (!lesson.subject || !lesson.skillArea) {
    return false;
  }
  
  if (!lesson.title || !lesson.overview) {
    return false;
  }
  
  if (!lesson.objectives || lesson.objectives.length === 0) {
    return false;
  }
  
  return true;
};
