cat > supabase/functions/image-service/index.ts <<'TS'
// supabase/functions/image-service/index.ts
import { bad, ok, handleOptions } from "../_shared/http.ts";
import { bflGenerateImage } from "../_shared/imageProviders.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 64);
}

Deno.serve(async (req) => {
  const pre = handleOptions(req);
  if (pre) return pre;
  if (req.method !== "POST") return bad("Method not allowed", 405);

  let body: any;
  try { body = await req.json(); } catch { return bad("Invalid JSON body"); }

  const prompt = String(body.prompt ?? body.title ?? "Untitled");
  const width = Number(body.width ?? 1024);
  const height = Number(body.height ?? 576);
  const universeId = String(body.universeId ?? "fallback");

  // ---- ENV ----
  const bflKey = Deno.env.get("BFL_API_KEY");
  if (!bflKey) return bad("Missing BFL_API_KEY", 500);

  const bucket = Deno.env.get("UNIVERSE_IMAGES_BUCKET") ?? "universe-images";
  const serviceRole = Deno.env.get("SERVICE_ROLE_KEY");
  if (!serviceRole) return bad("Missing SERVICE_ROLE_KEY", 500);

  // Local dev fallback for URL
  const SUPABASE_URL =
    Deno.env.get("SUPABASE_URL") ??
    Deno.env.get("URL") ??
    "http://127.0.0.1:54321";

  const supabase = createClient(SUPABASE_URL, serviceRole, {
    global: { headers: { "x-client-info": "edge:image-service" } },
  });

  try {
    // 1) Generate with BFL
    const { url: bflUrl } = await bflGenerateImage({ prompt, width, height, apiKey: bflKey });

    // 2) Download image bytes
    const res = await fetch(bflUrl);
    if (!res.ok) return bad(`Failed to download BFL image (${res.status})`, 502);
    const contentType = res.headers.get("content-type") ?? "image/jpeg";
    const ext = contentType.includes("png") ? "png" : contentType.includes("webp") ? "webp" : "jpg";
    const bytes = new Uint8Array(await res.arrayBuffer());

    // 3) Upload to Storage
    const path = `${universeId}/${Date.now()}-${slug(prompt)}.${ext}`;
    const up = await supabase.storage.from(bucket).upload(path, bytes, {
      contentType,
      upsert: true,
    });
    if (up.error) return bad(`Storage upload failed: ${up.error.message}`, 502);

    const pub = supabase.storage.from(bucket).getPublicUrl(path);

    return ok({
      impl: "bfl-upload-v1",
      width, height,
      bflUrl,           // original (debug)
      bucket, path,
      publicUrl: pub.data.publicUrl,
    });
  } catch (e) {
    return bad(e instanceof Error ? e.message : String(e), 502);
  }
});
TS
