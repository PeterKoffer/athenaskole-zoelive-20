import { LessonActivity } from '@/components/education/components/types/LessonTypes';

export class CacheService {
  private static readonly LESSON_CACHE_KEY = 'daily_lesson_cache';

  /**
   * Get cached lesson for today
   */
  static getTodaysLesson(userId: string, subject: string, currentDate: string): LessonActivity[] | null {
    try {
      const cache = localStorage.getItem(this.LESSON_CACHE_KEY);
      if (!cache) return null;

      const parsedCache = JSON.parse(cache);
      const key = `${userId}-${subject}-${currentDate}`;
      
      return parsedCache[key] || null;
    } catch (error) {
      console.warn('Error reading lesson cache:', error);
      return null;
    }
  }

  /**
   * Cache lesson for today
   */
  static cacheTodaysLesson(userId: string, subject: string, currentDate: string, activities: LessonActivity[]): void {
    try {
      const cache = localStorage.getItem(this.LESSON_CACHE_KEY);
      const parsedCache = cache ? JSON.parse(cache) : {};
      
      const key = `${userId}-${subject}-${currentDate}`;
      parsedCache[key] = activities;

      // Clean old entries (keep only last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      Object.keys(parsedCache).forEach(cacheKey => {
        const [, , date] = cacheKey.split('-');
        if (new Date(date) < sevenDaysAgo) {
          delete parsedCache[cacheKey];
        }
      });

      localStorage.setItem(this.LESSON_CACHE_KEY, JSON.stringify(parsedCache));
      console.log(`✅ Cached lesson for ${key}`);
    } catch (error) {
      console.warn('Error caching lesson:', error);
    }
  }

  /**
   * Clear cached lesson (for regeneration)
   */
  static clearTodaysLesson(userId: string, subject: string, currentDate: string): void {
    try {
      const cache = localStorage.getItem(this.LESSON_CACHE_KEY);
      if (!cache) return;

      const parsedCache = JSON.parse(cache);
      const key = `${userId}-${subject}-${currentDate}`;
      
      if (parsedCache[key]) {
        delete parsedCache[key];
        localStorage.setItem(this.LESSON_CACHE_KEY, JSON.stringify(parsedCache));
        console.log(`🗑️ Cleared cached lesson for ${key}`);
      }
    } catch (error) {
      console.warn('Error clearing lesson cache:', error);
    }
  }
}
