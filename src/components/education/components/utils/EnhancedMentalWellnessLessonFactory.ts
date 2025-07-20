
import { EnhancedLessonConfig } from './EnhancedLessonGenerator';
import { LessonActivity } from '../types/LessonTypes';
import { DEFAULT_DAILY_UNIVERSE_SECONDS } from '@/constants/lesson';

export const generateMentalWellnessLesson = (
  gradeLevel: number,
  learningStyle: 'mixed' | 'visual' | 'auditory' | 'kinesthetic',
  sessionId: string
): { lesson: EnhancedLessonConfig } => {
  const phases: LessonActivity[] = [
    {
      id: `${sessionId}_intro`,
      type: 'introduction',
      phase: 'introduction',
      title: 'Welcome to Mental Wellness',
      duration: 300,
      phaseDescription: 'Introduction to mental wellness',
      metadata: {
        subject: 'mentalWellness',
        skillArea: 'wellness'
      },
      content: {
        text: 'Welcome to your mental wellness lesson!'
      }
    }
  ];

  const lesson: EnhancedLessonConfig = {
    subject: 'mentalWellness',
    skillArea: 'wellness',
    gradeLevel,
    learningStyle,
    sessionId,
    title: 'Mental Wellness & Mindfulness',
    overview: 'Interactive mental wellness lesson',
    phases,
    estimatedTotalDuration: DEFAULT_DAILY_UNIVERSE_SECONDS,
    learningObjectives: ['Learn about mental wellness'],
    materials: ['Interactive content'],
    assessmentMethods: ['Interactive exercises'],
    keywords: ['wellness', 'mindfulness'],
    estimatedDuration: DEFAULT_DAILY_UNIVERSE_SECONDS,
    objectives: ['Learn about mental wellness'],
    difficulty: 2,
    prerequisites: [],
    assessmentCriteria: ['Understanding of concepts'],
    extensions: ['Practice exercises']
  };

  return { lesson };
};
