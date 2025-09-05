// ai-image @ v0.4 minimal-openai
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, content-type",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...cors },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") return json({ ok: true }, 200);

  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      // allow empty/malformed to produce a nice error below
      body = {};
    }

    const prompt: string | undefined = body?.prompt;
    const size: string = body?.size || "512x512";

    if (!prompt || typeof prompt !== "string") {
      return json({ error: "bad_request", details: "Field 'prompt' (string) is required." }, 400);
    }

    const apiKey = Deno.env.get("OPENAI_API_KEY");
    const model = Deno.env.get("OPENAI_IMAGE_MODEL") ?? "gpt-image-1";
    if (!apiKey) return json({ error: "config_error", details: "OPENAI_API_KEY not set" }, 500);

    const res = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model, prompt, size }),
    });

    const text = await res.text();

    if (!res.ok) {
      // Bubble up OpenAI’s error payload so we can see exactly why
      let details: unknown = text;
      try { details = JSON.parse(text); } catch { /* keep text */ }
      return json(
        { error: "upstream_error", provider: "openai", status: res.status, details },
        res.status,
      );
    }

    let data: any;
    try {
      data = JSON.parse(text);
    } catch (e) {
      return json({ error: "parse_error", details: String(e), raw: text }, 502);
    }

    const b64 = data?.data?.[0]?.b64_json;
    const url = data?.data?.[0]?.url;

    if (b64) return json({ image_base64: b64 }, 200);
    if (url) return json({ image_url: url }, 200);

    return json({ error: "no_image_in_response", provider: "openai", raw: data }, 502);
  } catch (err) {
    return json({ error: "server_error", details: String(err) }, 500);
  }
});
