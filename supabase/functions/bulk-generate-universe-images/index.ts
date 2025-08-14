// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Initialize clients
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

function b64ToUint8Array(b64: string) {
  const bin = atob(b64)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return bytes
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

async function alreadyCached(universeId: string, lang: string) {
  const { data } = await supabase
    .from("universe_images")
    .select("id")
    .eq("universe_id", universeId)
    .eq("lang", lang)
    .maybeSingle()
  return !!data
}

async function putCache(universeId: string, lang: string, imageUrl: string, source: "ai" | "fallback") {
  await supabase.from("universe_images").upsert({ 
    universe_id: universeId, 
    lang, 
    image_url: imageUrl, 
    source 
  })
}

async function* fetchUniverseBatches(batchSize: number) {
  let page = 0
  while (true) {
    // Try to find universes from the user's content
    const { data, error } = await supabase
      .from("ai_cache")
      .select("key, json")
      .like("key", "universe-%")
      .order("key", { ascending: true })
      .range(page * batchSize, page * batchSize + batchSize - 1)

    if (error) {
      console.error("Error fetching universe batches:", error)
      break
    }
    
    if (!data || data.length === 0) break

    // Transform cache data to universe-like objects
    const universes = data.map(item => {
      try {
        const universeData = item.json
        return {
          id: item.key.replace('universe-', ''),
          title: universeData.title || universeData.universeName || `Universe ${item.key}`,
          description: universeData.description || universeData.summary || '',
          lang: 'en',
          image_prompt: universeData.imagePrompt || null,
          image_status: null,
          image_url: null
        }
      } catch (e) {
        console.error("Error parsing universe data:", e)
        return null
      }
    }).filter(Boolean)

    if (universes.length === 0) break
    
    yield universes
    page++
  }
}

async function generateOne(u: any, size = "1024x1024") {
  const lang = u.lang || "en"
  
  // Skip if already cached
  if (await alreadyCached(u.id, lang)) {
    return { id: u.id, status: "skipped" as const }
  }

  try {
    console.log(`🎨 Generating image for universe: ${u.id}`)
    
    const prompt = u.image_prompt || 
      `Cinematic key art for "${u.title || u.id}" classroom adventure, child-friendly, vibrant, high detail, no text. Educational theme with books, science elements, discovery and adventure. Perfect for students aged 8-16.`

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
    
    if (!openAIApiKey) {
      throw new Error("OpenAI API key not available")
    }

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
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const b64 = data.data?.[0]?.b64_json
    
    if (!b64) {
      throw new Error("No image data returned")
    }

    const png = b64ToUint8Array(b64)
    const publicUrl = await uploadToStorage(u.id, png)

    await putCache(u.id, lang, publicUrl, "ai")
    console.log(`✅ Generated AI image for ${u.id}: ${publicUrl}`)

    return { id: u.id, status: "ok" as const, url: publicUrl }
    
  } catch (e) {
    console.error("AI generation failed for", u.id, ":", e)

    // Fallback chain
    const exact = storagePublicUrl(`universe-images/${u.id}.png`)
    const fallback = storagePublicUrl("universe-images/default.png")
    const url = exact

    await putCache(u.id, lang, url, "fallback")
    console.log(`📦 Using fallback for ${u.id}: ${url}`)

    return { id: u.id, status: "fallback" as const, url }
  }
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const batchSize = Number(url.searchParams.get("batchSize")) || 20
    const maxBatches = Number(url.searchParams.get("maxBatches")) || 999
    const size = url.searchParams.get("size") || "1024x1024"

    console.log(`🚀 Starting bulk generation: batchSize=${batchSize}, maxBatches=${maxBatches}, size=${size}`)

    // Create job record
    const { data: job, error: jobError } = await supabase
      .from("universe_image_jobs")
      .insert({ notes: `batchSize=${batchSize}, size=${size}` })
      .select()
      .single()

    if (jobError) {
      console.error("Failed to create job:", jobError)
      return new Response(
        JSON.stringify({ error: "Failed to create job record" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let total = 0, success = 0, failed = 0, skipped = 0, batches = 0

    for await (const batch of fetchUniverseBatches(batchSize)) {
      batches++
      if (batches > maxBatches) {
        console.log(`⏹️ Reached max batches limit: ${maxBatches}`)
        break
      }

      console.log(`📦 Processing batch ${batches} with ${batch.length} universes`)

      // Process with limited concurrency
      const concurrency = 5
      const queue: Promise<any>[] = []
      
      for (const u of batch) {
        const p = generateOne(u, size)
          .then((r) => {
            if (r.status === "ok") success++
            else if (r.status === "fallback") failed++
            else skipped++
            total++
            
            if (total % 10 === 0) {
              console.log(`📊 Progress: ${total} processed (${success} success, ${failed} failed, ${skipped} skipped)`)
            }
          })
          .catch((e) => {
            console.error("generateOne hard fail", u.id, e)
            failed++
            total++
          })
        
        queue.push(p)
        
        if (queue.length >= concurrency) {
          await Promise.all(queue.splice(0, queue.length))
        }
      }
      
      if (queue.length) {
        await Promise.all(queue)
      }
    }

    // Update job record
    await supabase
      .from("universe_image_jobs")
      .update({ 
        finished_at: new Date().toISOString(), 
        total, 
        success, 
        failed, 
        skipped,
        notes: `Completed: ${total} total, ${success} success, ${failed} failed, ${skipped} skipped`
      })
      .eq("id", job.id)

    const result = { 
      jobId: job.id,
      total, 
      success, 
      failed, 
      skipped, 
      batches,
      message: `Bulk generation completed: ${success}/${total} successful`
    }

    console.log('🎉 Bulk generation completed:', result)

    return new Response(
      JSON.stringify(result, null, 2),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )

  } catch (error: any) {
    console.error('Bulk generation error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: "Bulk generation failed", 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    )
  }
})