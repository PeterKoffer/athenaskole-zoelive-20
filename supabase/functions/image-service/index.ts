// supabase/functions/image-service/index.ts
import { bad, ok, handleOptions } from "../_shared/http.ts";
import { bflGenerateImage } from "../_shared/imageProviders.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

Deno.serve(async (req) => {
  // CORS / preflight
  const opt = handleOptions(req);
  if (opt) return opt;

  if (req.method !== "POST") return bad("Method not allowed", 405);

  // Provider/env guards
  const provider = (Deno.env.get("IMAGE_PROVIDER") || "bfl").toLowerCase();
  if (!["bfl", "replicate"].includes(provider)) return bad("Invalid IMAGE_PROVIDER");

  const bflKey = Deno.env.get("BFL_API_KEY");
  if (provider === "bfl" && !bflKey) return bad("Missing BFL_API_KEY", 500);

  // Storage config (optional but recommended)
  const bucket = Deno.env.get("UNIVERSE_IMAGES_BUCKET") || "universe-images";
  const serviceRole = Deno.env.get("SERVICE_ROLE_KEY"); // never return this
  const supabaseUrl =
    Deno.env.get("SUPABASE_URL") ||
    // fallback for local dev if SUPABASE_URL isn’t injected (should be):
    `${req.headers.get("x-forwarded-proto") ?? "http"}://${req.headers.get("x-forwarded-host") ?? "127.0.0.1:54321"}`;

  let body: any;
  try {
    body = await req.json();
  } catch {
    return bad("Invalid JSON body");
  }

  const prompt = String(body.title ?? body.prompt ?? "Untitled");
  const width = Number(body.width ?? 1024);
  const height = Number(body.height ?? 576);
  const universeId = String(body.universeId ?? "misc");

  try {
    // 1) Generate via BFL
    const { url: bflUrl } = await bflGenerateImage({
      prompt,
      width,
      height,
      apiKey: bflKey!,
    });

    // 2) Upload to Storage (only if we have Service Role)
    let publicUrl: string | null = null;

    if (serviceRole) {
      const supa = createClient(supabaseUrl, serviceRole, {
        auth: { persistSession: false },
        global: { headers: { "x-client-info": "image-service" } },
      });

      // fetch the image bytes
      const imgRes = await fetch(bflUrl);
      if (!imgRes.ok) {
        const t = await imgRes.text().catch(() => "");
        throw new Error(`Failed to fetch BFL image: ${imgRes.status} ${t}`);
      }
      const contentType = imgRes.headers.get("content-type") ?? "image/jpeg";
      const buf = new Uint8Array(await imgRes.arrayBuffer());

      // path: universeId/yyyy/mm/dd/<uuid>.jpg
      const now = new Date();
      const key = [
        universeId,
        now.getUTCFullYear(),
        String(now.getUTCMonth() + 1).padStart(2, "0"),
        String(now.getUTCDate()).padStart(2, "0"),
        `${crypto.randomUUID()}.jpg`,
      ].join("/");

      const { error: upErr } = await supa.storage
        .from(bucket)
        .upload(key, new Blob([buf], { type: contentType }), {
          contentType,
          upsert: false,
        });

      if (upErr) throw upErr;

      const { data: pub } = supa.storage.from(bucket).getPublicUrl(key);
      publicUrl = pub.publicUrl;
    }

    // Success
    return ok({
      impl: "bfl-upload-v1",
      provider,
      width,
      height,
      prompt,
      url: bflUrl,       // original BFL delivery URL
      publicUrl,         // your CDN/public Storage URL (null if no SERVICE_ROLE_KEY)
      bucket,
      universeId,
    });
  } catch (e) {
    return bad(e instanceof Error ? e.message : String(e), 502);
  }
});
