
import { EnhancedLessonConfig } from './EnhancedLessonGenerator';
import { LessonActivity } from '../types/LessonTypes';

const createBaseLesson = (
  subject: string,
  skillArea: string,
  gradeLevel: number,
  learningStyle: 'mixed' | 'visual' | 'auditory' | 'kinesthetic',
  sessionId: string
): EnhancedLessonConfig => {
  const phases: LessonActivity[] = [
    {
      id: `${sessionId}_intro`,
      type: 'introduction',
      phase: 'introduction',
      title: `Welcome to ${subject}`,
      duration: 300,
      phaseDescription: `Introduction to ${subject}`,
      metadata: {
        subject,
        skillArea,
        gradeLevel
      },
      content: {
        text: `Welcome to your ${subject} lesson!`
      }
    }
  ];

  return {
    subject,
    skillArea,
    gradeLevel,
    learningStyle,
    sessionId,
    title: `${subject}: ${skillArea}`,
    overview: `Interactive ${subject} lesson`,
    phases,
    estimatedTotalDuration: 1200,
    learningObjectives: [`Learn ${skillArea} concepts`],
    materials: ['Interactive content'],
    assessmentMethods: ['Interactive exercises'],
    keywords: [subject, skillArea],
    estimatedDuration: 1200,
    objectives: [`Learn ${skillArea} concepts`],
    difficulty: 2,
    prerequisites: [],
    assessmentCriteria: ['Understanding of concepts'],
    extensions: ['Practice exercises']
  };
};

export const generateMathematicsLesson = (
  gradeLevel: number,
  learningStyle: 'mixed' | 'visual' | 'auditory' | 'kinesthetic',
  sessionId: string
): { lesson: EnhancedLessonConfig } => {
  const lesson = createBaseLesson('mathematics', 'math', gradeLevel, learningStyle, sessionId);
  return { lesson };
};

export const generateEnglishLesson = (
  gradeLevel: number,
  learningStyle: 'mixed' | 'visual' | 'auditory' | 'kinesthetic',
  sessionId: string
): { lesson: EnhancedLessonConfig } => {
  const lesson = createBaseLesson('english', 'language', gradeLevel, learningStyle, sessionId);
  return { lesson };
};

export const generateScienceLesson = (
  gradeLevel: number,
  learningStyle: 'mixed' | 'visual' | 'auditory' | 'kinesthetic',
  sessionId: string
): { lesson: EnhancedLessonConfig } => {
  const lesson = createBaseLesson('science', 'science', gradeLevel, learningStyle, sessionId);
  return { lesson };
};

export const generateMusicLesson = (
  gradeLevel: number,
  learningStyle: 'mixed' | 'visual' | 'auditory' | 'kinesthetic',
  sessionId: string
): { lesson: EnhancedLessonConfig } => {
  const lesson = createBaseLesson('music', 'music', gradeLevel, learningStyle, sessionId);
  return { lesson };
};

export const generateComputerScienceLesson = (
  gradeLevel: number,
  learningStyle: 'mixed' | 'visual' | 'auditory' | 'kinesthetic',
  sessionId: string
): { lesson: EnhancedLessonConfig } => {
  const lesson = createBaseLesson('computerScience', 'programming', gradeLevel, learningStyle, sessionId);
  return { lesson };
};

export const generateCreativeArtsLesson = (
  gradeLevel: number,
  learningStyle: 'mixed' | 'visual' | 'auditory' | 'kinesthetic',
  sessionId: string
): { lesson: EnhancedLessonConfig } => {
  const lesson = createBaseLesson('creativeArts', 'arts', gradeLevel, learningStyle, sessionId);
  return { lesson };
};
