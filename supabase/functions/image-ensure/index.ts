// @ts-nocheck
// Deno Edge Function — image-ensure (fire-and-forget queue)
// Handles CORS + supports either REPLICATE_MODEL *or* REPLICATE_VERSION

// Minimal prompt + band helpers
type GradeBand = 'K-2'|'3-5'|'6-8'|'9-10'|'11-12';
function gradeToBand(g?: number): GradeBand {
  if (g == null) return '6-8';
  if (g <= 2) return 'K-2';
  if (g <= 5) return '3-5';
  if (g <= 8) return '6-8';
  if (g <= 10) return '9-10';
  return '11-12';
}

function corsHeaders(origin?: string) {
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

async function replicateCreatePredictionUsingModel(model: string, token: string, body: any) {
  const url = `https://api.replicate.com/v1/models/${model}/predictions`;
  const r = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Token ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!r.ok) {
    return { ok: false as const, text: await r.text() };
  }
  return { ok: true as const, json: await r.json() };
}

async function replicateCreatePredictionUsingVersion(version: string, token: string, body: any) {
  const url = `https://api.replicate.com/v1/predictions`;
  const r = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Token ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ version, ...body }),
  });
  if (!r.ok) {
    return { ok: false as const, text: await r.text() };
  }
  return { ok: true as const, json: await r.json() };
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin") || "*";

  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers: corsHeaders(origin) });
  }

  try {
    const { universeId, universeTitle, subject, grade, scene = "cover: main activity" } = await req.json();

    if (!universeId || !universeTitle || !subject) {
      return new Response(JSON.stringify({ error: "universeId, universeTitle, subject are required" }), {
        status: 400, headers: { ...corsHeaders(origin), "Content-Type": "application/json" }
      });
    }

    const band = gradeToBand(grade);
    const replicateToken = env("REPLICATE_API_TOKEN");
    const functionsBase = env("FUNCTIONS_URL"); // e.g. https://<ref>.functions.supabase.co
    const webhookToken  = env("REPLICATE_WEBHOOK_TOKEN");

    // Build a safe prompt (fold negatives inline; FLUX ignores negative_prompt)
    const prompt = [
      `Illustrate: ${scene}`,
      `Universe: ${universeTitle}`,
      `Subject: ${subject}`,
      `Audience: grade band ${band}`,
      `Style: age-appropriate, clear, no legible text, no watermarks`,
      `Avoid: gore, scary imagery, clutter, watermark, signature, text overlay`
    ].join(" — ");

    // Webhook with minimal context for the writer
    const webhook = `${functionsBase}/image-webhook?token=${
      encodeURIComponent(webhookToken)
    }&universeId=${encodeURIComponent(universeId)}&grade=${encodeURIComponent(grade ?? "")}&scene=${encodeURIComponent(scene)}`;

    // Prepare input for models
    const modelSlug = Deno.env.get("REPLICATE_MODEL") || ""; // e.g. black-forest-labs/flux-schnell
    const versionId = Deno.env.get("REPLICATE_VERSION") || ""; // optional

    // Basic defaults that work for FLUX + SDXL (each will ignore unknowns)
    // FLUX cares about: prompt, aspect_ratio, output_format, output_quality, go_fast, num_outputs
    // SDXL cares about: prompt, negative_prompt (we folded), width/height if you later add them
    const fluxLike = modelSlug.toLowerCase().includes("flux");
    const input: Record<string, unknown> = fluxLike
      ? {
          prompt,
          aspect_ratio: "1:1",
          output_format: "webp",
          output_quality: 80,
          num_outputs: 1,
          go_fast: true,
        }
      : {
          prompt,
          // negative_prompt intentionally folded into prompt
          // SDXL often supports width/height; not required
          num_outputs: 1,
        };

    // Create prediction using either model slug or version id
    let result:
      | { ok: true; json: any }
      | { ok: false; text: string };

    if (modelSlug) {
      result = await replicateCreatePredictionUsingModel(modelSlug, replicateToken, {
        input,
        webhook,
        webhook_events_filter: ["completed"],
      });
    } else if (versionId) {
      result = await replicateCreatePredictionUsingVersion(versionId, replicateToken, {
        input,
        webhook,
        webhook_events_filter: ["completed"],
      });
    } else {
      throw new Error("Set REPLICATE_MODEL or REPLICATE_VERSION in function secrets");
    }

    if (!result.ok) {
      return new Response(JSON.stringify({ status: "error", error: result.text }), {
        status: 500, headers: { ...corsHeaders(origin), "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ status: "queued", id: result.json.id }), {
      status: 202, headers: { ...corsHeaders(origin), "Content-Type": "application/json" }
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ status: "error", error: String(e?.message ?? e) }), {
      status: 500, headers: { ...corsHeaders(origin), "Content-Type": "application/json" }
    });
  }
});