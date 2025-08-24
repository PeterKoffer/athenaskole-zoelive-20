// supabase/functions/image-service/index.ts
// Deno runtime (Supabase Edge)
// Use Replicate SDK; upload to Supabase Storage; return public URL.

import Replicate from "npm:replicate";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const svgFallback = (universeId: string, grade: string | number) => {
  const g = String(grade).match(/\d+/)?.[0] ?? "0";
  const txt = `U:${universeId.slice(0, 4)} G:${g}`;
  const svg = encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='1024' height='576'>
      <rect width='100%' height='100%' fill='#1f2937'/>
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
        font-family='Inter,Arial' font-size='42' fill='white'>${txt}</text>
    </svg>`
  );
  return `data:image/svg+xml;charset=utf-8,${svg}`;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: cors });
  }

  const url = new URL(req.url);
  const path = url.pathname.split("/").pop(); // expecting /generate

  if (req.method !== "POST" || path !== "generate") {
    return new Response(JSON.stringify({ error: "Use POST /generate" }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...cors },
    });
  }

  try {
    const { universeId, gradeRaw, prompt, title, subject, grade } = await req.json();
    const universe = String(universeId ?? "unknown");
    const g = grade ?? gradeRaw ?? "0";

    const PROMPT =
      prompt ??
      `Classroom-friendly ${subject || "general"} cover for ${title || "Today's Program"}`;

    const SUPABASE_URL =
      Deno.env.get("SUPABASE_URL") || Deno.env.get("PROJECT_URL") || "";
    const SUPABASE_SERVICE_ROLE_KEY =
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || Deno.env.get("SERVICE_ROLE_KEY") || "";
    const REPLICATE_API_TOKEN = Deno.env.get("REPLICATE_API_TOKEN") || "";

    // If we don't have a token, return an SVG placeholder so the UI still shows something.
    if (!REPLICATE_API_TOKEN) {
      return new Response(JSON.stringify({ url: svgFallback(universe, g) }), {
        headers: { "Content-Type": "application/json", ...cors },
      });
    }

    const replicate = new Replicate({ auth: REPLICATE_API_TOKEN });

    // Run the model without worrying about version ids.
    const input = {
      prompt: PROMPT,
      go_fast: true,
      megapixels: "1",
      output_format: "png",
      num_outputs: 1,
      aspect_ratio: "16:9",
      // tweakables:
      // guidance: 3.5, output_quality: 80, num_inference_steps: 28, prompt_strength: 0.8,
    };

    // Returns an array of URLs (strings) to files hosted by Replicate.
    const output = (await replicate.run("black-forest-labs/flux-dev", { input })) as string[] | unknown;
    const fileUrl =
      Array.isArray(output) && typeof output[0] === "string" ? output[0] : null;

    if (!fileUrl) {
      // If Replicate didn't return a URL, fall back to SVG.
      return new Response(JSON.stringify({ url: svgFallback(universe, g) }), {
        headers: { "Content-Type": "application/json", ...cors },
      });
    }

    // Download the image and store it in Supabase Storage
    const res = await fetch(fileUrl);
    if (!res.ok) throw new Error(`Download failed ${res.status}`);
    const buf = new Uint8Array(await res.arrayBuffer());

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const bucket = "universe-images";
    const objectPath = `${universe}.png`;

    // upsert=true so repeated calls are instant/cached on our side
    const { error: upErr } = await supabase.storage
      .from(bucket)
      .upload(objectPath, buf, { contentType: "image/png", upsert: true });
    if (upErr) throw upErr;

    const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath);
    const publicUrl = `${data.publicUrl}?v=${Date.now()}`;

    return new Response(JSON.stringify({ url: publicUrl }), {
      headers: { "Content-Type": "application/json", ...cors },
    });
  } catch (e: any) {
    console.error("image-service error:", e);
    return new Response(JSON.stringify({ url: null, error: String(e?.message ?? e) }), {
      status: 200, // return 200 so the UI uses its client-side SVG fallback
      headers: { "Content-Type": "application/json", ...cors },
    });
  }
});