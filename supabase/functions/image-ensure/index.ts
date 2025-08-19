// Deno runtime, no Node SDKs
import { buildPrompt } from "../_shared/prompt.ts";

type Body = {
  universeId: string;
  universeSlug?: string;
  universeTitle: string;
  subject: string;
  scene?: string;   // default "cover scene"
  grade?: number;
};

function env(name: string, required = true) {
  const v = Deno.env.get(name);
  if (!v && required) throw new Error(`Missing env: ${name}`);
  return v ?? "";
}

async function resolveReplicateVersion(token: string) {
  const model = Deno.env.get("REPLICATE_MODEL");   // e.g. "black-forest-labs/flux-dev"
  const version = Deno.env.get("REPLICATE_VERSION");
  if (version) return version; // prefer explicit

  if (!model) throw new Error("Missing REPLICATE_VERSION or REPLICATE_MODEL");

  // fetch latest version for the model
  const resp = await fetch(`https://api.replicate.com/v1/models/${model}`, {
    headers: { Authorization: `Token ${token}` }
  });
  if (!resp.ok) throw new Error(`Failed to resolve model: ${await resp.text()}`);
  const json = await resp.json();
  const latest = json?.latest_version?.id;
  if (!latest) throw new Error("No latest_version on model");
  return latest;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

  const {
    universeId, universeTitle, subject, scene = "cover: main activity", grade
  } = await req.json() as Body;

  const { prompt, negative, size } = buildPrompt({ universeTitle, subject, scene, grade });

  const replicateToken = env("REPLICATE_API_TOKEN");
  const modelSlug = env("REPLICATE_MODEL", false);
  const modelVersion = await resolveReplicateVersion(replicateToken);
  const functionsBase = env("FUNCTIONS_URL", false) || 
    env("SUPABASE_URL").replace(".supabase.co", ".functions.supabase.co");
  const webhookToken = env("REPLICATE_WEBHOOK_TOKEN");
  const webhookUrl = `${functionsBase}/image-webhook?token=${encodeURIComponent(webhookToken)}&universeId=${encodeURIComponent(universeId)}&scene=${encodeURIComponent(scene)}&grade=${grade ?? ""}`;

  // Build model-specific input based on model type
  let input: Record<string, unknown>;

  if (modelSlug?.includes("flux")) {
    // FLUX models: no negative_prompt, use aspect_ratio and output_format
    input = {
      prompt: `${prompt} — Avoid: ${negative}`,
      aspect_ratio: "1:1",
      output_format: "webp",
      output_quality: 80,
      go_fast: true,
      num_outputs: 1,
    };
  } else if (modelSlug?.includes("sdxl") || modelSlug?.includes("stability-ai/sdxl")) {
    // SDXL models: use negative_prompt and width/height
    const [w, h] = (size ?? "1024x1024").split("x").map((n) => Number(n));
    input = {
      prompt,
      negative_prompt: negative,
      width: w,
      height: h,
      output_format: "webp",
    };
  } else {
    // Safe generic fallback: send only the prompt
    input = { prompt };
  }

  // Create prediction via REST (works in Deno)
  const r = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      "Authorization": `Token ${replicateToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version: modelVersion,
      input,
      webhook: webhookUrl,
      webhook_events_filter: ["completed"],
    }),
  });

  if (!r.ok) {
    const err = await r.text();
    return new Response(JSON.stringify({ status: "error", error: err }), { status: 500 });
  }

  const data = await r.json();
  return new Response(JSON.stringify({ status: "queued", id: data.id }), { status: 202 });
});