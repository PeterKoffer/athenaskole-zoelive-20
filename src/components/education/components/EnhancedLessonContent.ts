
export { generateWelcomeActivity as createWelcomeActivity } from './utils/welcomeActivityGenerator';
export { LessonActivity } from './types/LessonTypes';

export const createEnhancedLessonContent = (subject: string, skillArea: string) => {
  return {
    subject,
    skillArea,
    content: `Enhanced lesson content for ${subject} - ${skillArea}`
  };
};
