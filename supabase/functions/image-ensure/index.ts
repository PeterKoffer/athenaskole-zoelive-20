// @ts-nocheck
// Deno Edge Function: queue image generation (fire-and-forget) using Replicate
// Works with either REPLICATE_VERSION or REPLICATE_MODEL (auto-resolves latest)
function corsHeaders(origin: string | null) {
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, content-type",
  };
}

function env(name: string, required = true) {
  const v = Deno.env.get(name);
  if (!v && required) throw new Error(`Missing env: ${name}`);
  return v ?? "";
}

async function resolveReplicateVersion(token: string): Promise<string> {
  const explicit = Deno.env.get("REPLICATE_VERSION");
  if (explicit) return explicit;

  const model = Deno.env.get("REPLICATE_MODEL");
  if (!model) throw new Error("Set REPLICATE_VERSION or REPLICATE_MODEL");
  const resp = await fetch(`https://api.replicate.com/v1/models/${model}`, {
    headers: { "Authorization": `Token ${token}` },
  });
  if (!resp.ok) throw new Error(`Resolve model failed: ${await resp.text()}`);
  const json = await resp.json();
  const id = json?.latest_version?.id;
  if (!id) throw new Error("No latest_version.id on model");
  return id;
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders(origin) });
  }
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers: corsHeaders(origin) });
  }

  try {
    const {
      universeId,
      universeTitle,
      subject,
      scene = "cover: main activity",
      grade,            // exact grade 1–12
      // optional: extraStyle
    } = await req.json();

    if (!universeId || !universeTitle || !subject) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400, headers: { ...corsHeaders(origin), "content-type": "application/json" }
      });
    }

    // Simple prompt builder (per-grade, not banded)
    const positive = [
      `Illustrate: ${scene}`,
      `Universe: ${universeTitle}`,
      `Subject: ${subject}`,
      grade ? `Audience: Grade ${grade}` : null,
      `Style: clear composition, age-appropriate, no text overlays`,
    ].filter(Boolean).join(" — ");
    const negative = `blurry, watermark, signature, text overlay, misspelled labels, gore, scary imagery`;

    const replicateToken = env("REPLICATE_API_TOKEN");
    const version = await resolveReplicateVersion(replicateToken); // works with MODEL fallback
    const modelSlug = Deno.env.get("REPLICATE_MODEL") || "";       // only used to tweak inputs

    const functionsBase = env("FUNCTIONS_URL");
    const webhookToken  = env("REPLICATE_WEBHOOK_TOKEN");
    const webhook = `${functionsBase}/image-webhook` +
      `?token=${encodeURIComponent(webhookToken)}` +
      `&universeId=${encodeURIComponent(universeId)}` +
      `&grade=${encodeURIComponent(grade ?? "")}` +
      `&variant=cover`;

    // Replicate input shape differences (Flux vs SDXL-ish)
    let input: Record<string, unknown>;
    if (modelSlug.toLowerCase().includes("flux")) {
      input = {
        prompt: `${positive} — Negative: ${negative}`,
        aspect_ratio: "1:1",
        output_format: "webp",
        num_outputs: 1,
        go_fast: true,
      };
    } else {
      input = {
        prompt: positive,
        negative_prompt: negative,
        // most SDXL endpoints accept these defaults; keep it minimal
      };
    }

    const r = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${replicateToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version,
        input,
        webhook,
        webhook_events_filter: ["completed"],
      }),
    });

    const text = await r.text();
    if (!r.ok) {
      return new Response(JSON.stringify({ status: "error", error: text }), {
        status: 500, headers: { ...corsHeaders(origin), "content-type": "application/json" }
      });
    }
    const data = JSON.parse(text);
    return new Response(JSON.stringify({ status: "queued", id: data.id }), {
      status: 202, headers: { ...corsHeaders(origin), "content-type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ status: "error", error: String(e?.message || e) }), {
      status: 500, headers: { ...corsHeaders(origin), "content-type": "application/json" }
    });
  }
});
