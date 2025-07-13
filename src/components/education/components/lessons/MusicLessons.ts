
import { LessonActivity } from '../types/LessonTypes';
import { generateMusicDiscoveryLessons } from './MusicDiscoveryLessons';

export const createMusicLesson = (skillArea: string, gradeLevel: number = 5): LessonActivity[] => {
  // Generate a unique session ID for the lesson
  const sessionId = `music-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Use the comprehensive Music Discovery curriculum
  return generateMusicDiscoveryLessons({ 
    skillArea, 
    gradeLevel, 
    sessionId 
  });
};

// Re-export for backward compatibility
export { generateMusicDiscoveryLessons } from './MusicDiscoveryLessons';
