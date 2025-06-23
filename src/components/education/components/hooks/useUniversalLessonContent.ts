
export { generateWelcomeActivity as createWelcomeActivity } from '../utils/welcomeActivityGenerator';

export const useUniversalLessonContent = (subject: string, skillArea: string) => {
  return {
    subject,
    skillArea,
    isLoading: false,
    content: null
  };
};
