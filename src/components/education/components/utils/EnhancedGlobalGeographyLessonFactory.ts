
import { EnhancedLessonConfig } from './EnhancedLessonGenerator';
import { LessonActivity } from '../types/LessonTypes';
import { DEFAULT_DAILY_UNIVERSE_SECONDS } from '@/constants/lesson';

export const generateGlobalGeographyLesson = (
  gradeLevel: number,
  learningStyle: 'mixed' | 'visual' | 'auditory' | 'kinesthetic',
  sessionId: string
): { lesson: EnhancedLessonConfig } => {
  const phases: LessonActivity[] = [
    {
      id: `${sessionId}_intro`,
      type: 'introduction',
      phase: 'introduction',
      title: 'Welcome to Geography',
      duration: 300,
      phaseDescription: 'Introduction to world geography',
      metadata: {
        subject: 'globalGeography',
        skillArea: 'geography'
      },
      content: {
        text: 'Welcome to your geography lesson!'
      }
    }
  ];

  const lesson: EnhancedLessonConfig = {
    subject: 'globalGeography',
    skillArea: 'geography',
    gradeLevel,
    learningStyle,
    sessionId,
    title: 'Global Geography Explorer',
    overview: 'Interactive geography lesson',
    phases,
    estimatedTotalDuration: DEFAULT_DAILY_UNIVERSE_SECONDS,
    learningObjectives: ['Learn about world geography'],
    materials: ['Interactive content'],
    assessmentMethods: ['Interactive exercises'],
    keywords: ['geography', 'world'],
    estimatedDuration: DEFAULT_DAILY_UNIVERSE_SECONDS,
    objectives: ['Learn about world geography'],
    difficulty: 2,
    prerequisites: [],
    assessmentCriteria: ['Understanding of concepts'],
    extensions: ['Practice exercises']
  };

  return { lesson };
};
