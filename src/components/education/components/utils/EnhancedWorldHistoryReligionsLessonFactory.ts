
import { EnhancedLessonConfig } from './EnhancedLessonGenerator';
import { LessonActivity } from '../types/LessonTypes';

export const generateWorldHistoryReligionsLesson = (
  gradeLevel: number,
  learningStyle: 'mixed' | 'visual' | 'auditory' | 'kinesthetic',
  sessionId: string
): { lesson: EnhancedLessonConfig } => {
  const phases: LessonActivity[] = [
    {
      id: `${sessionId}_intro`,
      type: 'introduction',
      phase: 'introduction',
      title: 'Welcome to World History',
      duration: 300,
      phaseDescription: 'Introduction to world history',
      metadata: {
        subject: 'worldHistoryReligions',
        skillArea: 'history',
        gradeLevel
      },
      content: {
        text: 'Welcome to your history lesson!'
      }
    }
  ];

  const lesson: EnhancedLessonConfig = {
    subject: 'worldHistoryReligions',
    skillArea: 'history',
    gradeLevel,
    learningStyle,
    sessionId,
    title: 'World History & Global Religions',
    overview: 'Interactive history and religions lesson',
    phases,
    estimatedTotalDuration: 1200,
    learningObjectives: ['Learn about world history'],
    materials: ['Interactive content'],
    assessmentMethods: ['Interactive exercises'],
    keywords: ['history', 'religion'],
    estimatedDuration: 1200,
    objectives: ['Learn about world history'],
    difficulty: 3,
    prerequisites: [],
    assessmentCriteria: ['Understanding of concepts'],
    extensions: ['Practice exercises']
  };

  return { lesson };
};
