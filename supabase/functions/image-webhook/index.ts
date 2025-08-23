// @ts-nocheck
// Deno Edge Function: Replicate webhook → save image to Supabase Storage (per **exact grade**)
import { createClient } from "jsr:@supabase/supabase-js@2";

function env(name: string, required = true) {
  const v = Deno.env.get(name);
  if (!v && required) throw new Error(`Missing env: ${name}`);
  return v ?? "";
}

const supabase = createClient(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"));

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");
    if (token !== env("REPLICATE_WEBHOOK_TOKEN")) return new Response("Forbidden", { status: 403 });

    const universeId = url.searchParams.get("universeId")!;
    const grade      = url.searchParams.get("grade") || "unknown";
    const variant    = url.searchParams.get("variant") || "cover";

    const payload = await req.json(); // Replicate payload
    if (payload.status !== "succeeded") return new Response("Ignored", { status: 200 });

    // Replicate can return a single url or array
    const out = Array.isArray(payload.output) ? payload.output[0] : payload.output;
    if (!out) return new Response("No output", { status: 200 });

    const imgResp = await fetch(out);
    if (!imgResp.ok) return new Response("Fetch image failed", { status: 502 });
    const bytes = new Uint8Array(await imgResp.arrayBuffer());

    const bucket = Deno.env.get("UNIVERSE_IMAGES_BUCKET") || "universe-images";
    const path   = `${universeId}/${grade}/${variant}.webp`; // per-grade path

    const put = await supabase.storage.from(bucket).upload(path, bytes, {
      contentType: "image/webp",
      upsert: true,
    });
    if (put.error) return new Response("Storage error: " + put.error.message, { status: 500 });

    const publicUrl = supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;

    // Optional: upsert tracking row if you have a table
    await supabase.from("ai_images").upsert({
      universe_id: universeId,
      variant,
      grade_band: String(grade), // column name kept for compatibility; now stores exact grade
      status: "completed",
      storage_path: path,
      public_url: publicUrl,
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: "universe_id,variant,grade_band" }).catch(() => {});

    return new Response(JSON.stringify({ ok: true, url: publicUrl }), {
      status: 200, headers: { "content-type": "application/json" }
    });
  } catch (e) {
    return new Response(String(e?.message || e), { status: 500 });
  }
});
