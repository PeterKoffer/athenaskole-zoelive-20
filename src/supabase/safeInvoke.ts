// src/supabase/safeInvoke.ts
import { supabase } from '@/integrations/supabase/client';
import * as fc from '@/supabase/functionsClient'; // kan indeholde invokeFn
// ^ vi bruger namespace import for at kunne teste fc.invokeFn findes

type Opts = {
  logName?: string;                   // viser navn i console
  headers?: Record<string, string>;   // ekstra headers hvis nødvendigt
};

export async function safeInvoke<T = unknown>(
  name: string,
  body?: unknown,
  opts: Opts = {}
): Promise<T> {
  const tag = opts.logName ?? name;

  // 1) foretræk vores JWT-sikre helper hvis den er tilgængelig
  if (typeof (fc as any).invokeFn === 'function') {
    try {
      console.debug(`[invoke] ${tag} (via invokeFn)`);
      return await (fc as any).invokeFn(name, body, { headers: opts.headers });
    } catch (e) {
      console.warn(`[invoke] ${tag} invokeFn failed, falling back`, e);
    }
  }

  // 2) fallback til supabase.functions.invoke med Authorization-header
  const { data: sess } = await supabase.auth.getSession();
  const jwt = sess.session?.access_token;
  const { data, error } = await supabase.functions.invoke(name, {
    body: body as Record<string, unknown>,
    headers: { ...(opts.headers ?? {}), ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}) },
  });

  if (error) throw error;
  return data as T;
}

function isNewPlannerShape(x: any) {
  return x && typeof x === 'object'
    && x.meta && x.world && Array.isArray(x.scenes) && x.timeBudget;
}

function isLegacyShape(x: any) {
  return x && (Array.isArray(x.activities) || Array.isArray(x.lessons));
}

export function validatePlannerResponse(payload: any, context = 'unknown') {
  if (!isNewPlannerShape(payload) && !isLegacyShape(payload)) {
    console.groupCollapsed('⚠️ Planner validation failed – raw response');
    console.log('context:', context);
    console.log('type:', typeof payload);
    try { console.log('keys:', Object.keys(payload ?? {})); } catch {}
    console.log(payload);
    console.groupEnd();
    return false;
  }
  return true;
}

function normalizePlanner(x: any) {
  if (!x || typeof x !== 'object') return null;

  // Ny model
  if (x.meta && x.world && Array.isArray(x.scenes)) {
    return {
      ...x,
      timeBudget: x.timeBudget ?? { minutes: 20 },
      scenes: x.scenes.length ? x.scenes : [{ id: 'auto-1', activities: [] }],
    };
  }

  // Legacy model -> pak ind
  if (Array.isArray(x.activities)) {
    return {
      meta: { version: 'legacy-adapted' },
      world: { theme: 'default' },
      scenes: [{ id: 'legacy-1', activities: x.activities }],
      timeBudget: { minutes: 20 },
    };
  }

  return null;
}

export { normalizePlanner };

// --- COMPAT LAYER ---
export const invokeFn = safeInvoke;   // gammel API, samme signatur
export default safeInvoke;            // valgfrit: nem import som default