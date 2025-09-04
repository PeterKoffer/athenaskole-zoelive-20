import { AI_CONFIG } from '@/config/aiConfig';
import { CostGovernor, type TextRequest, type ImageRequest } from './CostGovernor';

// Simple stable hash for cache keys (client-side only)
async function sha256(input: string): Promise<string> {
  if (typeof crypto !== 'undefined' && 'subtle' in crypto) {
    const buf = new TextEncoder().encode(input);
    const hash = await crypto.subtle.digest('SHA-256', buf);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2,'0')).join('');
  }
  // Fallback (non-cryptographic)
  let h = 0; for (let i=0;i<input.length;i++) { h = ((h<<5)-h) + input.charCodeAt(i); h|=0; }
  return `h${h >>> 0}`;
}

export type TextResponse = { content: string; usage?: { total_tokens?: number } };
export type ImageResponse = { url?: string; b64?: string };

export async function requestText(req: TextRequest): Promise<TextResponse> {
  const decision = CostGovernor.decideText(req);
  if (!decision.allow) return { content: '[Blocked by cost policy]' };

  const cacheKey = await sha256(JSON.stringify({ kind:'text', req, decision }));
  const url = `${AI_CONFIG.FUNCTIONS_URL}/ai-text`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-org-id': req.orgId,
      'x-model': decision.model,
      'x-max-tokens': String(decision.maxTokens),
      'x-cheap-mode': decision.cheap ? '1' : '0',
      'x-cache-key': cacheKey,
    },
    body: JSON.stringify(req.prompt),
  });
  if (!res.ok) {
    // Attempt free fallback (Lesson Ideas bank)
    const idea = await fallbackLessonIdea();
    return { content: idea ?? 'Please try again later.' };
  }
  return await res.json();
}

export async function requestImage(req: ImageRequest): Promise<ImageResponse> {
  const decision = CostGovernor.decideImage(req);
  if (!decision.allow) return {};

  const cacheKey = await sha256(JSON.stringify({ kind:'image', req, decision }));
  const url = `${AI_CONFIG.FUNCTIONS_URL}/ai-image`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-org-id': req.orgId,
      'x-size': decision.size,
      'x-steps': String(decision.steps),
      'x-cache-key': cacheKey,
    },
    body: JSON.stringify({ prompt: req.prompt }),
  });
  if (!res.ok) return {};
  return await res.json();
}

// Very simple free fallback (replace with your 500-idea bank)
async function fallbackLessonIdea(): Promise<string | null> {
  try {
    const res = await fetch('/data/lesson-ideas/index.json');
    if (!res.ok) return null;
    const ideas: Array<{ title: string; description: string }> = await res.json();
    const pick = ideas[Math.floor(Math.random()*ideas.length)];
    return `Lesson idea: ${pick.title}\n\n${pick.description}`;
  } catch { return null; }
}
