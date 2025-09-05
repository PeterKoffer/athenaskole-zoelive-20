import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: cors });
}

const ALLOWED_SIZES = new Set(["1024x1024", "1024x1536", "1536x1024", "auto"]);

function mapAspectRatioToSize(ar?: string): string | undefined {
  if (!ar) return undefined;
  const v = String(ar).trim();
  if (v === "1:1") return "1024x1024";
  if (v === "16:9" || v === "3:2") return "1536x1024"; // wide
  if (v === "9:16" || v === "2:3") return "1024x1536"; // tall
  return undefined;
}

function normalizeSize(input?: string, aspectRatio?: string): string {
  const s = (input ?? "").trim().toLowerCase();

  // Already valid?
  if (ALLOWED_SIZES.has(s)) return s;

  // Legacy values → 1024x1024
  if (["256x256", "512x512", "640x640", "768x768"].includes(s)) {
    return "1024x1024";
  }

  // Try aspect ratio mapping
  const byAr = mapAspectRatioToSize(aspectRatio);
  if (byAr) return byAr;

  // Default
  return "1024x1024";
}

serve(async (req) => {
  try {
    if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
    if (req.method === "GET") {
      return json({ ok: true, service: "ai-image", provider: "openai", version: "v1.1-size-normalizer" });
    }

    let body: any = {};
    try { body = await req.json(); } catch {}

    const prompt: string | undefined = body?.prompt;
    const aspect_ratio: string | undefined = body?.aspect_ratio;
    const size = normalizeSize(body?.size, aspect_ratio);

    if (typeof prompt !== "string" || prompt.trim().length === 0) {
      return json({ error: "bad_request", details: "`prompt` (string) is required" }, 400);
    }

    const apiKey = Deno.env.get("OPENAI_API_KEY");
    const model = Deno.env.get("OPENAI_IMAGE_MODEL") ?? "gpt-image-1";
    if (!apiKey) return json({ error: "missing_secret", details: "OPENAI_API_KEY not set" }, 500);

    console.log("ai-image → openai request", { model, size }); // 👈 see logs

    const resp = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model, prompt, size }),
    });

    const raw = await resp.text();
    let data: any = null;
    try { data = JSON.parse(raw); } catch {}

    if (!resp.ok) {
      console.error("ai-image upstream_error", resp.status, raw);
      return json({ error: "upstream_error", provider: "openai", status: resp.status, details: raw }, 502);
    }

    const item = data?.data?.[0];
    const b64 = item?.b64_json;
    const url = item?.url;

    if (typeof b64 === "string" && b64.length > 0) return json({ image_base64: b64 }, 200);
    if (typeof url === "string" && url.length > 0) return json({ image_url: url }, 200);

    console.error("ai-image unexpected_response", data ?? raw);
    return json({ error: "unexpected_response", raw: data ?? raw }, 502);
  } catch (err) {
    console.error("ai-image server_error", err);
    return json({ error: "server_error", details: String(err) }, 500);
  }
});
