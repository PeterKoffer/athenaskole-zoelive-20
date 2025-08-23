// Observability counters
type CounterName = 
  | 'image.ensure.requested'
  | 'image.ensure.healed' 
  | 'image.ensure.skipped'
  | 'storage.list.calls'
  | 'signedurl.cache.hit'
  | 'signedurl.cache.miss'
  | 'fallback.used.webp'
  | 'fallback.used.png'
  | 'fallback.used.placeholder';

const counters = new Map<CounterName, number>();

export function incrementCounter(name: CounterName, delta = 1) {
  counters.set(name, (counters.get(name) || 0) + delta);
}

export function getCounter(name: CounterName): number {
  return counters.get(name) || 0;
}

export function getAllCounters(): Record<string, number> {
  return Object.fromEntries(counters.entries());
}

export function resetCounters() {
  counters.clear();
}

// Structured logging with correlation IDs
const DEBUG_ENABLED = localStorage?.getItem('debug:image') === 'true';

export function makeCorrelationId(bucket: string, path: string): string {
  return `img:${bucket}/${path}:${Date.now().toString(36)}`;
}

export function debugLog(cid: string, stage: string, ...args: any[]) {
  if (DEBUG_ENABLED) {
    console.debug(`[img]`, cid, `${stage}:`, ...args);
  }
}

export function warnLog(cid: string, stage: string, ...args: any[]) {
  console.warn(`[img]`, cid, `${stage}:`, ...args);
}