// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

// Ens CORS-opsætning med Supabase-klientens preflight headers
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, content-type, apikey, x-client-info, x-supabase-authorization",
  "Content-Type": "application/json",
} as const;

const json = (obj: unknown, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: CORS });

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")! // skal være SERVICE ROLE
);

function b64ToBytes(b64: string) {
  const bin = atob(b64);
  const u8 = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
  return u8;
}

// 1×1 PNG (grå) – bruges til at teste Storage write uden OpenAI
const ONE_PIXEL_PNG =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAoMBgD5VtDsAAAAASUVORK5CYII=";

serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response(null, {
      headers: CORS,
    });

  const started = Date.now();
  const env = {
    has_OPENAI_API_KEY: !!Deno.env.get("OPENAI_API_KEY"),
    has_SUPABASE_URL: !!Deno.env.get("SUPABASE_URL"),
    has_SERVICE_ROLE: !!Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
  };

  // A) Test: Storage write
  let storageOk = false,
    storageUrl = "",
    storageReason = "";
  try {
    const key = `diag/${crypto.randomUUID()}.png`;
    const up = await supabase.storage
      .from("universe-images")
      .upload(key, b64ToBytes(ONE_PIXEL_PNG), {
        contentType: "image/png",
        upsert: true,
        cacheControl: "60",
      });
    if (up.error) throw up.error;
    const base = Deno.env.get("SUPABASE_URL")!.replace(/^https?:\/\//, "");
    storageUrl = `https://${base}/storage/v1/object/public/universe-images/${key}`;
    storageOk = true;
  } catch (e: any) {
    storageReason = e?.message ?? String(e);
  }

  // B) Test: DB write (universe_images)
  let dbOk = false,
    dbReason = "";
  try {
    const ins = await supabase
      .from("universe_images")
      .upsert(
        {
          universe_id: "diag-smoke",
          lang: "en",
          image_url: storageUrl || "diag://none",
          source: storageOk ? "manual" : "fallback",
        },
        { onConflict: "universe_id,lang" }
      )
      .select()
      .single();
    if (ins.error) throw ins.error;
    dbOk = true;
  } catch (e: any) {
    dbReason = e?.message ?? String(e);
  }

  // C) Test: OpenAI image call (billig/mini)
  let openaiOk = false,
    openaiReason = "",
    openaiTookMs = 0;
  if (env.has_OPENAI_API_KEY) {
    try {
      const t0 = Date.now();
      // Lille call – 256x256 – beviser quota/auth/parametre
      const resp = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "gpt-image-1",
          prompt: "A tiny test icon, flat minimal, gray square",
          size: "256x256",
          n: 1
        }),
      });
      
      openaiTookMs = Date.now() - t0;
      
      if (!resp.ok) {
        const errorData = await resp.text();
        throw new Error(`OpenAI API error: ${resp.status} ${errorData}`);
      }
      
      const data = await resp.json();
      // Check that the response contains image data (gpt-image-1 returns b64_json by default)
      if (!data?.data?.[0]?.b64_json) throw new Error("No b64_json in response");
      openaiOk = true;
    } catch (e: any) {
      openaiReason = e?.message ?? String(e);
    }
  } else {
    openaiReason = "OPENAI_API_KEY missing";
  }

  const durationMs = Date.now() - started;
  return json({
    env,
    checks: {
      storage:  { ok: storageOk, url: storageUrl, reason: storageReason },
      database: { ok: dbOk,      reason: dbReason },
      openai:   { ok: openaiOk,  took_ms: openaiTookMs, reason: openaiReason },
    },
    duration_ms: durationMs,
  });
});