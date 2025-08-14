// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Util: base64 -> Uint8Array (Deno har atob)
function b64ToUint8Array(b64: string) {
  const bin = atob(b64)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return bytes
}

async function getCached(universeId: string, lang: string) {
  const { data, error } = await supabase
    .from("universe_images")
    .select("image_url")
    .eq("universe_id", universeId)
    .eq("lang", lang)
    .maybeSingle()
  if (error) console.error("cache read error", error)
  return data?.image_url ?? null
}

async function putCache(universeId: string, lang: string, imageUrl: string, source: "ai" | "fallback") {
  const { error } = await supabase
    .from("universe_images")
    .upsert({ universe_id: universeId, lang, image_url: imageUrl, source })
  if (error) console.error("cache write error", error)
}

function storagePublicUrl(path: string) {
  const base = supabaseUrl.replace(/^https?:\/\//, "")
  return `https://${base}/storage/v1/object/public/${path}`
}

async function uploadToStorage(universeId: string, pngBytes: Uint8Array) {
  const { error } = await supabase.storage
    .from("universe-images")
    .upload(`${universeId}.png`, pngBytes, {
      contentType: "image/png",
      upsert: true,
    })
  if (error) throw error
  return storagePublicUrl(`universe-images/${universeId}.png`)
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { prompt, imagePrompt, universeId, lang = "en", size = "1024x1024" } = await req.json()
    console.log('🎨 Image generation request:', { universeId, lang, hasPrompt: !!(prompt || imagePrompt) })

    if (!universeId) {
      return new Response(
        JSON.stringify({ error: "universeId required" }), 
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // 1) Check cache first
    const cached = await getCached(universeId, lang)
    if (cached) {
      console.log('✅ Returning cached image for universe:', universeId)
      return new Response(
        JSON.stringify({ 
          success: true,
          imageUrl: cached, 
          from: "cache",
          cached: true,
          isAI: true
        }), 
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      )
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
    
    if (!openAIApiKey) {
      console.error('OpenAI API key not found')
      // Fallback chain: exact match -> default
      const fallbackExact = storagePublicUrl(`universe-images/${universeId}.png`)
      const fallbackDefault = storagePublicUrl("universe-images/default.png")
      const imageUrl = fallbackExact
      
      // Cache fallback
      await putCache(universeId, lang, imageUrl, "fallback")
      
      return new Response(
        JSON.stringify({ 
          success: true,
          imageUrl,
          from: "fallback",
          cached: false,
          isAI: false
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // 2) Generate AI image
    const finalPrompt = imagePrompt || prompt || `Cinematic key art for "${universeId}" classroom adventure, child-friendly, detailed, vibrant, no text`
    console.log('🎨 Calling OpenAI API with prompt:', finalPrompt.slice(0, 100))
    
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt: finalPrompt,
        size: size,
        n: 1,
        output_format: 'png'
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenAI API error:', response.status, errorText)
      throw new Error(`OpenAI API error: ${response.status} ${errorText}`)
    }

    const data = await response.json()
    const b64 = data.data?.[0]?.b64_json
    
    if (!b64) {
      throw new Error("No image data returned from OpenAI")
    }

    // 3) Upload to Storage and cache
    const png = b64ToUint8Array(b64)
    const publicUrl = await uploadToStorage(universeId, png)
    
    await putCache(universeId, lang, publicUrl, "ai")
    console.log('✅ Generated and cached AI image:', universeId)

    return new Response(
      JSON.stringify({ 
        success: true,
        imageUrl: publicUrl, 
        from: "ai",
        cached: false,
        isAI: true
      }), 
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    )

  } catch (error: any) {
    console.error('generate-universe-image error:', error)

    // Fallback chain: exact match -> category -> default
    const universeId = new URL(req.url).searchParams.get("universeId") || "unknown"
    const lang = new URL(req.url).searchParams.get("lang") || "en"
    const fallbackExact = storagePublicUrl(`universe-images/${universeId}.png`)
    const fallbackDefault = storagePublicUrl("universe-images/default.png")
    const imageUrl = fallbackExact

    // Cache fallback (så UI altid får et billede)
    try {
      if (universeId !== "unknown") {
        await putCache(universeId, lang, imageUrl, "fallback")
      }
    } catch (cacheError) {
      console.error('Failed to cache fallback:', cacheError)
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        imageUrl, 
        from: "fallback", 
        error: String(error),
        cached: false,
        isAI: false
      }), 
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    )
  }
})