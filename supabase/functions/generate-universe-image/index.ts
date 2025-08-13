// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { title, description, theme } = await req.json()

    if (!title && !description && !theme) {
      return new Response(
        JSON.stringify({ error: 'At least one of title, description, or theme is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // @ts-ignore
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured')
    }

    // Create a descriptive prompt for the learning universe
    const prompt = `Create a vibrant, educational illustration for a learning universe called "${title}". 
    ${description ? `Description: ${description}.` : ''}
    ${theme ? `Theme: ${theme}.` : ''}
    
    Style: Colorful, engaging, child-friendly, modern digital art. 
    Elements: Include educational symbols, books, science elements, and a sense of adventure and discovery.
    Mood: Inspiring, fun, and educational. Perfect for students aged 8-16.
    No text or letters in the image.`

    console.log('🎨 Generating image with prompt:', prompt)

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard',
        response_format: 'url'
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('OpenAI API error:', errorData)
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    
    if (!data.data || !data.data[0] || !data.data[0].url) {
      console.error('Unexpected OpenAI response format:', data)
      throw new Error('Invalid response format from OpenAI')
    }

    const imageUrl = data.data[0].url
    console.log('✅ Image generated successfully:', imageUrl)

    return new Response(
      JSON.stringify({ 
        success: true, 
        imageUrl: imageUrl,
        prompt: prompt
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: any) {
    console.error('Error generating image:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to generate image', 
        details: error.message 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})