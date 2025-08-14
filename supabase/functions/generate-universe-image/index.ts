// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { prompt } = await req.json()

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

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
    
    if (!openAIApiKey) {
      console.error('OpenAI API key not found')
      const fallbackUrl = `/placeholder.svg?height=400&width=600&text=${encodeURIComponent(prompt.slice(0, 20))}`
      return new Response(
        JSON.stringify({ 
          success: true, 
          imageUrl: fallbackUrl,
          prompt 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Generate image with OpenAI
    console.log('🎨 Calling OpenAI API with prompt:', prompt);
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
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      const fallbackUrl = `/placeholder.svg?height=400&width=600&text=${encodeURIComponent(prompt.slice(0, 20))}`
      return new Response(
        JSON.stringify({ 
          success: true, 
          imageUrl: fallbackUrl,
          prompt 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const data = await response.json()
    console.log('OpenAI response received:', { hasData: !!data, hasImage: !!data.data?.[0] });
    
    // gpt-image-1 returns base64 directly in the response
    if (data.data && data.data[0] && data.data[0].b64_json) {
      const imageUrl = `data:image/png;base64,${data.data[0].b64_json}`;
      console.log('✅ Generated base64 image successfully');
      return new Response(
        JSON.stringify({ 
          success: true, 
          imageUrl,
          prompt 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    } else {
      console.error('❌ Unexpected OpenAI response format:', data);
      const fallbackUrl = `/placeholder.svg?height=400&width=600&text=${encodeURIComponent(prompt.slice(0, 20))}`
      return new Response(
        JSON.stringify({ 
          success: true, 
          imageUrl: fallbackUrl,
          prompt 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }


  } catch (error: any) {
    console.error('Universe image generation error:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error',
        details: error?.message || 'Unknown error'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})