
export { generateWelcomeActivity as createWelcomeActivity } from './utils/welcomeActivityGenerator';

export const createEnhancedLessonContent = (subject: string, skillArea: string) => {
  return {
    subject,
    skillArea,
    content: `Enhanced lesson content for ${subject} - ${skillArea}`
  };
};
