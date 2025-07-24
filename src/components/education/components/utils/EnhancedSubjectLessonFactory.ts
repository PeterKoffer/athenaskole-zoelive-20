
// @ts-nocheck
import { EnhancedLessonConfig, generateEnhancedLesson } from './EnhancedLessonGenerator';

export const generateCompleteEducationalSession = async (
  subject: string,
  skillArea: string,
  gradeLevel: number = 6
): Promise<EnhancedLessonConfig> => {
  return await generateEnhancedLesson(subject, skillArea);
};

export { generateEnhancedLesson };
