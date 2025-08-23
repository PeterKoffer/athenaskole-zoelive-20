type CacheEntry<T> = { v: T; exp: number; lastUsed: number };

class LRUCache {
  private cache = new Map<string, CacheEntry<any>>();
  private maxSize = 200;
  private namespace = 'anon';

  setNamespace(ns: string) {
    this.namespace = ns;
  }

  private makeKey(k: string): string {
    return `${this.namespace}:${k}`;
  }

  private evictLRU() {
    if (this.cache.size <= this.maxSize) return;
    
    let oldest = Date.now();
    let oldestKey = '';
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastUsed < oldest) {
        oldest = entry.lastUsed;
        oldestKey = key;
      }
    }
    
    if (oldestKey) this.cache.delete(oldestKey);
  }

  get<T>(k: string): T | null {
    const key = this.makeKey(k);
    const e = this.cache.get(key);
    
    if (!e || Date.now() > e.exp) {
      this.cache.delete(key);
      return null;
    }
    
    e.lastUsed = Date.now();
    return e.v as T;
  }

  set<T>(k: string, v: T, ttlMs = 3 * 60 * 1000) {
    const key = this.makeKey(k);
    const now = Date.now();
    
    this.cache.set(key, { 
      v, 
      exp: now + ttlMs, 
      lastUsed: now 
    });
    
    this.evictLRU();
  }

  clear(pattern?: string) {
    if (!pattern) {
      this.cache.clear();
      return;
    }
    
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  clearNamespace(ns?: string) {
    const targetNs = ns || this.namespace;
    for (const key of this.cache.keys()) {
      if (key.startsWith(`${targetNs}:`)) {
        this.cache.delete(key);
      }
    }
  }
}

const lruCache = new LRUCache();

export function memoGet<T>(k: string): T | null {
  return lruCache.get<T>(k);
}

export function memoSet<T>(k: string, v: T, ttlMs = 3 * 60 * 1000) {
  // Keep URL TTL < token TTL (5min token, 2.5min cache)
  const safeTtl = Math.min(ttlMs, 2.5 * 60 * 1000);
  lruCache.set(k, v, safeTtl);
}

export function memoClear(pattern?: string) {
  lruCache.clear(pattern);
}

export const memoNamespace = {
  set: (ns: string) => lruCache.setNamespace(ns),
  clear: (ns?: string) => lruCache.clearNamespace(ns)
};