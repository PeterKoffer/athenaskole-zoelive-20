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
    mathematics: "bright kid-friendly math classroom with numbers and shapes, simple colorful design",
    science: "bright kid-friendly science lab with beakers and atoms, simple shapes, high-contrast",
    geography: "bright kid-friendly world map with continents, simple colorful design",
    "computer-science": "bright kid-friendly computer lab with circuits, simple tech icons",
    music: "bright kid-friendly music room with instruments, simple colorful notes",
    "creative-arts": "bright kid-friendly art studio with paintbrushes and colors, simple design",
    "body-lab": "bright kid-friendly gym with sports equipment, simple active design",
    "life-essentials": "bright kid-friendly life skills classroom, simple everyday objects",
    "history-religion": "bright kid-friendly history classroom with books and scrolls, simple design",
    languages: "bright kid-friendly language classroom with letters and words, simple design",
    "mental-wellness": "bright kid-friendly peaceful classroom with calm colors, simple soothing design"
  };

  const basePrompt = subjectPrompts[subject] || "bright kid-friendly educational classroom, simple shapes, high-contrast";
  return `${basePrompt}, educational illustration for ${title}`;
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