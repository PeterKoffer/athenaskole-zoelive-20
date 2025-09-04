// supabase/functions/ai-image/index.ts

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY")!;
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const BFL_API_KEY = Deno.env.get("BFL_API_KEY")!;
const BFL_API_URL = Deno.env.get("BFL_API_URL") ?? "https://api.bfl.ai";

const IMAGE_BUDGET = Number(Deno.env.get("AI_IMAGE_BUDGET_USD_MONTHLY") ?? "15");
// Simple fast pris pr. billede – sæt korrekt pris i secrets hvis du vil
const IMAGE_PRICE_USD = Number(Deno.env.get("AI_IMAGE_PRICE_USD") ?? "0.010");

function monthStartISO(d = new Date()) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1)).toISOString();
}

async function getImageSpent(orgId: string): Promise<number> {
  const { data, error } = await supabase
    .from("ai_metrics")
    .select("cost_usd")
    .eq("org_id", orgId)
    .gte("created_at", monthStartISO())
    .eq("provider", "bfl");
  if (error) return 0;
  return (data ?? []).reduce((s, r: any) => s + Number(r.cost_usd || 0), 0);
}

async function logCost(orgId: string, model: string, cost: number, key?: string) {
  const { error } = await supabase.from("ai_metrics").insert({
    org_id: orgId,
    provider: "bfl",
    model,
    tokens: 0,
    cost_usd: cost,
    key: key ?? null,
  });
  if (error) console.error("log cost error", error);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response("Use POST", { status: 405, headers: corsHeaders });
    }

    const body = await req.json().catch(() => ({}));
    const {
      prompt,
      orgId = "default-org",
      size = "768x768", // "512x512" | "768x768" | "1024x1024" (afhængigt af din plan)
      model = "flux-schnell", // Tilpas til BFL-modelnavn du bruger
      steps = 20,
      guidance = 3.5,
      seed,
    } = body ?? {};

    if (!prompt) {
      return new Response(JSON.stringify({ error: "Missing 'prompt'" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Budget
    const spent = await getImageSpent(orgId);
    if (spent >= IMAGE_BUDGET) {
      return new Response(
        JSON.stringify({ error: "Image budget exceeded", spent, budget: IMAGE_BUDGET }),
        { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    // Kald BFL – justér endpoint/payload/response efter din konto/dokumentation
    const resp = await fetch(`${BFL_API_URL}/v1/images/generate`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${BFL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        model,
        size,
        steps,
        guidance,
        seed,
        // evt. andre BFL-felter…
      }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      return new Response(JSON.stringify({ error: "BFL error", details: text }), {
        status: 502,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Forsøg at læse flere mulige formater (tilpas hvis din respons er anderledes)
    const data = await resp.json().catch(() => ({}));
    // eksempler:
    // - { image_base64: "..." }
    // - { images: [{ b64_json: "..." }] }
    let b64 =
      data?.image_base64 ??
      data?.images?.[0]?.b64_json ??
      null;

    if (!b64) {
      return new Response(JSON.stringify({ error: "Unknown BFL response shape", data }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Log fast pris
    await logCost(orgId, model, IMAGE_PRICE_USD);

    return new Response(JSON.stringify({ model, size, image_base64: b64 }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
