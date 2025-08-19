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

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

  const {
    universeId, universeTitle, subject, scene = "cover: main activity", grade
  } = await req.json() as Body;

  const { prompt, negative, size } = buildPrompt({ universeTitle, subject, scene, grade });

  const replicateToken = env("REPLICATE_API_TOKEN");
  const modelVersion   = await resolveReplicateVersion(replicateToken);
  const functionsBase = env("FUNCTIONS_URL", false) || 
    env("SUPABASE_URL").replace(".supabase.co", ".functions.supabase.co");
  const webhookToken   = env("REPLICATE_WEBHOOK_TOKEN");
  const webhookUrl     = `${functionsBase}/image-webhook?token=${encodeURIComponent(webhookToken)}&universeId=${encodeURIComponent(universeId)}&scene=${encodeURIComponent(scene)}&grade=${grade ?? ""}`;

  // Create prediction via REST (works in Deno)
  const r = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      "Authorization": `Token ${replicateToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version: modelVersion,
      input: { prompt, negative_prompt: negative, size },
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