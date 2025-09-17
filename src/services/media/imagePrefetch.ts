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
  
  // Use enhanced prompt builder for better quality
  const enhancedPrompt = buildImagePrompt({
    style: "kidbook-gouache",
    subject: prompt,
    setting: "professional research environment, modern laboratory, scientific workspace, no classrooms",
    consistency: `NELIE-activity-v2-${phaseType}`
  });
  
  const key = hashKey(`${PROMPT_VERSION}:${enhancedPrompt}`);
  if (imageCache.has(key)) return imageCache.get(key)!;

  const p = withGate(async () => {
    try {
      const base = (import.meta as any)?.env?.VITE_IMAGE_EDGE_URL;
      if (!base) return null;
      
      const seed = seedFromId(key);
      
      const res = await fetch(`${base}/image-service`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'apikey': (import.meta as any)?.env?.VITE_SUPABASE_ANON_KEY || '',
          'authorization': `Bearer ${(import.meta as any)?.env?.VITE_SUPABASE_ANON_KEY || ''}`
        },
        body: JSON.stringify({
          prompt: enhancedPrompt,
          negative_prompt: NEGATIVE_PROMPT,
          seed: seed,
          universeId: `activity-${key}`,
          width: 1920,
          height: 1080
        })
      });
      const data = await res.json().catch(() => ({}));
      return data?.data?.publicUrl || data?.data?.bflUrl || null;
    } catch {
      return null;
    }
  });

  imageCache.set(key, p);
  return p;
}
