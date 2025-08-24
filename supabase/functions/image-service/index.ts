// Deno + Supabase Edge friendly
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import Replicate from "npm:replicate"; // Deno can import npm packages

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const replicate = new Replicate({
  auth: Deno.env.get("REPLICATE_API_TOKEN") ?? "",
});

serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  try {
    if (req.method === "POST" && url.pathname === "/generate") {
      const { prompt = "Classroom-friendly cover", universeId = "demo", gradeRaw = "5a" } = await req.json();

      if (!replicate.auth) {
        // Gracefully skip if token missing; UI already falls back to SVG
        return new Response(JSON.stringify({ status: "skipped", reason: "missing-token" }), {
          headers: { "Content-Type": "application/json", ...corsHeaders },
          status: 200,
        });
      }

      // No version needed — SDK resolves the latest version for the slug
      const output = await replicate.run("black-forest-labs/flux-dev", {
        input: { prompt },
      });

      // Many image models return an array of URLs; pick the first
      const first =
        Array.isArray(output) ? output[0] :
        (typeof output === "string" ? output : (output?.url ?? null));

      if (!first) {
        return new Response(JSON.stringify({ status: "error", error: "No output URL" }), {
          headers: { "Content-Type": "application/json", ...corsHeaders },
          status: 500,
        });
      }

      // Return a plain URL; your front-end already cache-busts with ?v=timestamp
      return new Response(JSON.stringify({ url: String(first), status: "ok", universeId, gradeRaw }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 200,
      });
    }

    return new Response("Not found", { status: 404, headers: corsHeaders });
  } catch (e) {
    return new Response(JSON.stringify({ status: "error", error: String(e?.message ?? e) }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
      status: 500,
    });
  }
});