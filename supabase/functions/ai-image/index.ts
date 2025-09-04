// supabase/functions/ai-image/index.ts
// Deno / Supabase Edge Function – BFL first, OpenAI fallback.

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

type ReqBody = {
  prompt: string;
  orgId?: string;
  provider?: "bfl" | "openai";
  fallback?: "openai";
  aspect_ratio?: "1:1" | "16:9" | "9:16" | "4:3" | "3:4";
  // (optional) pass-thru for future providers
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function toBase64(u8: Uint8Array) {
  // Safe base64 from bytes
  let bin = "";
  for (let i = 0; i < u8.length; i++) bin += String.fromCharCode(u8[i]);
  return btoa(bin);
}

// ---------- BFL ----------
async function generateWithBFL(prompt: string, aspect_ratio?: ReqBody["aspect_ratio"]) {
  const base = Deno.env.get("BFL_API_URL") || "https://api.bfl.ai";
  const model = Deno.env.get("BFL_MODEL") || "flux-pro-1.1";
  const apiKey = Deno.env.get("BFL_API_KEY");
  if (!apiKey) throw new Error("Missing BFL_API_KEY");

  // 1) submit job
  const submit = await fetch(`${base}/v1/${model}`, {
    method: "POST",
    headers: {
      "accept": "application/json",
      "x-key": apiKey, // BFL uses x-key, not Authorization
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      ...(aspect_ratio ? { aspect_ratio } : {}),
    }),
  });

  if (!submit.ok) {
    const details = await submit.text();
    throw new Error(`BFL submit failed: ${submit.status} ${details}`);
  }
  const submitted = await submit.json() as { id: string; polling_url: string };

  // 2) poll using polling_url
  const start = Date.now();
  while (true) {
    await new Promise(r => setTimeout(r, 500));
    const poll = await fetch(submitted.polling_url, {
      headers: { "accept": "application/json", "x-key": apiKey },
    });
    if (!poll.ok) {
      const details = await poll.text();
      throw new Error(`BFL poll failed: ${poll.status} ${details}`);
    }
    const data = await poll.json() as any;
    if (data.status === "Ready") {
      const sampleUrl: string | undefined = data?.result?.sample;
      if (!sampleUrl) throw new Error("BFL: Ready but no result.sample URL");
      // 3) download binary (delivery URLs expire in ~10 minutes)
      const imgRes = await fetch(sampleUrl);
      if (!imgRes.ok) throw new Error(`BFL image download failed: ${imgRes.status}`);
      const buf = new Uint8Array(await imgRes.arrayBuffer());
      return {
        provider: "bfl",
        model,
        delivery_url: sampleUrl,
        image_base64: toBase64(buf),
      };
    }
    if (data.status === "Error" || data.status === "Failed") {
      throw new Error(`BFL generation error: ${JSON.stringify(data)}`);
    }
    // safety: stop after ~60s
    if (Date.now() - start > 60_000) throw new Error("BFL timeout");
  }
}

// ---------- OpenAI fallback ----------
async function generateWithOpenAI(prompt: string) {
  const url = Deno.env.get("OPENAI_BASE_URL")?.replace(/\/+$/, "") || "https://api.openai.com";
  const key = Deno.env.get("OPENAI_API_KEY");
  const model = Deno.env.get("OPENAI_IMAGE_MODEL") || "gpt-image-1";
  if (!key) throw new Error("Missing OPENAI_API_KEY");

  const res = await fetch(`${url}/v1/images/generations`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${key}` },
    body: JSON.stringify({ model, prompt, size: "1024x1024" }),
  });
  if (!res.ok) {
    const details = await res.text();
    throw new Error(`OpenAI image error: ${res.status} ${details}`);
  }
  const json = await res.json();
  const b64 = json?.data?.[0]?.b64_json;
  if (!b64) throw new Error("OpenAI: no image returned");
  return { provider: "openai", model, image_base64: b64 };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = (await req.json()) as ReqBody;
    if (!body?.prompt) {
      return new Response(JSON.stringify({ error: "Missing 'prompt'" }), {
        status: 400, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const useProvider = body.provider || "bfl";
    try {
      const result = useProvider === "openai"
        ? await generateWithOpenAI(body.prompt)
        : await generateWithBFL(body.prompt, body.aspect_ratio);
      return new Response(JSON.stringify(result), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    } catch (e) {
      if (body.fallback === "openai") {
        const fb = await generateWithOpenAI(body.prompt);
        return new Response(JSON.stringify({ ...fb, note: "BFL failed, used OpenAI fallback" }), {
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
      throw e;
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500, headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
