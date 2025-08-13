export function saveLessonCache(key: string, data: any) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
}

export function loadLessonCache(key: string) {
  try { const t = localStorage.getItem(key); return t ? JSON.parse(t) : null; } catch { return null; }
}

/* Note: builder now constructs cacheKey with:
   userId + date + source + subject + gradeBand + minutes
   so stale generic content won't survive when you switch to offline packs.
*/

export function clearLessonCache(): void {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith("lesson:")) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.warn("Failed to clear lesson cache:", error);
  }
}