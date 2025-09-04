// supabase/functions/ai-image/index.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import OpenAI from "npm:openai@4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// --- Provider envs ---
const BFL_API_KEY = Deno.env.get("BFL_API_KEY") ?? "";
const BFL_API_URL = Deno.env.get("BFL_API_URL") ?? "https://api.bfl.ai";
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY") ?? "";

// --- Budgeting (logs go to ai_metrics) ---
const IMAGE_BUDGET = Number(Deno.env.get("AI_IMAGE_BUDGET_USD_MONTHLY") ?? "15");
const IMAGE_PRICE_USD = Number(Deno.env.get("AI_IMAGE_PRICE_USD") ?? "0.010"); // flat estimate per image

function monthStartISO(d = new Date()) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1)).toISOString();
}
async function getImageSpent(orgId: string) {
  const { data, error } = await supabase.from("ai_metrics")
    .select("cost_usd")
    .eq("org_id", orgId)
    .gte("created_at", monthStartISO());
  if (error) {
    console.error("getImageSpent error", error);
    return 0;
  }
  return (data ?? []).reduce((s: number, r: any) => s + Number(r.cost_usd || 0), 0);
}
async function logCost(orgId: string, provider: string, model: string, cost: number, key?: string) {
  const { error } = await supabase.from("ai_metrics").insert({
    org_id: orgId, provider, model, tokens: 0, cost_usd: cost, key: key ?? null
  });
  if (error) console.error("logCost error", error);
}

// --- Helpers to normalize various API shapes to base64 ---
function pickBase64FromAny(data: any): string | null {
  // BFL common shapes
  if (typeof data?.image_base64 === "string") return data.image_base64;
  if (Array.isArray(data?.images) && data.images[0]?.b64_json) return data.images[0].b64_json;
  // OpenAI Images v1
  if (Array.isArray(data?.data) && data.data[0]?.b64_json) return data.data[0].b64_json;
  // Stability-like
  if (Array.isArray(data?.artifacts) && data.artifacts[0]?.base64) return data.artifacts[0].base64;
  // Some providers put under output
  if (Array.isArray(data?.output) && data.output[0]?.b64_json) return data.output[0].b64_json;
  return null;
}

// --- Providers ---
async function genWithBFL(opts: {
  prompt: string;
  model: string;
  size: string;
  steps: number;
  guidance: number;
  seed?: number;
}) {
  if (!BFL_API_KEY) throw new Error("Missing BFL_API_KEY");
  const resp = await fetch(`${BFL_API_URL}/v1/images/generate`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${BFL_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(opts),
  });
  const text = await resp.text();
  let json: any = null;
  try { json = JSON.parse(text); } catch { /* keep text */ }

  if (!resp.ok) {
    throw new Error(`BFL ${resp.status}: ${text}`);
  }
  const b64 = pickBase64FromAny(json);
  if (!b64) throw new Error(`BFL returned unexpected shape: ${text.slice(0, 300)}...`);
  return { provider: "bfl", model: opts.model, image_base64: b64, raw: json };
}

async function genWithOpenAI(prompt: string, size: string) {
  if (!OPENAI_API_KEY) throw new Error("Missing OPENAI_API_KEY");
  const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
  // OpenAI Images API
  const res = await openai.images.generate({
    model: "gpt-image-1",
    prompt,
    size, // e.g. "512x512", "768x768", "1024x1024"
    // You can add: quality: "high", background: "transparent"
  });
  const b64 = pickBase64FromAny(res);
  if (!b64) throw new Error(`OpenAI image response unexpected shape`);
  return { provider: "openai", model: "gpt-image-1", image_base64: b64, raw: res };
}

// --- HTTP ---
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return new Response("Use POST", { status: 405, headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const {
      prompt,
      orgId = "default-org",
      size = "768x768",
      model = "flux-schnell",    // for BFL
      steps = 20,
      guidance = 3.5,
      seed,
      provider = Deno.env.get("AI_IMAGE_PROVIDER") ?? "bfl", // "bfl" | "openai"
      fallback = "none",           // "none" | "openai"
    } = body ?? {};

    if (!prompt) {
      return new Response(JSON.stringify({ error: "Missing 'prompt'" }), {
        status: 400, headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    // Budget guard
    const spent = await getImageSpent(orgId);
    if (spent >= IMAGE_BUDGET) {
      return new Response(JSON.stringify({ error: "Image budget exceeded", spent, budget: IMAGE_BUDGET }), {
        status: 429, headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    // Try chosen provider
    let out;
    try {
      if (provider === "openai") {
        out = await genWithOpenAI(prompt, size);
      } else { // default to BFL
        out = await genWithBFL({ prompt, model, size, steps, guidance, seed });
      }
    } catch (err) {
      console.error("Primary provider failed:", err);
      if (fallback === "openai") {
        try {
          out = await genWithOpenAI(prompt, size);
        } catch (err2) {
          console.error("Fallback provider failed:", err2);
          return new Response(JSON.stringify({ error: "Image generation failed", details: String(err2) }), {
            status: 502, headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
      } else {
        return new Response(JSON.stringify({ error: "Image generation failed", details: String(err) }), {
          status: 502, headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }
    }

    // Log flat cost
    await logCost(orgId, out.provider, out.model, IMAGE_PRICE_USD);

    return new Response(JSON.stringify({
      provider: out.provider,
      model: out.model,
      size,
      image_base64: out.image_base64
    }), { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } });

  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Internal error", details: String(err) }), {
      status: 500, headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }
});
