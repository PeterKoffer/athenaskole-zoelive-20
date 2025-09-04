// Deno / Supabase Edge Function: ai-text
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const MONTHLY_BUDGET_USD = Number(Deno.env.get('AI_BUDGET_USD_MONTHLY') ?? '25');
const PER_MINUTE_LIMIT = Number(Deno.env.get('AI_RATE_LIMIT_PER_MINUTE') ?? '60');

type ChatRequest = { messages: Array<{ role: 'system'|'user'|'assistant'; content: string }> };

function estimateCostUSD(model: string, tokens: number): number {
  // very rough, adjust to your contract/prices
  // mini input+output ballpark
  const per1k = 0.002; 
  return (tokens / 1000) * per1k;
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { global: { fetch } });

  const orgId = req.headers.get('x-org-id') ?? 'public';
  const model = req.headers.get('x-model') ?? 'gpt-4o-mini';
  const maxTokens = Number(req.headers.get('x-max-tokens') ?? '1200');
  const cheap = req.headers.get('x-cheap-mode') === '1';
  const cacheKey = req.headers.get('x-cache-key') ?? '';

  // Basic rate-limit (per minute)
  const nowIso = new Date().toISOString();
  const oneMinAgo = new Date(Date.now() - 60_000).toISOString();
  const { data: recent, error: rlErr } = await supabase
    .from('ai_metrics')
    .select('id', { count: 'exact', head: true })
    .eq('org_id', orgId)
    .gte('created_at', oneMinAgo);
  if (!rlErr && (recent?.length ?? 0) >= PER_MINUTE_LIMIT) {
    return new Response(JSON.stringify({ error: 'Rate limit. Try later.' }), { status: 429, headers: { 'content-type': 'application/json' }});
  }

  // Monthly budget check
  const firstOfMonth = new Date(); firstOfMonth.setDate(1); firstOfMonth.setHours(0,0,0,0);
  const { data: sumRows } = await supabase
    .rpc('sum_ai_cost_usd', { p_org: orgId, p_since: firstOfMonth.toISOString() })
    .catch(() => ({ data: [{ sum: 0 }] as any }));
  const spent = Number((sumRows?.[0]?.sum ?? 0));
  if (spent >= MONTHLY_BUDGET_USD) {
    return new Response(JSON.stringify({ error: 'Monthly AI budget reached.' }), { status: 402, headers: { 'content-type': 'application/json' }});
  }

  // Cache hit?
  if (cacheKey) {
    const { data: cached } = await supabase.from('ai_cache').select('value').eq('key', cacheKey).maybeSingle();
    if (cached?.value) {
      return new Response(JSON.stringify(cached.value), { headers: { 'content-type': 'application/json', 'x-cache': 'HIT' }});
    }
  }

  let body: ChatRequest;
  try { body = await req.json(); } catch { return new Response('Bad JSON', { status: 400 }); }

  // OpenAI call
  const oaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'authorization': `Bearer ${OPENAI_API_KEY}` },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      temperature: cheap ? 0.3 : 0.7,
      messages: body.messages,
    }),
  });

  if (!oaiRes.ok) {
    const text = await oaiRes.text();
    return new Response(JSON.stringify({ error: 'OpenAI error', detail: text }), { status: 502, headers: { 'content-type': 'application/json' }});
  }

  const out = await oaiRes.json();
  const tokens = out?.usage?.total_tokens ?? 0;
  const cost = estimateCostUSD(model, tokens);

  // Log + cache
  await supabase.from('ai_metrics').insert({
    org_id: orgId,
    provider: 'openai',
    model,
    tokens,
    cost_usd: cost,
    key: cacheKey || null,
  });

  if (cacheKey) {
    await supabase.from('ai_cache').upsert({ key: cacheKey, value: out });
  }

  return new Response(JSON.stringify({
    content: out.choices?.[0]?.message?.content ?? '',
    usage: out.usage,
  }), { headers: { 'content-type': 'application/json' }});
});
