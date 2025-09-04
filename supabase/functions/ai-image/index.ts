// supabase/functions/ai-image/index.ts
// deno-lint-ignore-file no-explicit-any
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const {
      prompt,
      size = "1024x1024",
      aspect_ratio,
      provider,        // "bfl" | "openai"
      fallback,        // "bfl" | "openai"
      // orgId,         // optional metadata
    } = body || {};

    if (!prompt) return json({ error: "Missing 'prompt'" }, 400);

    const prefer = (provider ?? "bfl").toLowerCase();
    const fb = (fallback ?? "").toLowerCase();

    const tryOpenAI = async () => {
      const key = Deno.env.get("OPENAI_API_KEY");
      const model = Deno.env.get("OPENAI_IMAGE_MODEL") || "gpt-image-1";
      if (!key) throw new Error("OPENAI_API_KEY not set");

      const payload: Record<string, any> = { model, prompt };
      if (size) payload.size = size;

      const res = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(`OpenAI ${res.status}: ${JSON.stringify(data)}`);

      const b64 =
        data?.data?.[0]?.b64_json ??
        data?.data?.[0]?.image_base64;

      if (!b64) throw new Error("OpenAI returned no image content");
      return { image_base64: b64, provider: "openai" };
    };

    const tryBFL = async () => {
      const base = (Deno.env.get("BFL_API_URL") || "https://api.bfl.ai").replace(/\/+$/, "");
      const key = Deno.env.get("BFL_API_KEY");
      const model = Deno.env.get("BFL_MODEL") || "flux-pro-1.1";
      if (!key) throw new Error("BFL_API_KEY not set");

      const override = Deno.env.get("BFL_IMAGE_ENDPOINT"); // e.g. /v1/images/generations
      const endpoints = [
        override && `${base}${override}`,
        `${base}/v1/images/generations`,
        `${base}/v1/images/generate`,
        `${base}/images/generations`,
      ].filter(Boolean) as string[];

      const payload: Record<string, any> = { prompt, model };
      if (size) payload.size = size;
      if (aspect_ratio) payload.aspect_ratio = aspect_ratio;

      // Some BFL deployments use x-key, some Bearer
      const headerVariants: Record<string, string>[] = [
        { "x-key": key, "Content-Type": "application/json" },
        { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
      ];

      let lastErr: any = null;

      for (const url of endpoints) {
        for (const headers of headerVariants) {
          const resp = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(payload),
          });

          const text = await resp.text();
          let data: any = null;
          try { data = JSON.parse(text); } catch { /* ignore non-JSON */ }

          if (!resp.ok) {
            lastErr = new Error(`BFL ${resp.status} ${url}: ${text}`);
            continue;
          }

          // Try common shapes
          const b64 =
            data?.image_base64 ??
            data?.data?.[0]?.b64_json ??
            data?.images?.[0]?.b64_json ??
            data?.artifacts?.[0]?.base64 ??
            data?.output?.[0];

          if (!b64) {
            lastErr = new Error(`BFL ok but unknown schema from ${url}: ${text?.slice(0, 200)}...`);
            continue;
          }
          return { image_base64: b64, provider: "bfl", endpoint: url };
        }
      }
      throw lastErr || new Error("BFL request failed");
    };

    // Decide order
    const order = prefer === "openai" ? [tryOpenAI, tryBFL] : [tryBFL, tryOpenAI];

    // Try primary
    try {
      const out = await order[0]();
      return json(out, 200);
    } catch (e1: any) {
      // Try fallback if allowed/available
      const allowFallback =
        (prefer !== "openai" && fb === "openai") ||
        (prefer !== "bfl" && fb === "bfl") ||
        (prefer === "bfl" && !fb && Deno.env.get("OPENAI_API_KEY")); // implicit fallback to OpenAI if configured

      if (allowFallback) {
        try {
          const out2 = await order[1]();
          return json(out2, 200);
        } catch (e2: any) {
          return json({ error: "Both providers failed", primary: String(e1), fallback: String(e2) }, 502);
        }
      }
      const label = prefer === "openai" ? "OpenAI" : "BFL";
      return json({ error: `${label} error`, details: String(e1) }, 502);
    }
  } catch (err: any) {
    return json({ error: "bad request", details: String(err) }, 400);
  }
});

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: corsHeaders });
}
