import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import OpenAI from "npm:openai@4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const BFL_API_KEY = Deno.env.get("BFL_API_KEY") ?? "";
const BFL_API_URL = (Deno.env.get("BFL_API_URL") ?? "https://api.bfl.ai").replace(/\/+$/,"");
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY") ?? "";

const IMAGE_BUDGET = Number(Deno.env.get("AI_IMAGE_BUDGET_USD_MONTHLY") ?? "15");
const IMAGE_PRICE_USD = Number(Deno.env.get("AI_IMAGE_PRICE_USD") ?? "0.010");

function monthStartISO(d=new Date()) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1)).toISOString();
}
async function getImageSpent(orgId: string) {
  const { data, error } = await supabase.from("ai_metrics")
    .select("cost_usd")
    .eq("org_id", orgId)
    .gte("created_at", monthStartISO());
  if (error) { console.error("getImageSpent error", error); return 0; }
  return (data ?? []).reduce((s: number, r: any) => s + Number(r.cost_usd || 0), 0);
}
async function logCost(orgId: string, provider: string, model: string, cost: number) {
  const { error } = await supabase.from("ai_metrics").insert({
    org_id: orgId, provider, model, tokens: 0, cost_usd: cost
  });
  if (error) console.error("logCost error", error);
}

function pickBase64FromAny(data: any): string | null {
  if (typeof data?.image_base64 === "string") return data.image_base64;           // custom
  if (Array.isArray(data?.images) && data.images[0]?.b64_json) return data.images[0].b64_json; // some providers
  if (Array.isArray(data?.data) && data.data[0]?.b64_json) return data.data[0].b64_json;       // OpenAI
  if (Array.isArray(data?.artifacts) && data.artifacts[0]?.base64) return data.artifacts[0].base64; // stability-like
  if (Array.isArray(data?.output) && data.output[0]?.b64_json) return data.output[0].b64_json;
  return null;
}

// Try multiple possible BFL endpoints (their docs vary)
async function tryBflEndpoints(body: Record<string, unknown>) {
  const endpoints = [
    `${BFL_API_URL}/v1/images/generations`,
    `${BFL_API_URL}/v1/images/generate`,
    `${BFL_API_URL}/images/generations`,
  ];
  const errors: string[] = [];
  for (const url of endpoints) {
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${BFL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const txt = await resp.text();
    let json: any = null;
    try { json = JSON.parse(txt); } catch { /* keep txt for diagnostics */ }
    if (resp.ok) {
      const b64 = pickBase64FromAny(json);
      if (!b64) throw new Error(`BFL OK but unexpected shape from ${url}: ${txt.slice(0,300)}...`);
      return { image_base64: b64, raw: json, endpoint: url };
    } else {
      errors.push(`${url} -> ${resp.status} ${txt}`);
    }
  }
  throw new Error(`All BFL endpoints failed:\n${errors.join("\n")}`);
}

async function genWithBFL(prompt: string, size: string, model: string, steps: number, guidance: number, seed?: number) {
  if (!BFL_API_KEY) throw new Error("Missing BFL_API_KEY");
  // Common body fields; adapt if your BFL model requires different keys
  const body = { prompt, model, size, steps, guidance, seed };
  const out = await tryBflEndpoints(body);
  return { provider: "bfl", model, image_base64: out.image_base64 };
}

async function genWithOpenAI(prompt: string, size: string) {
  if (!OPENAI_API_KEY) throw new Error("Missing OPENAI_API_KEY");
  const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
  const res = await openai.images.generate({
    model: "gpt-image-1",
    prompt,
    size, // "512x512" | "768x768" | "1024x1024"
  });
  const b64 = pickBase64FromAny(res);
  if (!b64) throw new Error("OpenAI image: unexpected response shape");
  return { provider: "openai", model: "gpt-image-1", image_base64: b64 };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return new Response("Use POST", { status: 405, headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const {
      prompt,
      orgId = "default-org",
      size = "768x768",
      model = "flux-schnell",
      steps = 20,
      guidance = 3.5,
      seed,
      provider = (Deno.env.get("AI_IMAGE_PROVIDER") ?? "bfl"), // body > env default
      fallback = "none",
    } = body ?? {};

    if (!prompt) {
      return new Response(JSON.stringify({ error: "missing_prompt" }), {
        status: 400, headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    const spent = await getImageSpent(orgId);
    if (spent >= IMAGE_BUDGET) {
      return new Response(JSON.stringify({ error: "budget_exceeded", spent, budget: IMAGE_BUDGET }), {
        status: 429, headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    let out;
    try {
      if (provider === "openai") out = await genWithOpenAI(prompt, size);
      else out = await genWithBFL(prompt, size, model, steps, guidance, seed);
    } catch (primaryErr) {
      console.error("primary provider failed:", primaryErr);
      if (fallback === "openai") {
        try {
          out = await genWithOpenAI(prompt, size);
        } catch (fallbackErr) {
          console.error("fallback provider failed:", fallbackErr);
          return new Response(JSON.stringify({ error: "generation_failed", details: String(fallbackErr) }), {
            status: 502, headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
      } else {
        return new Response(JSON.stringify({ error: "generation_failed", details: String(primaryErr) }), {
          status: 502, headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }
    }

    await logCost(orgId, out.provider, out.model, IMAGE_PRICE_USD);

    return new Response(JSON.stringify({
      provider: out.provider, model: out.model, size, image_base64: out.image_base64
    }), { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } });

  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "internal_error", details: String(err) }), {
      status: 500, headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }
});
