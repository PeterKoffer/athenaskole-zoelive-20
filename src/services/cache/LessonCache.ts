// Simple lesson caching implementation
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

type CachedLesson = {
  data: any;
  timestamp: number;
};

export function saveLessonCache(key: string, lesson: any): void {
  try {
    const cached: CachedLesson = {
      data: lesson,
      timestamp: Date.now()
    };
    localStorage.setItem(`lesson_cache:${key}`, JSON.stringify(cached));
  } catch (error) {
    console.warn("Failed to save lesson cache:", error);
  }
}

export function loadLessonCache(key: string): any | null {
  try {
    const stored = localStorage.getItem(`lesson_cache:${key}`);
    if (!stored) return null;
    
    const cached: CachedLesson = JSON.parse(stored);
    
    // Check if cache is still valid
    if (Date.now() - cached.timestamp > CACHE_DURATION) {
      localStorage.removeItem(`lesson_cache:${key}`);
      return null;
    }
    
    return cached.data;
  } catch (error) {
    console.warn("Failed to load lesson cache:", error);
    return null;
  }
}

export function clearLessonCache(): void {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith("lesson_cache:")) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.warn("Failed to clear lesson cache:", error);
  }
}