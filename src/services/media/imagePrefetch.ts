// src/services/media/imagePrefetch.ts
import { buildImagePrompt, NEGATIVE_PROMPT, seedFromId } from "../imagePromptBuilder";

let inflight = 0;
const MAX_CONCURRENCY = 3;
const imageCache = new Map<string, Promise<string | null>>();
const PROMPT_VERSION = (import.meta.env?.VITE_PROMPT_VERSION ?? 'v2').toString().trim();

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

export async function generateActivityImage(prompt?: string, phaseType: "cover" | "math" | "language" | "science" | "exit" = "cover"): Promise<string | null> {
  if (!prompt) return null;
  
  // Professional environment prompt - NO CLASSROOM
  const enhancedPrompt = `Professional modern environment for "${prompt}". Cinematic lighting, realistic props, inspiring atmosphere, no text overlay, no classroom elements.`;
  
  const key = hashKey(`${PROMPT_VERSION}:${enhancedPrompt}`);
  if (imageCache.has(key)) return imageCache.get(key)!;

  const p = withGate(async () => {
    try {
      const base = (import.meta as any)?.env?.VITE_IMAGE_EDGE_URL;
      if (!base) return null;
      
      const seed = seedFromId(key);
      
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/image-ensure`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          universeId: 'activity-image',
          gradeInt: 6,
          title: enhancedPrompt,
        }),
      });
      const data = await res.json().catch(() => ({}));
      return data?.url || null;
    } catch {
      return null;
    }
  });

  imageCache.set(key, p);
  return p;
}
