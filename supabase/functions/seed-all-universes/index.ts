// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const sb = createClient(SUPABASE_URL, SERVICE_ROLE);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const FN_URL = `${SUPABASE_URL.replace(/\/+$/,'')}/functions/v1/image-ensure`;
const MAX_CONCURRENCY = Number(Deno.env.get("SEED_MAX_CONCURRENCY") ?? "3");
const DEFAULT_WIDTH = 512;
const DEFAULT_HEIGHT = 512;
const DEFAULT_TARGET = Number(Deno.env.get("SEED_TARGET") ?? "1"); // 1 per universe baseline

function generatePrompt(universe: any): string {
  const subject = universe.subject || 'education';
  const title = universe.title || 'learning';
  
  const subjectPrompts: Record<string, string> = {
    mathematics: "bright modern math research center with equations and data displays, professional colorful design",
    science: "bright modern science lab with advanced equipment and displays, professional high-contrast",
    geography: "bright modern geographic research center with digital maps, professional colorful design",
    "computer-science": "bright modern tech innovation lab with computers and screens, professional design",
    music: "bright modern recording studio with professional instruments, professional colorful design",
    "creative-arts": "bright modern design studio with digital displays and tools, professional design",
    "body-lab": "bright modern fitness research center with advanced equipment, professional design",
    "life-essentials": "bright modern life skills training center, professional everyday objects",
    "history-religion": "bright modern research library with digital archives, professional design",
    languages: "bright modern language center with digital displays, professional design",
    "mental-wellness": "bright modern wellness center with calming professional design"
  };

  const basePrompt = subjectPrompts[subject] || "bright modern professional workspace, professional design";
  return `${basePrompt}, professional illustration for ${title}`;
}

async function seedUniverse(u: { id: string, title?: string, subject?: string }) {
  const prompt = generatePrompt(u);
  
  const body = {
    universeId: u.id,
    prompt,
    target: DEFAULT_TARGET,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
    replicateInput: { 
      prompt, 
      width: DEFAULT_WIDTH, 
      height: DEFAULT_HEIGHT 
    }
  };

  console.log(`🌱 Seeding universe ${u.id} with prompt: ${prompt}`);

  const r = await fetch(FN_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${SERVICE_ROLE}`,
      "apikey": SERVICE_ROLE,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  const j = await r.json().catch(() => ({}));
  console.log(`✅ Seeded universe ${u.id}:`, { ok: r.ok, status: r.status });
  
  return { 
    universeId: u.id, 
    ok: r.ok, 
    status: r.status, 
    result: j,
    prompt 
  };
}

async function run() {
  console.log("🚀 Starting seed-all-universes with concurrency:", MAX_CONCURRENCY);

  // Get all universes
  const { data, error } = await sb
    .from("universes")
    .select("id, title, subject")
    .limit(2000);

  if (error) {
    console.error("❌ Error fetching universes:", error);
    return new Response(JSON.stringify({ error: String(error) }), { 
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  const list = (data ?? []).map((r: any) => ({ 
    id: String(r.id), 
    title: r.title,
    subject: r.subject 
  }));

  console.log(`📊 Found ${list.length} universes to seed`);

  // Concurrency-limited fan-out
  const out: any[] = [];
  let i = 0;
  
  async function worker() {
    while (i < list.length) {
      const idx = i++;
      try {
        out[idx] = await seedUniverse(list[idx]);
      } catch (e) {
        console.error(`❌ Failed to seed universe ${list[idx].id}:`, e);
        out[idx] = { 
          universeId: list[idx].id, 
          ok: false, 
          error: String(e) 
        };
      }
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(MAX_CONCURRENCY, list.length) }, worker)
  );

  const successful = out.filter(r => r.ok).length;
  const failed = out.filter(r => !r.ok).length;

  console.log(`🎯 Seeding complete: ${successful} successful, ${failed} failed`);

  return new Response(JSON.stringify({ 
    total: list.length,
    successful,
    failed,
    concurrency: MAX_CONCURRENCY,
    target: DEFAULT_TARGET,
    results: out 
  }, null, 2), {
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("POST required", { 
      status: 405,
      headers: corsHeaders
    });
  }

  return run();
});