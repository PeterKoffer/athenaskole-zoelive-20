// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const STORAGE_BUCKET = "universe-images";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const REPLICATE_WEBHOOK_TOKEN = Deno.env.get("REPLICATE_WEBHOOK_TOKEN") || "";

const sbAdmin = createClient(SUPABASE_URL, SERVICE_ROLE);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function ok(body: unknown) {
  return new Response(JSON.stringify(body), { 
    status: 200, 
    headers: { ...corsHeaders, "Content-Type": "application/json" } 
  });
}

function bad(msg: string, code = 400) {
  return new Response(JSON.stringify({ error: msg }), { 
    status: code, 
    headers: { ...corsHeaders, "Content-Type": "application/json" } 
  });
}

// Find the first URL or data URL anywhere in a complex object
function firstImageRef(val: unknown): { kind: "url" | "dataurl"; value: string } | null {
  const seen = new Set<unknown>();
  const stack = [val];
  const isHttp = (s: string) => /^https?:\/\//i.test(s);
  const isData = (s: string) => /^data:image\/[a-zA-Z+]+;base64,/i.test(s);

  while (stack.length) {
    const cur = stack.pop();
    if (cur == null || seen.has(cur)) continue;
    seen.add(cur);

    if (typeof cur === "string") {
      if (isHttp(cur)) return { kind: "url", value: cur };
      if (isData(cur)) return { kind: "dataurl", value: cur };
    } else if (Array.isArray(cur)) {
      for (const it of cur) stack.push(it);
    } else if (typeof cur === "object") {
      for (const v of Object.values(cur as Record<string, unknown>)) stack.push(v);
    }
  }
  return null;
}

function dataUrlToBytes(dataUrl: string): Uint8Array {
  const [, b64] = dataUrl.split(",", 2);
  const bin = atob(b64 || "");
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return arr;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Optional simple token guard
  if (REPLICATE_WEBHOOK_TOKEN) {
    const token = new URL(req.url).searchParams.get("token");
    if (token !== REPLICATE_WEBHOOK_TOKEN) {
      console.log(`❌ Webhook unauthorized: expected token but got ${token}`);
      return bad("unauthorized", 401);
    }
  }

  if (req.method !== "POST") return bad("POST required", 405);

  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return bad("Invalid JSON");
  }

  const predictionId = String(payload?.id ?? "");
  if (!predictionId) return bad("Missing prediction id");

  console.log(`🎣 Webhook received for prediction ${predictionId}, status: ${payload?.status}`);

  try {
    const { data: row, error } = await sbAdmin
      .from("ai_images")
      .select("id, universe_id")
      .eq("replicate_prediction_id", predictionId)
      .single();

    if (error || !row) {
      console.log(`❌ Unknown prediction id: ${predictionId}`);
      return bad("Unknown prediction id", 404);
    }

    if (payload?.status !== "succeeded") {
      console.log(`❌ Prediction failed: ${payload?.status}, error: ${payload?.error}`);
      await sbAdmin.from("ai_images")
        .update({ 
          status: payload?.status ?? "failed", 
          error: String(payload?.error ?? ""),
          completed_at: new Date().toISOString()
        })
        .eq("id", row.id);
      return ok({ handled: true, status: payload?.status });
    }

    const ref = firstImageRef(payload?.output);
    if (!ref) {
      console.log(`❌ No image found in output:`, JSON.stringify(payload?.output).slice(0, 500));
      await sbAdmin.from("ai_images").update({ 
        status: "failed", 
        error: "No image in output",
        completed_at: new Date().toISOString()
      }).eq("id", row.id);
      return bad("no image found in output", 422);
    }

    console.log(`📸 Found image reference: ${ref.kind} - ${ref.value.slice(0, 100)}...`);

    let bytes: Uint8Array;
    let contentType = "image/png";

    if (ref.kind === "url") {
      console.log(`⬇️ Downloading image from URL...`);
      const r = await fetch(ref.value);
      if (!r.ok) throw new Error(`download failed: ${r.status}`);
      const ct = r.headers.get("content-type") ?? "image/png";
      contentType = ct.includes("jpeg") ? "image/jpeg" : (ct.includes("webp") ? "image/webp" : "image/png");
      bytes = new Uint8Array(await r.arrayBuffer());
    } else {
      console.log(`🔄 Converting data URL to bytes...`);
      bytes = dataUrlToBytes(ref.value);
      if (/image\/jpeg/i.test(ref.value)) contentType = "image/jpeg";
      if (/image\/webp/i.test(ref.value)) contentType = "image/webp";
    }

    const fileName = `${row.id}.png`;
    const storagePath = `${row.universe_id}/${fileName}`;

    console.log(`📤 Uploading to storage: ${storagePath} (${bytes.length} bytes)`);

    const { error: upErr } = await sbAdmin.storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, bytes, { contentType, upsert: true });
    
    if (upErr) {
      console.error(`❌ Upload error:`, upErr);
      throw upErr;
    }

    await sbAdmin
      .from("ai_images")
      .update({ 
        status: "succeeded", 
        storage_path: storagePath, 
        completed_at: new Date().toISOString() 
      })
      .eq("id", row.id);

    console.log(`✅ Webhook completed successfully for ${predictionId}`);

    return ok({ handled: true, storagePath });
  } catch (e) {
    console.error(`❌ Webhook error:`, e);
    return bad(`webhook error: ${String(e)}`, 500);
  }
});