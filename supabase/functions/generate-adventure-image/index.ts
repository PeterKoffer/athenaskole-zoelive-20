import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
// import { OpenAI } from 'https://deno.land/x/openai@v1.0.0/mod.ts'; // Example for DALL-E
// import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'; // For storing image in Supabase Storage

console.log('Supabase function `generate-adventure-image` init');

interface ImageGenerationRequest {
  textPrompt: string;
  // Optional parameters for image generation, e.g.:
  // style?: 'photorealistic' | 'cartoon' | 'impressionistic' | 'pixel-art' | 'fantasy' | 'sci-fi';
  // aspectRatio?: '16:9' | '1:1' | '4:3' | '9:16';
  // quality?: 'standard' | 'hd';
  // seed?: number; // For reproducibility with some models
}

interface ImageGenerationResponse {
  imageUrl?: string;
  promptUsed?: string; // Good for debugging
  error?: string;
  errorMessage?: string; // More detailed error message
}

// Helper to generate a plausible mock image URL (e.g., from Unsplash or Placeholder)
function generateMockImageUrl(prompt: string): string {
  // Simple hash to get some variation from prompt
  let hash = 0;
  for (let i = 0; i < prompt.length; i++) {
    const char = prompt.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  const seed = Math.abs(hash);

  // Using a placeholder service like PlaceKeanu or Lorem Picsum for variety if Unsplash is problematic
  // const keywords = prompt.split(' ').slice(0, 3).join(',') || 'adventure';
  const width = 600;
  const height = 400;
  // return `https://source.unsplash.com/random/\${width}x\${height}?=\${encodeURIComponent(keywords)}&\${seed}`;

  // Using a simpler placeholder to avoid issues with Unsplash random specific keyword limitations
  // return `https://picsum.photos/seed/\${seed}/\${width}/\${height}`;
  return `https://via.placeholder.com/\${width}x\${height}.png?text=\${encodeURIComponent(prompt.substring(0,40))}`;
}


serve(async (req: Request) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*', // Allow any origin
    'Access-Control-Allow-Methods': 'POST, OPTIONS', // Allow POST and OPTIONS
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 405,
      });
    }

    const requestBody: ImageGenerationRequest = await req.json();
    const { textPrompt /*, style, aspectRatio */ } = requestBody;

    if (!textPrompt || textPrompt.trim() === "") {
      return new Response(JSON.stringify({ error: "textPrompt is required" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    console.log(\`Received image generation request for prompt: "\${textPrompt}"\`);

    // --- Placeholder for Real AI Image Generation API Call & Storage ---
    // 1. Get API Key for image generation service (e.g., OpenAI DALL-E, Stability AI)
    //    const imageGenApiKey = Deno.env.get('IMAGE_GENERATION_API_KEY');
    //    if (!imageGenApiKey) throw new Error("IMAGE_GENERATION_API_KEY (e.g. OPENAI_API_KEY) not set.");

    // 2. Call the AI Image Generation API
    //    Example with conceptual DALL-E call:
    //    const openai = new OpenAI({ apiKey: imageGenApiKey }); // Assuming IMAGE_GENERATION_API_KEY is OPENAI_API_KEY
    //    const imageResponse = await openai.images.generate({
    //      model: "dall-e-3", // or "dall-e-2"
    //      prompt: textPrompt, // Add style parameters here if supported, e.g., `A \${style || 'vibrant cartoon'} style image of: \${textPrompt}`
    //      n: 1,
    //      size: "1024x1024", // Or other supported sizes like "1792x1024" for DALL-E 3
    //      quality: requestBody.quality || "standard",
    //      response_format: "url", // Or "b64_json" to then store it
    //    });
    //    const generatedImageUrlFromAI = imageResponse.data[0].url;
    //    if (!generatedImageUrlFromAI) throw new Error("AI image generation failed to return a URL.");
    //    let finalImageUrlToReturn = generatedImageUrlFromAI;

    // 3. (Optional but Recommended) Store the image in Supabase Storage
    //    This gives you more control, caching, and avoids hotlinking directly to temporary AI URLs.
    //    If response_format was 'b64_json' or if you fetch the URL and want to store it:
    //    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    //    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    //    if (!supabaseUrl || !supabaseServiceRoleKey) throw new Error("Supabase URL or Service Role Key not set for image storage.");
    //    const supabaseAdminClient = createClient(supabaseUrl, supabaseServiceRoleKey);
    //
    //    // Fetch the image data from the AI-generated URL
    //    const imageHttpResponse = await fetch(generatedImageUrlFromAI);
    //    if (!imageHttpResponse.ok) throw new Error(\`Failed to fetch generated image from AI URL: \${imageHttpResponse.statusText}\`);
    //    const imageBlob = await imageHttpResponse.blob();
    //
    //    const sanitizedPrompt = textPrompt.substring(0,50).replace(/[^a-zA-Z0-9]/g, '_'); // Sanitize for filename
    //    const filePath = \`adventure-images/\${Date.now()}-\${sanitizedPrompt}.png\`; // Assuming PNG, adjust if needed
    //
    //    const { data: storageData, error: storageError } = await supabaseAdminClient.storage
    //      .from('adventure-images-bucket') // << REPLACE with your actual bucket name
    //      .upload(filePath, imageBlob, { contentType: imageBlob.type || 'image/png', upsert: true });
    //
    //    if (storageError) throw storageError;
    //
    //    const { data: publicUrlData } = supabaseAdminClient.storage
    //      .from('adventure-images-bucket') // << REPLACE with your actual bucket name
    //      .getPublicUrl(filePath);
    //
    //    if (!publicUrlData || !publicUrlData.publicUrl) throw new Error("Failed to get public URL for stored image.");
    //    finalImageUrlToReturn = publicUrlData.publicUrl;
    // --- End Placeholder ---


    // --- Mock Response (Using placeholder for varied images) ---
    const mockImageUrl = generateMockImageUrl(textPrompt);
    const responsePayload: ImageGenerationResponse = {
      imageUrl: mockImageUrl,
      promptUsed: textPrompt,
    };
    // --- End Mock Response ---

    // When real AI is integrated, use finalImageUrlToReturn in responsePayload
    // const responsePayload: ImageGenerationResponse = {
    //   imageUrl: finalImageUrlToReturn,
    //   promptUsed: textPrompt,
    // };

    return new Response(JSON.stringify(responsePayload), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in generate-adventure-image function:', error.message, error.stack);
    const errorResponse: ImageGenerationResponse = {
        error: "Image generation failed",
        errorMessage: error.message,
        promptUsed: req.method === 'POST' ? (await req.json().catch(() => ({}))).textPrompt : undefined
    };
    return new Response(JSON.stringify(errorResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
