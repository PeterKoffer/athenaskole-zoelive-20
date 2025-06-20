
import { EnhancedLessonConfig, ENHANCED_LESSON_PHASES } from './EnhancedLessonGenerator';
import { LessonActivity } from '../types/LessonTypes';

export const generateGlobalGeographyLesson = (
  gradeLevel: number,
  learningStyle: 'mixed' | 'visual' | 'auditory' | 'kinesthetic' = 'mixed',
  sessionId: string = ''
): EnhancedLessonConfig => {
  const phases: LessonActivity[] = [
    {
      id: 'geography-intro',
      type: 'introduction',
      phase: 'introduction',
      title: 'Welcome to Global Geography',
      duration: ENHANCED_LESSON_PHASES.introduction.baseSeconds,
      phaseDescription: 'Introduction to global geography',
      metadata: { subject: 'globalGeography', skillArea: 'general' },
      content: { text: 'Welcome to an exciting global geography lesson!' }
    }
  ];

  return {
    subject: 'globalGeography',
    skillArea: 'general',
    gradeLevel,
    learningStyle,
    sessionId,
    title: `Global Geography Lesson (Grade ${gradeLevel})`,
    overview: 'Engaging global geography lesson',
    phases,
    estimatedTotalDuration: phases.reduce((sum, phase) => sum + phase.duration, 0),
    learningObjectives: ['Understand basic global geography concepts'],
    materials: ['Device with internet access'],
    assessmentMethods: ['Interactive exercises'],
    keywords: ['Global Geography', 'Learning']
  };
};
