
import { LessonActivity } from '@/components/education/components/types/LessonTypes';

export class CacheService {
  static getTodaysLesson(
    userId: string, 
    subject: string, 
    currentDate: string
  ): LessonActivity[] | null {
    const cacheKey = `lesson_${userId}_${subject}_${currentDate}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (error) {
        console.error('Failed to parse cached lesson:', error);
        return null;
      }
    }
    
    return null;
  }

  static cacheTodaysLesson(
    userId: string, 
    subject: string, 
    currentDate: string, 
    activities: LessonActivity[]
  ): void {
    const cacheKey = `lesson_${userId}_${subject}_${currentDate}`;
    try {
      localStorage.setItem(cacheKey, JSON.stringify(activities));
      console.log(`📚 Cached lesson for ${subject} on ${currentDate}`);
    } catch (error) {
      console.error('Failed to cache lesson:', error);
    }
  }

  static clearTodaysLesson(
    userId: string, 
    subject: string, 
    currentDate: string
  ): void {
    const cacheKey = `lesson_${userId}_${subject}_${currentDate}`;
    localStorage.removeItem(cacheKey);
    console.log(`🗑️ Cleared cached lesson for ${subject} on ${currentDate}`);
  }
}
