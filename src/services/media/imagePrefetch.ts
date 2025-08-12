// src/services/media/imagePrefetch.ts
const imageCache = new Map<string, Promise<string | null>>();
let inflight = 0;
const MAX_CONCURRENCY = 3;

async function withGate<T>(fn: () => Promise<T>) {
  while (inflight >= MAX_CONCURRENCY) {
    await new Promise((r) => setTimeout(r, 50));
  }
  inflight++;
  try {
    return await fn();
  } finally {
    inflight--;
  }
}

export async function generateActivityImage(prompt?: string): Promise<string | null> {
  if (!prompt) return null;
  const key = prompt.trim();
  if (imageCache.has(key)) return imageCache.get(key)!;

  const p = withGate(async () => {
    try {
      // Stub: integrate your edge function or Supabase invoke here.
      // Returning null keeps behavior safe until backend is wired.
      return null;
    } catch {
      return null;
    }
  });

  imageCache.set(key, p);
  return p;
}
