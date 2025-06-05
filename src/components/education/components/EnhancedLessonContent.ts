
// Re-export types
export type { LessonActivity } from './types/LessonTypes';

// Re-export lesson creators
export { createMathematicsLesson } from './lessons/MathematicsLessons';
export { createEnglishLesson } from './lessons/EnglishLessons';
export { createScienceLesson } from './lessons/ScienceLessons';
export { createMusicLesson } from './lessons/MusicLessons';
export { createComputerScienceLesson } from './lessons/ComputerScienceLessons';
export { createCreativeArtsLesson } from './lessons/CreativeArtsLessons';

// Re-export utility
export { createWelcomeActivity } from './utils/welcomeActivityGenerator';
