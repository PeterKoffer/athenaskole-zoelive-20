// @ts-nocheck
// Deno Edge Function: receives Replicate webhook, writes to Storage (/universe-images/<universeId>/<grade>/cover.webp)
import { createClient } from "jsr:@supabase/supabase-js@2";

const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "POST,OPTIONS",
  "access-control-allow-headers": "authorization,content-type",
};

function env(name: string, required = true) {
  const v = Deno.env.get(name);
  if (!v && required) throw new Error(`Missing env: ${name}`);
  return v ?? "";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405, headers: CORS });

  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");
    if (token !== env("REPLICATE_WEBHOOK_TOKEN")) return new Response("Forbidden", { status: 403, headers: CORS });

    const universeId = url.searchParams.get("universeId") || "";
    const gradeStr   = url.searchParams.get("grade") || "";
    const step       = Math.min(12, Math.max(1, Number(gradeStr) || 7));

    const payload = await req.json(); // Replicate webhook payload
    if (payload?.status !== "succeeded") {
      return new Response("ignored", { status: 200, headers: CORS });
    }
    const first = Array.isArray(payload?.output) ? payload.output[0] : payload?.output;
    if (!first) return new Response("no output", { status: 200, headers: CORS });

    const img = await fetch(first);
    if (!img.ok) return new Response("fetch image failed", { status: 502, headers: CORS });
    const bytes = new Uint8Array(await img.arrayBuffer());

    const supa = createClient(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"));
    const bucket = Deno.env.get("UNIVERSE_IMAGES_BUCKET") || "universe-images";
    const path = `${universeId}/${step}/cover.webp`;

    const up = await supa.storage.from(bucket).upload(path, bytes, {
      contentType: "image/webp",
      upsert: true,
    });
    if (up.error) {
      return new Response(JSON.stringify(up.error), { status: 500, headers: { ...CORS, "content-type": "application/json" } });
    }

    const publicUrl = supa.storage.from(bucket).getPublicUrl(path).data.publicUrl;

    // Optional DB upsert if you have ai_images table (store step as string in grade_band)
    await supa.from("ai_images").upsert({
      universe_id: universeId,
      variant: "cover",
      grade_band: String(step),
      status: "completed",
      storage_path: path,
      public_url: publicUrl,
      updated_at: new Date().toISOString(),
      completed_at: new Date().toISOString(),
    }, { onConflict: "universe_id,variant,grade_band" });

    return new Response(JSON.stringify({ ok: true, url: publicUrl }), { status: 200, headers: { ...CORS, "content-type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ status: "error", error: String(e?.message ?? e) }), { status: 500, headers: { ...CORS, "content-type": "application/json" } });
  }
});