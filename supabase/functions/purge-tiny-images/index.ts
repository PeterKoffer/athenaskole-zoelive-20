// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const BUCKET = Deno.env.get("PURGE_BUCKET") ?? "universe-images";
const PREFIX = Deno.env.get("PURGE_PREFIX") ?? "";
const MIN_BYTES = parseInt(Deno.env.get("MIN_BYTES") ?? "1024", 10);
const GRACE_MIN = parseInt(Deno.env.get("GRACE_MIN") ?? "10", 10);
const DRY_RUN = (Deno.env.get("DRY_RUN") ?? "false") === "true";

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), { 
      status: 405, 
      headers: { ...CORS, 'Content-Type': 'application/json' } 
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { global: { fetch } }
    );

    const cutoff = Date.now() - GRACE_MIN * 60_000;

    async function listAll(prefix: string) {
      const out: any[] = [];
      let page = 0;
      while (true) {
        const { data, error } = await supabase.storage
          .from(BUCKET)
          .list(prefix, { limit: 1000, offset: page * 1000 });
        if (error) throw error;
        if (!data?.length) break;
        out.push(...data);
        page++;
      }
      return out;
    }

    const join = (p: string, n: string) => (p ? `${p}/${n}` : n);
    console.log(`🔍 Scanning bucket: ${BUCKET}${PREFIX ? `/${PREFIX}` : ''}`);
    
    const entries = await listAll(PREFIX);
    const victims = entries.filter((f) => {
      const okSize = typeof f.size === "number" && f.size < MIN_BYTES;
      const updatedAt = (f.updated_at ? new Date(f.updated_at) : new Date()).getTime();
      const oldEnough = updatedAt < cutoff;
      return okSize && oldEnough && !f.id?.endsWith("/");
    });

    if (!victims.length) {
      return new Response(
        JSON.stringify({
          status: "ok",
          message: "No tiny files found",
          scanned: entries.length,
          removed: 0,
        }),
        { headers: { ...CORS, "content-type": "application/json" } }
      );
    }

    if (DRY_RUN) {
      return new Response(
        JSON.stringify({
          status: "ok",
          mode: "dry-run",
          found: victims.length,
          sample: victims.slice(0, 10).map(f => ({ name: f.name, size: f.size })),
        }),
        { headers: { ...CORS, "content-type": "application/json" } }
      );
    }

    const paths = victims.map((f: any) => join(PREFIX, f.name));
    const { error } = await supabase.storage.from(BUCKET).remove(paths);
    if (error) throw error;

    console.log(`🧹 Removed ${paths.length} tiny files`);

    return new Response(
      JSON.stringify({ 
        status: "ok", 
        removed: paths.length,
        scanned: entries.length,
      }),
      { headers: { ...CORS, "content-type": "application/json" } }
    );

  } catch (error) {
    console.error('Purge error:', error);
    return new Response(
      JSON.stringify({ 
        status: "error", 
        error: String(error) 
      }),
      { 
        status: 500, 
        headers: { ...CORS, 'Content-Type': 'application/json' } 
      }
    );
  }
});