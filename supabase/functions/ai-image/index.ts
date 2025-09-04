// supabase/functions/ai-image/index.ts
// Deno Edge Function: vendor-neutral image generation (OpenAI-first)
// CORS + clear errors + optional fallback later.

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...cors } });
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  try {
    const env = (k: string) => Deno.env.get(k)?.trim();
    const DEBUG = env("DEBUG") === "1";

    const {
      prompt,
      size = "512x512",               // e.g. "512x512" | "1024x1024" | "1792x1024"
      provider = env("DEFAULT_IMAGE_PROVIDER") || "openai",
      // NOTE: fallback currently ignored in this minimal, reliable version
    } = await req.json().catch(() => ({}));

    if (!prompt || typeof prompt !== "string") {
      return json({ error: "bad_request", details: "`prompt` is required" }, 400);
    }

    // --- Provider switch (OpenAI only for now) ---
    if (provider !== "openai") {
      // We explicitly fail fast for other providers in this minimal version
      return json({ error: "unsupported_provider", details: `Provider '${provider}' not supported yet.` }, 400);
    }

    const OPENAI_API_KEY = env("OPENAI_API_KEY");
    const OPENAI_IMAGE_MODEL = env("OPENAI_IMAGE_MODEL") || "gpt-image-1";
    if (!OPENAI_API_KEY) {
      return json({ error: "config_error", details: "OPENAI_API_KEY is not set in Supabase secrets." }, 500);
    }

    // OpenAI Images API
    const r = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: OPENAI_IMAGE_MODEL,
        prompt,
        size, // "256x256"|"512x512"|"1024x1024"|"1792x1024" etc.
        response_format: "b64_json",
      }),
    });

    if (!r.ok) {
      const txt = await r.text().catch(() => "");
      return json({
        error: "upstream_error",
        provider: "openai",
        status: r.status,
        details: txt || "No error body",
      }, 502);
    }

    const data = await r.json();
    const b64 = data?.data?.[0]?.b64_json;
    if (!b64) {
      return json({ error: "generation_failed", provider: "openai", details: "Missing b64_json in response." }, 502);
    }

    return json({ image_base64: b64, provider: "openai", model: OPENAI_IMAGE_MODEL });
  } catch (err) {
    return json(
      { error: "server_error", details: String(err?.message || err) },
      500,
    );
  }
});
