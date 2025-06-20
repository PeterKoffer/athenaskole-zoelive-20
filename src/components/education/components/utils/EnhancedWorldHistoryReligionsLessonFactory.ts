
import { EnhancedLessonConfig, ENHANCED_LESSON_PHASES } from './EnhancedLessonGenerator';
import { LessonActivity } from '../types/LessonTypes';

export const generateWorldHistoryReligionsLesson = (
  gradeLevel: number,
  learningStyle: 'mixed' | 'visual' | 'auditory' | 'kinesthetic' = 'mixed',
  sessionId: string = ''
): EnhancedLessonConfig => {
  const phases: LessonActivity[] = [
    {
      id: 'world-history-intro',
      type: 'introduction',
      phase: 'introduction',
      title: 'Welcome to World History & Religions',
      duration: ENHANCED_LESSON_PHASES.introduction.baseSeconds,
      phaseDescription: 'Introduction to world history and religions',
      metadata: { subject: 'worldHistoryReligions', skillArea: 'general' },
      content: { text: 'Welcome to an exciting world history and religions lesson!' }
    }
  ];

  return {
    subject: 'worldHistoryReligions',
    skillArea: 'general',
    gradeLevel,
    learningStyle,
    sessionId,
    title: `World History & Religions Lesson (Grade ${gradeLevel})`,
    overview: 'Engaging world history and religions lesson',
    phases,
    estimatedTotalDuration: phases.reduce((sum, phase) => sum + phase.duration, 0),
    learningObjectives: ['Understand basic world history and religious concepts'],
    materials: ['Device with internet access'],
    assessmentMethods: ['Interactive exercises'],
    keywords: ['World History', 'Religions', 'Learning']
  };
};
