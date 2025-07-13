
import { LessonActivity } from '../types/LessonTypes';
import { createMusicDiscoveryLesson } from './MusicDiscoveryLessons';

export const createMusicLesson = (skillArea: string, gradeLevel: number = 5): LessonActivity[] => {
  // Use the comprehensive Music Discovery curriculum
  return createMusicDiscoveryLesson(skillArea, gradeLevel);
};

// Re-export for backward compatibility
export { createMusicDiscoveryLesson, MUSIC_DISCOVERY_SKILL_AREAS } from './MusicDiscoveryLessons';
