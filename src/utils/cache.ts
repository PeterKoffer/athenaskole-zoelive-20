// Cache module (no imports to avoid cycles)
export type Key = string;
export const cacheNS = { value: "anon" };

export function setNamespace(ns: string) {
  cacheNS.value = ns || "anon";
}

type CacheEntry<T> = { v: T; exp: number; lastUsed: number };
const MAX = 200;
const cache = new Map<Key, CacheEntry<any>>();

function makeKey(k: Key): Key {
  return `${cacheNS.value}:${k}`;
}

function evictLRU() {
  if (cache.size <= MAX) return;
  
  let oldest = Date.now();
  let oldestKey = '';
  
  for (const [key, entry] of cache.entries()) {
    if (entry.lastUsed < oldest) {
      oldest = entry.lastUsed;
      oldestKey = key;
    }
  }
  
  if (oldestKey) cache.delete(oldestKey);
}

export function memoGet<T>(k: Key): T | null {
  const key = makeKey(k);
  const e = cache.get(key);
  
  if (!e || Date.now() > e.exp) {
    cache.delete(key);
    return null;
  }
  
  e.lastUsed = Date.now();
  return e.v as T;
}

export function memoSet<T>(k: Key, v: T, ttlMs = 3 * 60 * 1000) {
  // Keep URL TTL < token TTL (5min token, 2.5min cache)
  const safeTtl = Math.min(ttlMs, 2.5 * 60 * 1000);
  const key = makeKey(k);
  const now = Date.now();
  
  cache.set(key, { 
    v, 
    exp: now + safeTtl, 
    lastUsed: now 
  });
  
  evictLRU();
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

export const memoNamespace = {
  set: setNamespace,
  clear: (ns?: string) => {
    const targetNs = ns || cacheNS.value;
    for (const key of cache.keys()) {
      if (key.startsWith(`${targetNs}:`)) {
        cache.delete(key);
      }
    }
  }
};