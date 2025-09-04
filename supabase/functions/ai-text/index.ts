// supabase/functions/ai-text/index.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import OpenAI from "npm:openai@4";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY")!;
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
const openai = new OpenAI({ apiKey: Deno.env.get("OPENAI_API_KEY")! });

const AI_BUDGET_USD_MONTHLY = Number(Deno.env.get("AI_BUDGET_USD_MONTHLY") ?? "25");
const AI_MAX_TOKENS = Number(Deno.env.get("AI_MAX_TOKENS") ?? "1500");
const AI_CHEAP_MODE = Deno.env.get("AI_CHEAP_MODE") === "1";
const PRICE_IN_PER_1K  = Number(Deno.env.get("AI_TEXT_PRICE_IN_PER_1K")  ?? "0.15") / 1000;
const PRICE_OUT_PER_1K = Number(Deno.env.get("AI_TEXT_PRICE_OUT_PER_1K") ?? "0.60") / 1000;

function monthStartISO(d = new Date()) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1)).toISOString();
}

async function getSpentUSD(orgId: string) {
  const { data, error } = await supabase
    .from("ai_metrics")
    .select("cost_usd")
    .eq("org_id", orgId)
    .gte("created_at", monthStartISO());
  if (error) { console.error(error); return 0; }
  return (data ?? []).reduce((s: number, r: any) => s + Number(r.cost_usd || 0), 0);
}

async function getCache(key: string, ttlSec: number) {
  const { data } = await supabase
    .from("ai_cache")
    .select("value, created_at")
    .eq("key", key)
    .maybeSingle();
  if (!data) return null;
  const age = (Date.now() - new Date(data.created_at).getTime()) / 1000;
  return age <= ttlSec ? data.value : null;
}

async function setCache(key: string, value: unknown) {
  await supabase.from("ai_cache").upsert({ key, value, created_at: new Date().toISOString() });
}

async function logCost(opts: { orgId: string; provider: string; model: string; tokens: number; cost: number; key?: string; }) {
  await supabase.from("ai_metrics").insert({
    org_id: opts.orgId, provider: opts.provider, model: opts.model,
    tokens: opts.tokens, cost_usd: opts.cost, key: opts.key ?? null,
  });
}

async function sha1(s: string) {
  const buf = new TextEncoder().encode(s);
  const hash = await crypto.subtle.digest("SHA-1", buf);
  return Array.from(new Uint8Array(hash)).map(b=>b.toString(16).padStart(2,"0")).join("");
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return new Response("Use POST", { status: 405, headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const {
      prompt,
      orgId = "default-org",
      cacheKey,
      ttlSec = 60 * 60 * 24,
      mode,
      model: modelOverride,
      systemPrompt,
      maxTokens,
    } = body ?? {};

    if (!prompt) {
      return new Response(JSON.stringify({ error: "Missing 'prompt'" }), {
        status: 400, headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    // Budget
    const spent = await getSpentUSD(orgId);
    if (spent >= AI_BUDGET_USD_MONTHLY) {
      return new Response(JSON.stringify({ error: "AI monthly budget exceeded", spent, budget: AI_BUDGET_USD_MONTHLY }), {
        status: 429, headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    // Cache?
    const keyRaw = cacheKey ?? `${orgId}:${prompt}`;
    const key = await sha1(keyRaw);
    const cached = await getCache(key, ttlSec);
    if (cached) {
      return new Response(JSON.stringify({ cached: true, data: cached }), {
        status: 200, headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    const cheap = (mode === "cheap") || AI_CHEAP_MODE;
    const model = modelOverride ?? (cheap ? "gpt-4o-mini" : "gpt-4o");
    const max_out_tokens = Math.min(Number(maxTokens ?? AI_MAX_TOKENS), AI_MAX_TOKENS);

    const messages = [
      { role: "system", content: systemPrompt ?? (cheap
        ? "You are a concise educational content generator. Keep outputs compact and structured."
        : "You are an engaging educational content generator. Be structured, clear, and adaptive.") },
      { role: "user", content: String(prompt) },
    ] as const;

    const res = await openai.chat.completions.create({
      model, messages, max_tokens: max_out_tokens, temperature: cheap ? 0.2 : 0.7
    });

    const text = res.choices?.[0]?.message?.content ?? "";
    const usage = res.usage ?? { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };
    const cost =
      (usage.prompt_tokens * PRICE_IN_PER_1K) +
      (usage.completion_tokens * PRICE_OUT_PER_1K);

    await logCost({
      orgId, provider: "openai", model,
      tokens: usage.total_tokens ?? 0,
      cost, key
    });

    const payload = { model, usage, cost_est_usd: Number(cost.toFixed(6)), output: text };
    await setCache(key, payload);

    return new Response(JSON.stringify(payload), {
      status: 200, headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500, headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }
});
