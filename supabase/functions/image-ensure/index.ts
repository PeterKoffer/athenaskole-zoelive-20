// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

type Json = Record<string, unknown>;

const STORAGE_BUCKET = "universe-images";
const MAX_RUNNING_PER_UNIVERSE = Number(Deno.env.get("IMG_MAX_RUNNING_PER_UNIVERSE") ?? "2");

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const REPLICATE_TOKEN = Deno.env.get("REPLICATE_API_TOKEN")!;
const DEFAULT_VERSION = Deno.env.get("REPLICATE_VERSION")!;

const sbAdmin = createClient(SUPABASE_URL, SERVICE_ROLE);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function ok(body: Json, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body), { 
    status: 200, 
    headers: { ...corsHeaders, "Content-Type": "application/json" }, 
    ...init 
  });
}

function bad(msg: string, code = 400) {
  return new Response(JSON.stringify({ error: msg }), { 
    status: code, 
    headers: { ...corsHeaders, "Content-Type": "application/json" } 
  });
}

async function getReadyUrls(universeId: string, limit: number) {
  const { data, error } = await sbAdmin
    .from("ai_images")
    .select("id, storage_path, completed_at")
    .eq("universe_id", universeId)
    .eq("status", "succeeded")
    .order("completed_at", { ascending: false })
    .limit(limit);

  if (error) throw error;

  const urls = (data ?? []).map((row: any) => {
    const path = row.storage_path!;
    const { data: pubUrl } = sbAdmin.storage.from(STORAGE_BUCKET).getPublicUrl(path);
    return pubUrl.publicUrl;
  });
  return urls;
}

function webhookUrl() {
  const base = SUPABASE_URL.replace(/\/+$/, "");
  const token = Deno.env.get("REPLICATE_WEBHOOK_TOKEN");
  return token
    ? `${base}/functions/v1/image-webhook?token=${encodeURIComponent(token)}`
    : `${base}/functions/v1/image-webhook`;
}

async function startReplicate(universeId: string, rowId: string, prompt: string, width: number, height: number, replicateInput?: any, version?: string) {
  console.log(`🚀 Starting Replicate prediction for universe ${universeId}, row ${rowId}`);
  
  const ver = version || DEFAULT_VERSION;
  const input = (replicateInput && Object.keys(replicateInput).length)
    ? replicateInput
    : { prompt, width, height };

  const res = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: `Token ${REPLICATE_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version: ver,
      input,
      webhook: webhookUrl(),
      webhook_events_filter: ["completed"],
    }),
  });
  
  const json = await res.json();

  if (!res.ok || json.error) {
    console.error(`❌ Replicate start error:`, json);
    throw new Error(`Replicate start error: ${json?.error?.message ?? res.statusText}`);
  }

  const predictionId = json.id as string;
  console.log(`✅ Replicate prediction started: ${predictionId}`);

  // Update row with prediction id & running status
  await sbAdmin
    .from("ai_images")
    .update({ replicate_prediction_id: predictionId, status: "running" })
    .eq("id", rowId);

  return predictionId;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") return bad("POST required", 405);
  
  let body: any;
  try {
    body = await req.json();
  } catch {
    return bad("Invalid JSON");
  }

  const universeId = String(body.universeId ?? "").trim();
  if (!universeId) return bad("universeId required");

  const prompt = String(body.prompt ?? body.imagePrompt ?? "").trim() || "classroom illustration";
  const target = Math.max(1, Number(body.target ?? 3));
  const width = Math.max(64, Number(body.width ?? body.replicateInput?.width ?? 512));
  const height = Math.max(64, Number(body.height ?? body.replicateInput?.height ?? 512));
  const replicateInput = body.replicateInput;
  const overrideVersion = body.overrideVersion ? String(body.overrideVersion) : undefined;

  console.log(`🖼️ Image ensure request: universe=${universeId}, target=${target}, prompt="${prompt}"`);

  try {
    // 1) Get ready URLs
    const ready = await getReadyUrls(universeId, target);
    const deficit = Math.max(0, target - ready.length);

    console.log(`📊 Ready images: ${ready.length}, deficit: ${deficit}`);

    // 2) Check current running to respect concurrency
    const { count: runningCount } = await sbAdmin
      .from("ai_images")
      .select("id", { count: "exact", head: true })
      .eq("universe_id", universeId)
      .eq("status", "running");

    const canStart = Math.max(0, MAX_RUNNING_PER_UNIVERSE - (runningCount ?? 0));
    const toQueue = Math.min(deficit, canStart);

    console.log(`🔄 Running: ${runningCount}, can start: ${canStart}, will queue: ${toQueue}`);

    // 3) Enqueue new jobs (don't wait for completion)
    for (let i = 0; i < toQueue; i++) {
      const { data: inserted, error: insErr } = await sbAdmin
        .from("ai_images")
        .insert({
          universe_id: universeId,
          status: "queued",
          provider: "replicate",
          model_version: overrideVersion ?? DEFAULT_VERSION,
          prompt,
          width,
          height,
          storage_path: `${universeId}/`,
        })
        .select("id")
        .single();

      if (insErr) {
        console.error(`❌ Insert error:`, insErr);
        throw insErr;
      }
      
      const rowId = inserted.id as string;

      // Fire-and-forget; don't block response
      startReplicate(universeId, rowId, prompt, width, height, replicateInput, overrideVersion)
        .catch(async (e) => {
          console.error(`❌ Replicate start failed for row ${rowId}:`, e);
          await sbAdmin.from("ai_images").update({ 
            status: "failed", 
            error: String(e) 
          }).eq("id", rowId);
        });
    }

    return ok({
      success: true,
      universeId,
      readyUrls: ready,
      queued: toQueue,
      running: runningCount ?? 0,
      target,
    });
  } catch (e) {
    console.error(`❌ Image ensure error:`, e);
    return bad(`image-ensure error: ${String(e)}`, 500);
  }
});