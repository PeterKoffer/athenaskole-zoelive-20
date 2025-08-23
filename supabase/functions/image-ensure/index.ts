import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Minimal guard that ensures a storage object exists and is not obviously corrupt/small.
// If it's missing or tiny, we either delete it (so the client can repair)
// or write a tiny placeholder (real PNG for .png only).

const MIN_BYTES = 1024;

// --- Helpers ---------------------------------------------------------------
const PNG_1x1_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO9zE9kAAAAASUVORK5CYII="; // transparent 1×1 PNG
const png1x1 = Uint8Array.from(atob(PNG_1x1_BASE64), (c) => c.charCodeAt(0));

function isPng(path: string) {
  return path.toLowerCase().endsWith(".png");
}
function isWebp(path: string) {
  return path.toLowerCase().endsWith(".webp");
}

serve(async (req) => {
  try {
    const { bucket, objectKey } = await req.json();
    if (!bucket || !objectKey) {
      return new Response(
        JSON.stringify({ error: "bucket and objectKey are required" }),
        { status: 400, headers: { "content-type": "application/json" } },
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const client = createClient(supabaseUrl, serviceKey);

    // Try to download to validate size & type (HEAD isn’t exposed here)
    const dl = await client.storage.from(bucket).download(objectKey);
    let ok = !!dl.data && dl.error === null;
    let size = ok ? dl.data!.size : 0;
    let repaired = false;
    let uploadedFallback = false;

    if (!ok || size < MIN_BYTES) {
      // Remove any junk to let the client (or us) repair cleanly.
      await client.storage.from(bucket).remove([objectKey]);

      // Fallback behavior:
      // - .png  -> upload real PNG bytes (1×1 transparent)
      // - .webp -> no server upload; client-side tool will regenerate a proper WebP
      if (isPng(objectKey)) {
        await client.storage
          .from(bucket)
          .upload(objectKey, png1x1, { contentType: "image/png", upsert: true });
        uploadedFallback = true;
      } else if (isWebp(objectKey)) {
        // leave it deleted; client will re-create as proper WebP
      }

      repaired = true;
    }

    return new Response(
      JSON.stringify({ ok: true, repaired, uploadedFallback }),
      { headers: { "Content-Type": "application/json" } },
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ error: String(e?.message || e) }),
      { status: 500, headers: { "content-type": "application/json" } },
    );
  }
});
