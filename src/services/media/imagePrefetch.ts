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
  
  // ALL PROMPTS NOW GO THROUGH THE SINGLE IMAGE-ENSURE SYSTEM
  const key = hashKey(`${PROMPT_VERSION}:${prompt}`);
  if (imageCache.has(key)) return imageCache.get(key)!;

  const p = withGate(async () => {
    try {
      const supabaseUrl = 'https://yphkfkpfdpdmllotpqua.supabase.co';
      const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwaGtma3BmZHBkbWxsb3RwcXVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0MTcxNTksImV4cCI6MjA2Mzk5MzE1OX0.hqyZ2nk3dqMx8rX9tdM1H4XF9wZ9gvaRor-6i5AyCy8';
      
      const res = await fetch(`${supabaseUrl}/functions/v1/image-ensure`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${anonKey}`,
        },
        body: JSON.stringify({
          universeId: 'activity-image',
          gradeInt: 6,
          title: prompt, // Let the edge function handle the prompt building
          mode: 'professional' // NEVER classroom unless explicitly requested
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
