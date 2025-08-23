// Observability counters (leaf module - no imports)
type C = Record<string, number>;
const counters: C = {};

export function incr(name: string, by = 1) {
  counters[name] = (counters[name] || 0) + by;
}

export function getAll(): Record<string, number> {
  return { ...counters };
}

export function resetCounters() {
  Object.keys(counters).forEach(key => delete counters[key]);
}

// Structured logging with correlation IDs
const DEBUG_ENABLED = typeof localStorage !== 'undefined' && localStorage?.getItem('debug:image') === 'true';

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