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

// Function to get fallback image URL
function getFallbackImageUrl(universeId?: string): string {
  if (universeId) {
    // Try to get specific universe image from storage
    return `${supabaseUrl}/storage/v1/object/public/universe-images/${universeId}.png`
  }
  // Generic fallback
  return `${supabaseUrl}/storage/v1/object/public/universe-images/default.png`
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { prompt, universeId, lang = 'en' } = await req.json()
    console.log('🎨 Image generation request:', { prompt: prompt?.slice(0, 50), universeId, lang })

    if (!prompt) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Missing prompt parameter" 
        }), 
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    // Check if cached image exists
    if (universeId) {
      const { data: cachedImage } = await supabase
        .from('universe_images')
        .select('image_url, is_ai_generated')
        .eq('universe_id', universeId)
        .eq('lang', lang)
        .maybeSingle()
      
      if (cachedImage) {
        console.log('✅ Returning cached image for universe:', universeId)
        return new Response(
          JSON.stringify({ 
            success: true, 
            imageUrl: cachedImage.image_url,
            prompt,
            cached: true,
            isAI: cachedImage.is_ai_generated
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
    
    if (!openAIApiKey) {
      console.error('OpenAI API key not found')
      const fallbackUrl = getFallbackImageUrl(universeId)
      
      // Store fallback in cache if universeId provided
      if (universeId) {
        await supabase.from('universe_images').upsert({
          universe_id: universeId,
          lang,
          image_url: fallbackUrl,
          is_ai_generated: false
        }, {
          onConflict: 'universe_id,lang'
        })
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          imageUrl: fallbackUrl,
          prompt,
          cached: false,
          isAI: false
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Generate image with OpenAI
    console.log('🎨 Calling OpenAI API with prompt:', prompt)
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt: prompt,
        size: '1024x1024',
        quality: 'high',
        n: 1,
        output_format: 'png'
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenAI API error:', response.status, errorText)
      const fallbackUrl = getFallbackImageUrl(universeId)
      
      // Store fallback in cache if universeId provided
      if (universeId) {
        await supabase.from('universe_images').upsert({
          universe_id: universeId,
          lang,
          image_url: fallbackUrl,
          is_ai_generated: false
        }, {
          onConflict: 'universe_id,lang'
        })
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          imageUrl: fallbackUrl,
          prompt,
          cached: false,
          isAI: false
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const data = await response.json()
    console.log('OpenAI response received:', { hasData: !!data, hasImage: !!data.data?.[0] })
    
    // gpt-image-1 returns base64 directly in the response
    if (data.data && data.data[0] && data.data[0].b64_json) {
      const imageUrl = `data:image/png;base64,${data.data[0].b64_json}`
      console.log('✅ Generated base64 image successfully')
      
      // Store AI-generated image in cache if universeId provided
      if (universeId) {
        await supabase.from('universe_images').upsert({
          universe_id: universeId,
          lang,
          image_url: imageUrl,
          is_ai_generated: true
        }, {
          onConflict: 'universe_id,lang'
        })
        console.log('💾 Cached AI image for universe:', universeId)
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          imageUrl,
          prompt,
          cached: false,
          isAI: true
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    } else {
      console.error('❌ Unexpected OpenAI response format:', data)
      const fallbackUrl = getFallbackImageUrl(universeId)
      
      // Store fallback in cache if universeId provided
      if (universeId) {
        await supabase.from('universe_images').upsert({
          universe_id: universeId,
          lang,
          image_url: fallbackUrl,
          is_ai_generated: false
        }, {
          onConflict: 'universe_id,lang'
        })
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          imageUrl: fallbackUrl,
          prompt,
          cached: false,
          isAI: false
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

  } catch (error: any) {
    console.error('Universe image generation error:', error)
    
    const fallbackUrl = getFallbackImageUrl()
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        imageUrl: fallbackUrl,
        prompt: '',
        cached: false,
        isAI: false,
        error: error?.message || 'Unknown error'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  }
})