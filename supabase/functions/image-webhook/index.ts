// @ts-nocheck
// Deno runtime
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.3";
import { gradeToBand } from "../_shared/prompt.ts";

function env(name: string, required = true) {
  const v = Deno.env.get(name);
  if (!v && required) throw new Error(`Missing env: ${name}`);
  return v ?? "";
}

const supabase = createClient(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"));

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  if (token !== env("REPLICATE_WEBHOOK_TOKEN")) return new Response("Forbidden", { status: 403 });

  const universeId = url.searchParams.get("universeId")!;
  const gradeStr   = url.searchParams.get("grade") ?? undefined;
  const grade      = gradeStr ? Number(gradeStr) : undefined;
  const band       = gradeToBand(grade);

  const payload = await req.json(); // Replicate webhook body
  // Expect payload.status === "succeeded" and payload.output (array of URLs)
  if (payload.status !== "succeeded" || !payload.output || !payload.output.length) {
    return new Response("Ignored", { status: 200 });
  }

  const imageUrl = Array.isArray(payload.output) ? payload.output[0] : payload.output;
  const imgResp = await fetch(imageUrl);
  if (!imgResp.ok) return new Response("Failed to fetch image", { status: 502 });

  const content = new Uint8Array(await imgResp.arrayBuffer());

  const bucket = env("UNIVERSE_IMAGES_BUCKET", /*required*/ false) || "universe-images";
  const path   = `${universeId}/${band.replace(/\s/g,'')}/cover.webp`;

  // Upload / upsert file
  const put = await supabase.storage.from(bucket).upload(path, content, {
    contentType: "image/webp",
    upsert: true,
  });
  if (put.error) return new Response("Storage error: " + put.error.message, { status: 500 });

  const publicUrl = supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;

  // Optional: upsert tracking row (if you have public.ai_images)
  await supabase
    .from("ai_images")
    .upsert({
      universe_id: universeId,
      variant: "cover",
      grade_band: band,
      status: "completed",
      storage_path: path,
      public_url: publicUrl,
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: "universe_id,variant,grade_band" });

  return new Response(JSON.stringify({ ok: true, url: publicUrl }), { status: 200 });
});