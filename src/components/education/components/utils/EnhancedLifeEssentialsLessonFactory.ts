
import { EnhancedLessonConfig, ENHANCED_LESSON_PHASES } from './EnhancedLessonGenerator';
import { LessonActivity } from '../types/LessonTypes';

export const generateLifeEssentialsLesson = (
  gradeLevel: number,
  learningStyle: 'mixed' | 'visual' | 'auditory' | 'kinesthetic' = 'mixed',
  sessionId: string = ''
): EnhancedLessonConfig => {
  const phases: LessonActivity[] = [
    {
      id: 'life-essentials-intro',
      type: 'introduction',
      phase: 'introduction',
      title: 'Welcome to Life Essentials',
      duration: ENHANCED_LESSON_PHASES.introduction.baseSeconds,
      phaseDescription: 'Introduction to life essentials concepts',
      metadata: { subject: 'lifeEssentials', skillArea: 'general' },
      content: { text: 'Welcome to an exciting life essentials lesson!' }
    }
  ];

  return {
    subject: 'lifeEssentials',
    skillArea: 'general',
    gradeLevel,
    learningStyle,
    sessionId,
    title: `Life Essentials Lesson (Grade ${gradeLevel})`,
    overview: 'Engaging life essentials lesson',
    phases,
    estimatedTotalDuration: phases.reduce((sum, phase) => sum + phase.duration, 0),
    learningObjectives: ['Understand basic life essentials concepts'],
    materials: ['Device with internet access'],
    assessmentMethods: ['Interactive exercises'],
    keywords: ['Life Essentials', 'Learning']
  };
};
