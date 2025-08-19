// @ts-nocheck
// Deno Edge Function: queue image generation (per-grade), fire-and-forget
const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "POST,OPTIONS",
  "access-control-allow-headers": "authorization,content-type",
};

function env(name: string, required = true) {
  const v = Deno.env.get(name);
  if (!v && required) throw new Error(`Missing env: ${name}`);
  return v ?? "";
}

// Resolve a Replicate version: prefer REPLICATE_VERSION, else fetch latest from REPLICATE_MODEL
async function resolveReplicateVersion(token: string) {
  const explicit = Deno.env.get("REPLICATE_VERSION");
  if (explicit) return explicit;
  const model = Deno.env.get("REPLICATE_MODEL");
  if (!model) throw new Error("Set REPLICATE_MODEL or REPLICATE_VERSION");

  const r = await fetch(`https://api.replicate.com/v1/models/${model}`, {
    headers: { Authorization: `Token ${token}` },
  });
  if (!r.ok) throw new Error(`Failed to fetch model: ${await r.text()}`);
  const j = await r.json();
  const id = j?.latest_version?.id;
  if (!id) throw new Error("Model has no latest_version.id");
  return id;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405, headers: CORS });

  try {
    const { universeId, universeTitle, subject, scene = "cover: main activity", grade } = await req.json();

    if (!universeId || !universeTitle || !subject) {
      return new Response(JSON.stringify({ error: "universeId, universeTitle, subject are required" }), { status: 400, headers: { ...CORS, "content-type": "application/json" } });
    }

    const step = Math.min(12, Math.max(1, Number.isFinite(Number(grade)) ? Number(grade) : 7));

    const functionsBase = env("FUNCTIONS_URL");
    const webhookToken  = env("REPLICATE_WEBHOOK_TOKEN");
    const replicateTok  = env("REPLICATE_API_TOKEN");
    const modelSlug     = Deno.env.get("REPLICATE_MODEL") || "";
    const version       = await resolveReplicateVersion(replicateTok);

    // Build a simple, safe prompt (no separate negative_prompt; fold negatives inline for max compatibility)
    const prompt = [
      `Illustrate: ${scene}`,
      `Universe: ${universeTitle}`,
      `Subject: ${subject}`,
      `Audience: Grade ${step}`,
      `Style: age-appropriate, clean composition, no legible text overlays`,
      `Avoid: watermarks, signatures, misspelled labels, deformed anatomy`,
    ].join(" — ");

    // FLUX models have different input knobs; default path just uses "prompt"
    const isFlux = modelSlug.toLowerCase().includes("flux");
    const input = isFlux
      ? {
          prompt,
          aspect_ratio: "1:1",
          output_format: "webp",
          go_fast: true,
          num_outputs: 1,
        }
      : { prompt };

    const webhook = `${functionsBase}/image-webhook?token=${encodeURIComponent(webhookToken)}&universeId=${encodeURIComponent(universeId)}&grade=${step}&scene=${encodeURIComponent(scene)}`;

    const resp = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${replicateTok}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version,
        input,
        webhook,
        webhook_events_filter: ["completed"],
      }),
    });

    if (!resp.ok) {
      const err = await resp.text();
      return new Response(JSON.stringify({ status: "error", error: err }), { status: 500, headers: { ...CORS, "content-type": "application/json" } });
    }

    const data = await resp.json();
    return new Response(JSON.stringify({ status: "queued", id: data.id }), { status: 202, headers: { ...CORS, "content-type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ status: "error", error: String(e?.message ?? e) }), { status: 500, headers: { ...CORS, "content-type": "application/json" } });
  }
});