
import { EnhancedLessonConfig, ENHANCED_LESSON_PHASES } from './EnhancedLessonGenerator';
import { LessonActivity } from '../types/LessonTypes';

export const generateBodyLabLesson = (
  gradeLevel: number,
  learningStyle: 'mixed' | 'visual' | 'auditory' | 'kinesthetic' = 'mixed',
  sessionId: string = ''
): EnhancedLessonConfig => {
  const phases: LessonActivity[] = [
    {
      id: 'body-lab-intro',
      type: 'introduction',
      phase: 'introduction',
      title: 'Welcome to Body Lab',
      duration: ENHANCED_LESSON_PHASES.introduction.baseSeconds,
      phaseDescription: 'Introduction to body lab concepts',
      metadata: { subject: 'bodyLab', skillArea: 'general' },
      content: { text: 'Welcome to an exciting body lab lesson!' }
    }
  ];

  return {
    subject: 'bodyLab',
    skillArea: 'general',
    gradeLevel,
    learningStyle,
    sessionId,
    title: `Body Lab Lesson (Grade ${gradeLevel})`,
    overview: 'Engaging body lab lesson',
    phases,
    estimatedTotalDuration: phases.reduce((sum, phase) => sum + phase.duration, 0),
    learningObjectives: ['Understand basic body lab concepts'],
    materials: ['Device with internet access'],
    assessmentMethods: ['Interactive exercises'],
    keywords: ['Body Lab', 'Learning']
  };
};
