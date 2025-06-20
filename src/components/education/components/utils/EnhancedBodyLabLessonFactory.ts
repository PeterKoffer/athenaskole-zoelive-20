
import { EnhancedLessonConfig } from './EnhancedLessonGenerator';
import { LessonActivity } from '../types/LessonTypes';

export const generateBodyLabLesson = (
  gradeLevel: number,
  learningStyle: 'mixed' | 'visual' | 'auditory' | 'kinesthetic',
  sessionId: string
): { lesson: EnhancedLessonConfig } => {
  const phases: LessonActivity[] = [
    {
      id: `${sessionId}_intro`,
      type: 'introduction',
      phase: 'introduction',
      title: 'Welcome to BodyLab',
      duration: 300,
      phaseDescription: 'Introduction to healthy living',
      metadata: {
        subject: 'bodyLab',
        skillArea: 'health',
        gradeLevel
      },
      content: {
        text: 'Welcome to your healthy living lesson!'
      }
    }
  ];

  const lesson: EnhancedLessonConfig = {
    subject: 'bodyLab',
    skillArea: 'health',
    gradeLevel,
    learningStyle,
    sessionId,
    title: 'BodyLab: Healthy Living',
    overview: 'Interactive health and wellness lesson',
    phases,
    estimatedTotalDuration: 1200,
    learningObjectives: ['Learn about healthy living'],
    materials: ['Interactive content'],
    assessmentMethods: ['Interactive exercises'],
    keywords: ['health', 'wellness'],
    estimatedDuration: 1200,
    objectives: ['Learn about healthy living'],
    difficulty: 2,
    prerequisites: [],
    assessmentCriteria: ['Understanding of concepts'],
    extensions: ['Practice exercises']
  };

  return { lesson };
};
