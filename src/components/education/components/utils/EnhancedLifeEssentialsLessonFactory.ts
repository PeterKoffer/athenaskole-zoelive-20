
import { EnhancedLessonConfig } from './EnhancedLessonGenerator';
import { LessonActivity } from '../types/LessonTypes';

export const generateLifeEssentialsLesson = (
  gradeLevel: number,
  learningStyle: 'mixed' | 'visual' | 'auditory' | 'kinesthetic',
  sessionId: string
): { lesson: EnhancedLessonConfig } => {
  const phases: LessonActivity[] = [
    {
      id: `${sessionId}_intro`,
      type: 'introduction',
      phase: 'introduction',
      title: 'Welcome to Life Essentials',
      duration: 300,
      phaseDescription: 'Introduction to life skills',
      metadata: {
        subject: 'lifeEssentials',
        skillArea: 'lifeskills',
        gradeLevel
      },
      content: {
        text: 'Welcome to your life skills lesson!'
      }
    }
  ];

  const lesson: EnhancedLessonConfig = {
    subject: 'lifeEssentials',
    skillArea: 'lifeskills',
    gradeLevel,
    learningStyle,
    sessionId,
    title: 'Life Essentials: Navigating Adulthood',
    overview: 'Interactive life skills lesson',
    phases,
    estimatedTotalDuration: 1200,
    learningObjectives: ['Learn essential life skills'],
    materials: ['Interactive content'],
    assessmentMethods: ['Interactive exercises'],
    keywords: ['life skills', 'adulthood'],
    estimatedDuration: 1200,
    objectives: ['Learn essential life skills'],
    difficulty: 3,
    prerequisites: [],
    assessmentCriteria: ['Understanding of concepts'],
    extensions: ['Practice exercises']
  };

  return { lesson };
};
