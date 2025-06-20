
import { EnhancedLessonConfig, ENHANCED_LESSON_PHASES } from './EnhancedLessonGenerator';
import { LessonActivity } from '../types/LessonTypes';

export const generateMathematicsLesson = (
  gradeLevel: number,
  learningStyle: 'mixed' | 'visual' | 'auditory' | 'kinesthetic' = 'mixed',
  sessionId: string = ''
): EnhancedLessonConfig => {
  const phases: LessonActivity[] = [
    {
      id: 'math-intro',
      type: 'introduction',
      phase: 'introduction',
      title: 'Welcome to Mathematics',
      duration: ENHANCED_LESSON_PHASES.introduction.baseSeconds,
      phaseDescription: 'Introduction to mathematical concepts',
      metadata: { subject: 'mathematics', skillArea: 'general' },
      content: { text: 'Welcome to an exciting math lesson!' }
    }
  ];

  return {
    subject: 'mathematics',
    skillArea: 'general',
    gradeLevel,
    learningStyle,
    sessionId,
    title: `Mathematics Lesson (Grade ${gradeLevel})`,
    overview: 'Engaging mathematics lesson',
    phases,
    estimatedTotalDuration: phases.reduce((sum, phase) => sum + phase.duration, 0),
    learningObjectives: ['Understand basic mathematical concepts'],
    materials: ['Device with internet access'],
    assessmentMethods: ['Interactive exercises'],
    keywords: ['Mathematics', 'Learning']
  };
};

export const generateEnglishLesson = (
  gradeLevel: number,
  learningStyle: 'mixed' | 'visual' | 'auditory' | 'kinesthetic' = 'mixed',
  sessionId: string = ''
): EnhancedLessonConfig => {
  const phases: LessonActivity[] = [
    {
      id: 'english-intro',
      type: 'introduction',
      phase: 'introduction',
      title: 'Welcome to English',
      duration: ENHANCED_LESSON_PHASES.introduction.baseSeconds,
      phaseDescription: 'Introduction to English concepts',
      metadata: { subject: 'english', skillArea: 'general' },
      content: { text: 'Welcome to an exciting English lesson!' }
    }
  ];

  return {
    subject: 'english',
    skillArea: 'general',
    gradeLevel,
    learningStyle,
    sessionId,
    title: `English Lesson (Grade ${gradeLevel})`,
    overview: 'Engaging English lesson',
    phases,
    estimatedTotalDuration: phases.reduce((sum, phase) => sum + phase.duration, 0),
    learningObjectives: ['Understand basic English concepts'],
    materials: ['Device with internet access'],
    assessmentMethods: ['Interactive exercises'],
    keywords: ['English', 'Learning']
  };
};

export const generateScienceLesson = (
  gradeLevel: number,
  learningStyle: 'mixed' | 'visual' | 'auditory' | 'kinesthetic' = 'mixed',
  sessionId: string = ''
): EnhancedLessonConfig => {
  const phases: LessonActivity[] = [
    {
      id: 'science-intro',
      type: 'introduction',
      phase: 'introduction',
      title: 'Welcome to Science',
      duration: ENHANCED_LESSON_PHASES.introduction.baseSeconds,
      phaseDescription: 'Introduction to science concepts',
      metadata: { subject: 'science', skillArea: 'general' },
      content: { text: 'Welcome to an exciting science lesson!' }
    }
  ];

  return {
    subject: 'science',
    skillArea: 'general',
    gradeLevel,
    learningStyle,
    sessionId,
    title: `Science Lesson (Grade ${gradeLevel})`,
    overview: 'Engaging science lesson',
    phases,
    estimatedTotalDuration: phases.reduce((sum, phase) => sum + phase.duration, 0),
    learningObjectives: ['Understand basic science concepts'],
    materials: ['Device with internet access'],
    assessmentMethods: ['Interactive exercises'],
    keywords: ['Science', 'Learning']
  };
};

export const generateMusicLesson = (
  gradeLevel: number,
  learningStyle: 'mixed' | 'visual' | 'auditory' | 'kinesthetic' = 'mixed',
  sessionId: string = ''
): EnhancedLessonConfig => {
  const phases: LessonActivity[] = [
    {
      id: 'music-intro',
      type: 'introduction',
      phase: 'introduction',
      title: 'Welcome to Music',
      duration: ENHANCED_LESSON_PHASES.introduction.baseSeconds,
      phaseDescription: 'Introduction to music concepts',
      metadata: { subject: 'music', skillArea: 'general' },
      content: { text: 'Welcome to an exciting music lesson!' }
    }
  ];

  return {
    subject: 'music',
    skillArea: 'general',
    gradeLevel,
    learningStyle,
    sessionId,
    title: `Music Lesson (Grade ${gradeLevel})`,
    overview: 'Engaging music lesson',
    phases,
    estimatedTotalDuration: phases.reduce((sum, phase) => sum + phase.duration, 0),
    learningObjectives: ['Understand basic music concepts'],
    materials: ['Device with internet access'],
    assessmentMethods: ['Interactive exercises'],
    keywords: ['Music', 'Learning']
  };
};

export const generateComputerScienceLesson = (
  gradeLevel: number,
  learningStyle: 'mixed' | 'visual' | 'auditory' | 'kinesthetic' = 'mixed',
  sessionId: string = ''
): EnhancedLessonConfig => {
  const phases: LessonActivity[] = [
    {
      id: 'cs-intro',
      type: 'introduction',
      phase: 'introduction',
      title: 'Welcome to Computer Science',
      duration: ENHANCED_LESSON_PHASES.introduction.baseSeconds,
      phaseDescription: 'Introduction to computer science concepts',
      metadata: { subject: 'computerScience', skillArea: 'general' },
      content: { text: 'Welcome to an exciting computer science lesson!' }
    }
  ];

  return {
    subject: 'computerScience',
    skillArea: 'general',
    gradeLevel,
    learningStyle,
    sessionId,
    title: `Computer Science Lesson (Grade ${gradeLevel})`,
    overview: 'Engaging computer science lesson',
    phases,
    estimatedTotalDuration: phases.reduce((sum, phase) => sum + phase.duration, 0),
    learningObjectives: ['Understand basic computer science concepts'],
    materials: ['Device with internet access'],
    assessmentMethods: ['Interactive exercises'],
    keywords: ['Computer Science', 'Learning']
  };
};

export const generateCreativeArtsLesson = (
  gradeLevel: number,
  learningStyle: 'mixed' | 'visual' | 'auditory' | 'kinesthetic' = 'mixed',
  sessionId: string = ''
): EnhancedLessonConfig => {
  const phases: LessonActivity[] = [
    {
      id: 'arts-intro',
      type: 'introduction',
      phase: 'introduction',
      title: 'Welcome to Creative Arts',
      duration: ENHANCED_LESSON_PHASES.introduction.baseSeconds,
      phaseDescription: 'Introduction to creative arts concepts',
      metadata: { subject: 'creativeArts', skillArea: 'general' },
      content: { text: 'Welcome to an exciting creative arts lesson!' }
    }
  ];

  return {
    subject: 'creativeArts',
    skillArea: 'general',
    gradeLevel,
    learningStyle,
    sessionId,
    title: `Creative Arts Lesson (Grade ${gradeLevel})`,
    overview: 'Engaging creative arts lesson',
    phases,
    estimatedTotalDuration: phases.reduce((sum, phase) => sum + phase.duration, 0),
    learningObjectives: ['Understand basic creative arts concepts'],
    materials: ['Device with internet access'],
    assessmentMethods: ['Interactive exercises'],
    keywords: ['Creative Arts', 'Learning']
  };
};

export const generateCompleteEducationalSession = (
  gradeLevel: number,
  learningStyle: 'mixed' | 'visual' | 'auditory' | 'kinesthetic' = 'mixed',
  sessionId: string = ''
) => {
  return {
    mathematics: generateMathematicsLesson(gradeLevel, learningStyle, sessionId),
    english: generateEnglishLesson(gradeLevel, learningStyle, sessionId),
    science: generateScienceLesson(gradeLevel, learningStyle, sessionId),
    music: generateMusicLesson(gradeLevel, learningStyle, sessionId),
    computerScience: generateComputerScienceLesson(gradeLevel, learningStyle, sessionId),
    creativeArts: generateCreativeArtsLesson(gradeLevel, learningStyle, sessionId)
  };
};
