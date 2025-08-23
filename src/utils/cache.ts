type CacheEntry<T> = { v: T; exp: number };
const cache = new Map<string, CacheEntry<any>>();

export function memoGet<T>(k: string): T | null {
  const e = cache.get(k);
  if (!e || Date.now() > e.exp) {
    cache.delete(k);
    return null;
  }
  return e.v as T;
}

export function memoSet<T>(k: string, v: T, ttlMs = 3 * 60 * 1000) {
  cache.set(k, { v, exp: Date.now() + ttlMs });
}

export function memoClear(pattern?: string) {
  if (!pattern) {
    cache.clear();
    return;
  }
  for (const key of cache.keys()) {
    if (key.includes(pattern)) {
      cache.delete(key);
    }
  }
}