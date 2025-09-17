import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type SettingsPayload = {
  class_id: string;
  adventure_id: string;
  settings: unknown; // AdventureConfig
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
  );

  try {
    if (req.method === "GET") {
      const class_id = url.searchParams.get("class_id");
      const adventure_id = url.searchParams.get("adventure_id");
      
      if (!class_id || !adventure_id) {
        return new Response("Missing class_id or adventure_id", { status: 400, headers: corsHeaders });
      }

      const { data, error } = await supabase
        .from("adventure_settings")
        .select("*")
        .eq("class_id", class_id)
        .eq("adventure_id", adventure_id)
        .maybeSingle();
        
      if (error) {
        console.error("Database error:", error);
        return new Response(error.message, { status: 400, headers: corsHeaders });
      }
      
      return Response.json(data?.settings ?? null, { 
        headers: { 
          ...corsHeaders,
          "x-nelie-cache": data ? "HIT" : "MISS" 
        } 
      });
    }

    if (req.method === "PUT" || req.method === "POST") {
      const body = (await req.json()) as SettingsPayload;
      
      if (!body.class_id || !body.adventure_id || !body.settings) {
        return new Response("Missing required fields", { status: 400, headers: corsHeaders });
      }

      const { data: userData } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from("adventure_settings")
        .upsert(
          {
            class_id: body.class_id,
            adventure_id: body.adventure_id,
            settings: body.settings,
            updated_by: userData.user?.id ?? null
          },
          { onConflict: "class_id,adventure_id" }
        )
        .select("*")
        .single();

      if (error) {
        console.error("Database error:", error);
        return new Response(error.message, { status: 400, headers: corsHeaders });
      }
      
      return Response.json({ ok: true, updated_at: data.updated_at }, { headers: corsHeaders });
    }

    return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
  } catch (error) {
    console.error("Function error:", error);
    return new Response("Internal Server Error", { status: 500, headers: corsHeaders });
  }
});