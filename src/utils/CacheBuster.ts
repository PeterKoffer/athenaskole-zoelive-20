
export class CacheBuster {
  private static instance: CacheBuster;
  private cacheKey: string;

  private constructor() {
    this.cacheKey = `cache-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    console.log('🔄 CacheBuster initialized with key:', this.cacheKey);
  }

  public static getInstance(): CacheBuster {
    if (!CacheBuster.instance) {
      CacheBuster.instance = new CacheBuster();
    }
    return CacheBuster.instance;
  }

  public getCacheKey(): string {
    return this.cacheKey;
  }

  public bustCache(): void {
    this.cacheKey = `cache-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    console.log('🔄 Cache busted! New key:', this.cacheKey);
    
    // Clear various types of cache
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          console.log('🗑️ Clearing cache:', name);
          caches.delete(name);
        });
      });
    }
    
    // Clear localStorage items that might be cached
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('universe') || key.includes('daily') || key.includes('nelie'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    // Force a hard refresh if possible
    if (confirm('Would you like to perform a hard refresh to clear all caches?')) {
      window.location.reload();
    }
  }
}

export const cacheBuster = CacheBuster.getInstance();
