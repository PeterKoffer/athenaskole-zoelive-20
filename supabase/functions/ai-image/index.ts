// Deno / Supabase Edge Function: ai-image
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const BFL_API_KEY = Deno.env.get('BFL_API_KEY')!;
const BFL_API_URL = Deno.env.get('BFL_API_URL') ?? 'https://api.bfl.ai/v1/generate'; // adjust to actual
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const MONTHLY_IMAGE_BUDGET = Number(Deno.env.get('AI_IMAGE_BUDGET_USD_MONTHLY') ?? '15');

function estimateImageCostUSD(size: string, steps: number): number {
  // ballpark: larger size/steps → more cost
  const base = size === '1024' ? 0.04 : size === '768' ? 0.03 : 0.02;
  return base * (steps / 30);
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { global: { fetch } });

  const orgId = req.headers.get('x-org-id') ?? 'public';
  const size = req.headers.get('x-size') ?? '768';
  const steps = Number(req.headers.get('x-steps') ?? '30');
  const cacheKey = req.headers.get('x-cache-key') ?? '';

  // Monthly image budget check
  const firstOfMonth = new Date(); firstOfMonth.setDate(1); firstOfMonth.setHours(0,0,0,0);
  const { data: sumRows } = await supabase
    .from('ai_metrics')
    .select('cost_usd')
    .gte('created_at', firstOfMonth.toISOString());
  const spent = (sumRows ?? []).reduce((s, r: any) => s + (r.cost_usd || 0), 0);
  if (spent >= MONTHLY_IMAGE_BUDGET) {
    return new Response(JSON.stringify({ error: 'Monthly image budget reached.' }), { status: 402, headers: { 'content-type': 'application/json' }});
  }

  // Cache?
  if (cacheKey) {
    const { data: cached } = await supabase.from('ai_cache').select('value').eq('key', cacheKey).maybeSingle();
    if (cached?.value) {
      return new Response(JSON.stringify(cached.value), { headers: { 'content-type': 'application/json', 'x-cache': 'HIT' }});
    }
  }

  let body: { prompt: string };
  try { body = await req.json(); } catch { return new Response('Bad JSON', { status: 400 }); }

  // Call BFL (adjust to real API)
  const bflRes = await fetch(BFL_API_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'authorization': `Bearer ${BFL_API_KEY}` },
    body: JSON.stringify({ prompt: body.prompt, size, steps }),
  });

  if (!bflRes.ok) {
    const text = await bflRes.text();
    return new Response(JSON.stringify({ error: 'BFL error', detail: text }), { status: 502, headers: { 'content-type': 'application/json' }});
  }

  const out = await bflRes.json(); // expected: { url: "..."} or { b64: "..." }

  const cost = estimateImageCostUSD(size, steps);
  await supabase.from('ai_metrics').insert({
    org_id: orgId,
    provider: 'bfl',
    model: `size:${size}/steps:${steps}`,
    tokens: null,
    cost_usd: cost,
    key: cacheKey || null,
  });

  if (cacheKey) {
    await supabase.from('ai_cache').upsert({ key: cacheKey, value: out });
  }

  return new Response(JSON.stringify(out), { headers: { 'content-type': 'application/json' }});
});
