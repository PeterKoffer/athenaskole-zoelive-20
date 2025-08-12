// src/services/media/imagePrefetch.ts
let inflight = 0;
const MAX_CONCURRENCY = 3;
const imageCache = new Map<string, Promise<string | null>>();
const PROMPT_VERSION = (import.meta.env?.VITE_PROMPT_VERSION ?? 'v1').toString().trim();

// Lightweight FNV-like hash for stable keys
function hashKey(s: string): string {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = (h + (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24)) >>> 0;
  }
  return h.toString(36);
}

async function withGate<T>(fn: () => Promise<T>) {
  while (inflight >= MAX_CONCURRENCY) await new Promise((r) => setTimeout(r, 50));
  inflight++;
  try {
    return await fn();
  } finally {
    inflight--;
  }
}

export async function generateActivityImage(prompt?: string): Promise<string | null> {
  if (!prompt) return null;
  const key = hashKey(`${PROMPT_VERSION}:${prompt.trim()}`);
  if (imageCache.has(key)) return imageCache.get(key)!;

  const p = withGate(async () => {
    try {
      const u = (import.meta as any)?.env?.VITE_IMAGE_EDGE_URL;
      if (!u) return null;
      const res = await fetch(u as string, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, size: '1024x576', promptVersion: PROMPT_VERSION })
      });
      const data = await res.json().catch(() => ({}));
      return typeof data?.url === 'string' ? (data.url as string) : null;
    } catch {
      return null;
    }
  });

  imageCache.set(key, p);
  return p;
}
