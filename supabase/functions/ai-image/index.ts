// ai-image@v1-openai-only
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...cors },
  });

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  try {
    const body = (await req.json().catch(() => ({}))) as {
      prompt?: string;
      size?: "256x256" | "512x512" | "1024x1024";
      provider?: string; // ignored for now (openai only)
    };

    const prompt = body.prompt;
    const size = body.size ?? "512x512";

    if (!prompt || typeof prompt !== "string") {
      return json({ error: "bad_request", details: "`prompt` (string) is required" }, 400);
    }

    // OPENAI ONLY (for now)
    const apiKey = Deno.env.get("OPENAI_API_KEY");
    const model = Deno.env.get("OPENAI_IMAGE_MODEL") ?? "gpt-image-1";
    if (!apiKey) return json({ error: "missing_secret", details: "OPENAI_API_KEY not set" }, 500);

    const r = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      // NOTE: do NOT send response_format; OpenAI may reject it
      body: JSON.stringify({ model, prompt, size }),
    });

    const text = await r.text();
    let data: any = null;
    try { data = JSON.parse(text); } catch { /* keep raw text */ }

    if (!r.ok) {
      return json(
        { error: "upstream_error", provider: "openai", status: r.status, details: text },
        502,
      );
    }

    const item = data?.data?.[0];
    const b64 = item?.b64_json;
    const url = item?.url;

    if (b64) return json({ image_base64: b64 }, 200);
    if (url) return json({ image_url: url }, 200);

    return json({ error: "unexpected_response", raw: data ?? text }, 502);
  } catch (err) {
    return json({ error: "server_error", details: String(err) }, 500);
  }
});
