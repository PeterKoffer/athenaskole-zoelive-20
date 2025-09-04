// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: any, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    let payload: any = {};
    try {
      payload = await req.json();
    } catch {
      return json({ error: "bad_request", message: "JSON body required" }, 400);
    }

    const prompt = payload.prompt;
    const size = typeof payload.size === "string" ? payload.size : "512x512";

    if (!prompt || typeof prompt !== "string") {
      return json({ error: "bad_request", message: "`prompt` is required" }, 400);
    }

    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    const OPENAI_IMAGE_MODEL = Deno.env.get("OPENAI_IMAGE_MODEL") ?? "gpt-image-1";

    if (!OPENAI_API_KEY) {
      console.error("Missing OPENAI_API_KEY secret");
      return json({ error: "config_error", message: "OPENAI_API_KEY not set" }, 500);
    }

    // OpenAI Images API (returns base64 in data[0].b64_json)
    const res = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: OPENAI_IMAGE_MODEL,
        prompt,
        size, // e.g. 256x256, 512x512, 1024x1024
      }),
    });

    if (!res.ok) {
      const txt = await res.text();
      console.error("OpenAI images error", res.status, txt);
      return json({ error: "openai_error", status: res.status, details: txt }, 502);
    }

    const data = await res.json();
    const b64 = data?.data?.[0]?.b64_json;
    if (!b64) {
      console.error("OpenAI images: no b64_json in response", data);
      return json({ error: "no_image_returned" }, 502);
    }

    return json({ image_base64: b64 }, 200);
  } catch (err) {
    console.error("ai-image: server error", err);
    return json({ error: "server_error", details: String(err) }, 500);
  }
});
