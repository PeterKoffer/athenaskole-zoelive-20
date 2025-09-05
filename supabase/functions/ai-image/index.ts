// supabase/functions/ai-image/index.ts
// Minimal, reliable OpenAI-only generator with clear version + errors.
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const VERSION = "ai-image@v0.3-openai-only";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...cors },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  try {
    const env = (k: string) => Deno.env.get(k)?.trim();
    const {
      prompt,
      size = "512x512",
      provider = env("DEFAULT_IMAGE_PROVIDER") || "openai",
    } = await req.json().catch(() => ({}));

    if (!prompt || typeof prompt !== "string") {
      return json(
        { error: "bad_request", details: "`prompt` is required", version: VERSION },
        400
      );
    }

    // OpenAI only for now: fail fast on anything else so we can detect the new code.
    if (provider !== "openai") {
      return json(
        { error: "unsupported_provider", provider, version: VERSION },
        400
      );
    }

    const OPENAI_API_KEY = env("OPENAI_API_KEY");
    const OPENAI_IMAGE_MODEL = env("OPENAI_IMAGE_MODEL") || "gpt-image-1";
    if (!OPENAI_API_KEY) {
      return json(
        { error: "config_error", details: "OPENAI_API_KEY missing", version: VERSION },
        500
      );
    }

    const r = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: OPENAI_IMAGE_MODEL,
        prompt,
        size,
        response_format: "b64_json",
      }),
    });

    if (!r.ok) {
      const txt = await r.text().catch(() => "");
      return json(
        {
          error: "upstream_error",
          provider: "openai",
          status: r.status,
          details: txt || "No error body",
          version: VERSION,
        },
        502
      );
    }

    const data = await r.json();
    const b64 = data?.data?.[0]?.b64_json;
    if (!b64) {
      return json(
        { error: "generation_failed", provider: "openai", version: VERSION },
        502
      );
    }

    return json({ image_base64: b64, provider: "openai", model: OPENAI_IMAGE_MODEL, version: VERSION }, 200);
  } catch (err) {
    return json(
      { error: "server_error", details: String((err as any)?.message || err), version: VERSION },
      500
    );
  }
});
