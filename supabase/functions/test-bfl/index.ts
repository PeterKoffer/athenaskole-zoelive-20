// @ts-nocheck
// supabase/functions/test-bfl/index.ts
import { bflGenerateImage } from "../_shared/imageProviders.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const bflKey = Deno.env.get("BFL_API_KEY");
  
  if (!bflKey) {
    return new Response(JSON.stringify({ error: "No BFL_API_KEY found" }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  console.log("Testing BFL API key:");
  console.log("- Key exists:", Boolean(bflKey));
  console.log("- Key length:", bflKey.length);
  console.log("- Key prefix:", bflKey.substring(0, 8) + "...");

  // Test different endpoints
  const endpoints = [
    "https://api.bfl.ai/v1/flux-pro-1.1",
    "https://api.bfl.ai/v1/flux-pro/v1.1", 
    "https://api.bfl.ai/v1/flux-pro",
    "https://api.bfl.ai/v1/image_generation"
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`Testing endpoint: ${endpoint}`);
      
      const result = await bflGenerateImage({
        prompt: "simple test image",
        width: 512,
        height: 512,
        apiKey: bflKey,
        endpoint: endpoint
      });
      
      console.log(`SUCCESS with endpoint: ${endpoint}`);
      return new Response(JSON.stringify({ 
        success: true, 
        endpoint: endpoint,
        imageUrl: result.url 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
      
    } catch (error) {
      console.log(`FAILED with endpoint ${endpoint}:`, error.message);
    }
  }

  return new Response(JSON.stringify({ 
    error: "All endpoints failed",
    keyInfo: {
      exists: Boolean(bflKey),
      length: bflKey.length,
      prefix: bflKey.substring(0, 8) + "..."
    }
  }), {
    status: 500,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
});