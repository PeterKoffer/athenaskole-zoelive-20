// @ts-nocheck
// Deno Edge Function — image-webhook
// Saves Replicate output into Supabase Storage at:
//   universe-images/<universeId>/<band>/cover.webp

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.3";

type GradeBand = 'K-2'|'3-5'|'6-8'|'9-10'|'11-12';
function gradeToBand(g?: number): GradeBand {
  if (g == null) return '6-8';
  if (g <= 2) return 'K-2';
  if (g <= 5) return '3-5';
  if (g <= 8) return '6-8';
  if (g <= 10) return '9-10';
  return '11-12';
}

function env(name: string, required = true) {
  const v = Deno.env.get(name);
  if (!v && required) throw new Error(`Missing env: ${name}`);
  return v ?? "";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, content-type", "Access-Control-Allow-Methods": "POST, OPTIONS" } });
  }
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");
    if (token !== env("REPLICATE_WEBHOOK_TOKEN")) return new Response("Forbidden", { status: 403 });

    const universeId = url.searchParams.get("universeId")!;
    const scene = url.searchParams.get("scene") ?? "cover: main activity";
    const gradeStr = url.searchParams.get("grade") ?? undefined;
    const grade = gradeStr ? Number(gradeStr) : undefined;
    const band = gradeToBand(grade);

    const payload = await req.json();
    if (payload?.status !== "succeeded") {
      return new Response(JSON.stringify({ ok: true, ignored: true }), { status: 200 });
    }

    const output = Array.isArray(payload.output) ? payload.output[0] : payload.output;
    if (!output || typeof output !== "string") {
      return new Response(JSON.stringify({ ok: false, error: "No image URL in webhook payload" }), { status: 400 });
    }

    const img = await fetch(output);
    if (!img.ok) return new Response("Failed to fetch output image", { status: 502 });
    const bytes = new Uint8Array(await img.arrayBuffer());

    const supabase = createClient(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"));
    const bucket = Deno.env.get("UNIVERSE_IMAGES_BUCKET") || "universe-images";
    const path = `${universeId}/${band}/cover.webp`;

    // Upload (upsert)
    const put = await supabase.storage.from(bucket).upload(path, bytes, {
      contentType: "image/webp",
      upsert: true,
    });
    if (put.error) {
      return new Response(JSON.stringify({ ok: false, error: put.error.message }), { status: 500 });
    }

    const publicUrl = supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;

    // Optional: if you have ai_images table, you can upsert here.

    return new Response(JSON.stringify({ ok: true, path, url: publicUrl, scene }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: String(e?.message ?? e) }), {
      status: 500, headers: { "Content-Type": "application/json" }
    });
  }
});