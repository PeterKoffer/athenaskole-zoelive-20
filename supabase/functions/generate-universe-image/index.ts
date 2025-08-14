// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

// ── CORS (tillad Supabase-klientens preflight headers) ─────────────────────────
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, content-type, apikey, x-client-info, x-supabase-authorization",
  "Content-Type": "application/json",
} as const;

// Lille helper til konsistente JSON-svar
const json = (obj: unknown, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: CORS });

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Subject-to-fallback mapping for better categorized fallbacks
const SUBJECT_MAP: Record<string, string> = {
  mathematics: "math.png",
  science: "science.png", 
  geography: "geography.png",
  "computer-science": "computer-science.png",
  music: "music.png",
  "creative-arts": "arts.png",
  "body-lab": "pe.png",
  "life-essentials": "life.png",
  "history-religion": "history.png",
  languages: "languages.png",
  "mental-wellness": "wellness.png",
  default: "default.png",
}

// Util: base64 -> Uint8Array (Deno har atob)
function b64ToUint8Array(b64: string) {
  const bin = atob(b64)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return bytes
}

// Robust timeout wrapper
async function withTimeout<T>(promise: Promise<T>, ms = 20000): Promise<T> {
  const timeout = new Promise<T>((_, reject) => 
    setTimeout(() => reject(new Error("timeout")), ms)
  )
  return Promise.race([promise, timeout])
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

// Enhanced fallback with subject mapping
function getFallbackImageUrl(universeId: string, subject?: string): string {
  const base = "universe-images"
  
  // Try: exact universe match -> subject category -> default
  const candidates = [
    `${base}/${universeId}.png`,
    `${base}/${SUBJECT_MAP[subject || "default"]}`,
    `${base}/${SUBJECT_MAP.default}`
  ]
  
  return storagePublicUrl(candidates[0]) // For now return first, could enhance with actual file existence check
}

async function uploadToStorage(universeId: string, pngBytes: Uint8Array) {
  const { error } = await supabase.storage
    .from("universe-images")
    .upload(`${universeId}.png`, pngBytes, {
      contentType: "image/png",
      upsert: true,
      cacheControl: '604800' // 7 days CDN cache
    })
  if (error) throw error
  return storagePublicUrl(`universe-images/${universeId}.png`)
}

// Enhanced OpenAI call with retries and timeout
async function generateImageWithRetry(prompt: string, size = "1024x1024"): Promise<any> {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
  if (!openAIApiKey) {
    throw new Error("OpenAI API key not available")
  }

  const attempt = async () => {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt: prompt,
        size: size,
        n: 1,
        output_format: 'png'
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`)
    }

    return response.json()
  }

  // First attempt with timeout
  try {
    return await withTimeout(attempt(), 20000)
  } catch (firstError) {
    console.warn("First attempt failed, retrying in 600ms:", firstError)
    
    // Wait and retry once
    await new Promise(resolve => setTimeout(resolve, 600))
    return await withTimeout(attempt(), 20000)
  }
}

serve(async (req: Request) => {
  // Preflight
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });

  const startTime = Date.now()
  
  // Parse body once to avoid stream consumption issues
  let body: { prompt?: string; imagePrompt?: string; universeId?: string; lang?: string; size?: string; subject?: string; force?: boolean } = {}
  try {
    body = await req.json()
  } catch (parseError) {
    console.warn('Failed to parse request body:', parseError)
  }

  const { prompt, imagePrompt, universeId, lang = "en", size = "1024x1024", subject, force = false } = body

  try {
    console.log('🎨 Image generation request:', { 
      universeId, 
      lang, 
      subject,
      hasPrompt: !!(prompt || imagePrompt),
      timestamp: new Date().toISOString()
    })

    if (!universeId) return json({ error: "universeId required" }, 400);

    // Force cache clear if requested
    if (force) {
      console.log('🗑️ Force clearing cache for universe:', universeId)
      try {
        await supabase
          .from("universe_images")
          .delete()
          .eq("universe_id", universeId)
          .eq("lang", lang);
      } catch (e) {
        console.warn("cache delete failed", e);
      }
      try {
        await supabase.storage
          .from("universe-images")
          .remove([`${universeId}.png`]);
      } catch (e) {
        console.warn("storage remove failed", e);
      }
    }

    // 1) Check cache first (skip if forced)
    const cached = !force ? await getCached(universeId, lang) : null
    if (cached) {
      const duration = Date.now() - startTime
      console.log('✅ Cache hit for universe:', universeId, `(${duration}ms)`)
      return json({ 
        success: true,
        imageUrl: cached, 
        from: "cache",
        cached: true,
        isAI: true,
        duration_ms: duration
      })
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
    
    if (!openAIApiKey) {
      console.error('OpenAI API key not found')
      const imageUrl = getFallbackImageUrl(universeId, subject)
      
      // Cache fallback
      await putCache(universeId, lang, imageUrl, "fallback")
      const duration = Date.now() - startTime
      
      return new Response(
        JSON.stringify({ 
          success: true,
          imageUrl,
          from: "fallback",
          error_code: "missing_api_key",
          cached: false,
          isAI: false,
          duration_ms: duration
        }),
        { 
          headers: CORS
        }
      )
    }

    // 2) Generate AI image with retries
    const finalPrompt = imagePrompt || prompt || `Cinematic key art for "${universeId}" classroom adventure, child-friendly, detailed, vibrant, no text`
    console.log('🎨 Calling OpenAI API with prompt:', finalPrompt.slice(0, 100) + '...')
    
    try {
      const data = await generateImageWithRetry(finalPrompt, size)
      const b64 = data.data?.[0]?.b64_json
      
      if (!b64) {
        throw new Error("No image data returned from OpenAI")
      }

      // 3) Upload to Storage and cache
      const png = b64ToUint8Array(b64)
      const publicUrl = await uploadToStorage(universeId, png)
      
      await putCache(universeId, lang, publicUrl, "ai")
      const duration = Date.now() - startTime
      console.log('✅ Generated and cached AI image:', universeId, `(${duration}ms)`)

      return new Response(
        JSON.stringify({ 
          success: true,
          imageUrl: publicUrl, 
          from: "ai",
          cached: false,
          isAI: true,
          duration_ms: duration
        }), 
        {
          headers: CORS,
        }
      )
    } catch (aiError: any) {
      const errorMsg = aiError?.response?.data?.error?.message ?? aiError?.message ?? "unknown"
      
      // Handle organization verification 403 error gracefully
      if (errorMsg.includes("must be verified") || aiError?.status === 403) {
        const imageUrl = getFallbackImageUrl(universeId, subject)
        await putCache(universeId, lang, imageUrl, "fallback")
        const duration = Date.now() - startTime
        
        return json({
          success: true,
          imageUrl,
          from: "locked",
          reason: "openai_org_unverified",
          cached: false,
          isAI: false,
          duration_ms: duration
        })
      }
      
      // Re-throw for normal error handling
      throw aiError
    }

  } catch (error: any) {
    const duration = Date.now() - startTime
    console.error('generate-universe-image error:', error)

    // Enhanced fallback using already-parsed universeId (not from URL)
    const imageUrl = getFallbackImageUrl(universeId || 'default', subject)
    console.log('🔄 Using fallback image:', imageUrl, 'for universe:', universeId || 'default')

    // Cache fallback
    try {
      if (universeId) {
        await putCache(universeId, lang, imageUrl, "fallback")
      }
    } catch (cacheError) {
      console.error('Failed to cache fallback:', cacheError)
    }

    // Giv dev-venlig årsag i response (hjælper i Network-tab)
    const reason = (error as any)?.response?.data?.error?.message ?? (error as Error)?.message ?? "unknown";
    return json({ 
      success: true,
      imageUrl, 
      from: "fallback", 
      reason,
      cached: false,
      isAI: false,
      duration_ms: duration
    })
  }
})