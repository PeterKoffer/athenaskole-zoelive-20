// supabase/functions/image-service/index.ts
import { bflGenerateImageInline } from "../_shared/imageProviders.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2?target=deno";

const CORS = {
  "content-type": "application/json",
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "authorization, x-client-info, apikey, content-type",
  "access-control-allow-methods": "GET,POST,OPTIONS",
} as const;
const ok = (data: unknown, status = 200) => new Response(JSON.stringify({ ok: true, data }), { status, headers: CORS });
const bad = (msg: string, status = 400) => new Response(JSON.stringify({ error: msg }), { status, headers: CORS });
const opt = (req: Request) => (req.method === "OPTIONS" ? new Response("{}", { headers: CORS }) : null);

// Deadlines (hold hele requesten under ~55s, så du ikke ryger i early termination)
const BFL_TIMEOUT_MS = Number(Deno.env.get("BFL_TIMEOUT_MS") ?? 25_000);    // generering
const FETCH_IMG_TIMEOUT_MS = Number(Deno.env.get("FETCH_IMG_TIMEOUT_MS") ?? 12_000); // hente billedbytes
const UPLOAD_TIMEOUT_MS = Number(Deno.env.get("UPLOAD_TIMEOUT_MS") ?? 15_000);      // upload til storage

Deno.serve(async (req) => {
  const o = opt(req); if (o) return o;
  if (req.method !== "POST") return bad("Method not allowed", 405);

  let body: any;
  try { body = await req.json(); } catch { return bad("Invalid JSON body"); }

  const provider = (Deno.env.get("IMAGE_PROVIDER") || "bfl").toLowerCase();
  if (provider !== "bfl") return bad("Replicate provider not configured yet", 501);

  const prompt = String(body.prompt ?? body.title ?? "Untitled");
  const width = Number(body.width ?? 1024);
  const height = Number(body.height ?? 576);
  const universeId = String(body.universeId ?? "default");

  const apiBase = Deno.env.get("BFL_API_BASE") ?? "https://api.bfl.ai";
  const model = Deno.env.get("BFL_MODEL") ?? "flux-pro-1.1";
  const apiKey = Deno.env.get("BFL_API_KEY");
  if (!apiKey) return bad("Missing BFL_API_KEY", 500);

  const endpoint = `${apiBase}/v1/${model}`;
  console.info("[image-service] submit:", { endpoint, prompt, width, height });

  // 1) Generer billede via BFL (stram timeout)
  const bflCtl = new AbortController();
  const bflTimer = setTimeout(() => bflCtl.abort("bfl-timeout"), BFL_TIMEOUT_MS);
  let sourceUrl: string;
  try {
    const { url } = await bflGenerateImageInline({
      apiKey, endpoint, prompt, width, height,
      // den interne helper har egen timeout, men vi sætter også en overordnet:
      // (AbortController her bruges kun hvis helperen skulle hænge i fetch)
    } as any);
    sourceUrl = url;
  } catch (e) {
    clearTimeout(bflTimer);
    const msg = e instanceof Error ? e.message : String(e);
    console.warn("[image-service] BFL error -> fallback:", msg);
    return bad(`BFL error: ${msg}`, 502);
  } finally {
    clearTimeout(bflTimer);
  }

  // 2) Upload til Storage hvis SERVICE_ROLE_KEY findes — ellers returnér inline
  const bucket = Deno.env.get("UNIVERSE_IMAGES_BUCKET") ?? "universe-images";
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "http://127.0.0.1:54321";
  const serviceRole = Deno.env.get("SERVICE_ROLE_KEY");
  if (!serviceRole) {
    return ok({ impl: "bfl-inline-v1", endpoint, url: sourceUrl, width, height });
  }

  const supabase = createClient(supabaseUrl, serviceRole, { auth: { persistSession: false } });

  // Hent bytes med timeout (CDN kan være langsom)
  console.time("[image-service] fetch-image");
  let bytes: Uint8Array, contentType = "image/jpeg";
  try {
    const res = await fetch(sourceUrl, { signal: AbortSignal.timeout(FETCH_IMG_TIMEOUT_MS) });
    if (!res.ok) return ok({ impl: "bfl-inline-v1", endpoint, url: sourceUrl, note: `image fetch ${res.status}` });
    contentType = res.headers.get("content-type") ?? "image/jpeg";
    bytes = new Uint8Array(await res.arrayBuffer());
  } catch (e) {
    console.warn("[image-service] fetch-image timeout/fail -> returning inline", e?.toString?.());
    return ok({ impl: "bfl-inline-v1", endpoint, url: sourceUrl, width, height, note: "fetch-timeout" });
  } finally {
    console.timeEnd("[image-service] fetch-image");
  }

  // Upload med hård deadline — ellers returnér inline i stedet for at hænge
  console.time("[image-service] upload");
  const blob = new Blob([bytes], { type: contentType });
  const filename = `${Date.now()}-${crypto.randomUUID().slice(0,8)}.${contentType.includes("png") ? "png" : "jpg"}`;
  const path = `${universeId}/${filename}`;

  try {
    const result = await Promise.race([
      supabase.storage.from(bucket).upload(path, blob, { contentType, upsert: true }),
      new Promise((_r, reject) => setTimeout(() => reject(new Error("upload-timeout")), UPLOAD_TIMEOUT_MS)),
    ]) as any;

    if (result?.error) {
      console.warn("[image-service] upload error -> inline", result.error);
      return ok({ impl: "bfl-inline-v1", endpoint, url: sourceUrl, width, height, note: `upload-error: ${result.error.message}` });
    }

    const pub = supabase.storage.from(bucket).getPublicUrl(path);
    console.timeEnd("[image-service] upload");

    return ok({
      impl: "bfl-upload-v1",
      provider, endpoint,
      sourceUrl,
      bucket, path,
      publicUrl: pub.data.publicUrl,
      width, height,
    });
  } catch (e) {
    console.warn("[image-service] upload timeout/fail -> inline", e?.toString?.());
    return ok({ impl: "bfl-inline-v1", endpoint, url: sourceUrl, width, height, note: "upload-timeout" });
  }
});
