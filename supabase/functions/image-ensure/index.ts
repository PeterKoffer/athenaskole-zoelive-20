// @ts-nocheck
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function ok(body: any) {
  return new Response(JSON.stringify(body), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

function bad(message: string, status = 400) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { universeId, variant = 'cover', grade = 7, prompt } = await req.json()

    if (!universeId) {
      return bad('universeId is required')
    }

    console.log(`🚀 Fire-and-forget image generation for ${universeId}`)

    // Fire off the existing generate-universe-image function without waiting
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    
    // Don't await this - fire and forget
    fetch(`${supabaseUrl}/functions/v1/generate-universe-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')!}`,
      },
      body: JSON.stringify({
        universeId,
        imagePrompt: prompt || `Educational image for ${universeId}`,
        lang: 'en',
        width: grade <= 8 ? 1024 : 1280,
        height: grade <= 8 ? 1024 : 720,
      })
    }).catch(error => {
      console.error('Background image generation error:', error)
    })

    // Return immediately
    return ok({
      status: 'queued',
      universeId,
      variant,
      message: 'Image generation started in background'
    })

  } catch (error) {
    console.error('Error in image-ensure:', error)
    return bad('Internal server error', 500)
  }
})