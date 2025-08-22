// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: cors });
  }

  try {
    // Validate API key first
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      console.error('❌ OPENAI_API_KEY not configured');
      return new Response(JSON.stringify({ error: 'OPENAI_API_KEY not set' }), { status: 500, headers: cors });
    }

    const body = await req.json();
    const payload = {
      systemPrompt: String(body?.systemPrompt ?? ''),
      userPrompt: String(body?.userPrompt ?? ''),
      model: String(body?.model ?? 'gpt-4o-mini'),
      temperature: Number(body?.temperature ?? 0.4),
    };

    if (!payload.systemPrompt || !payload.userPrompt) {
      return new Response(JSON.stringify({ error: 'systemPrompt and userPrompt are required' }), { status: 400, headers: cors });
    }

    console.log('🤖 Generating content with OpenAI:', { model: payload.model, temperature: payload.temperature });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: payload.model,
        messages: [
          { role: 'system', content: payload.systemPrompt },
          { role: 'user', content: payload.userPrompt }
        ],
        temperature: payload.temperature,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ OpenAI API error:', error);
      return new Response(JSON.stringify({ error: `OpenAI API error: ${response.status} ${error}` }), { status: 502, headers: cors });
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      return new Response(JSON.stringify({ error: 'No content received from OpenAI' }), { status: 422, headers: cors });
    }

    console.log('✅ Content generated successfully');
    
    return new Response(JSON.stringify({ content }), { status: 200, headers: cors });

  } catch (error: any) {
    console.error('❌ Content generation error:', error);
    return new Response(JSON.stringify({ error: String(error?.message ?? error) }), { status: 500, headers: cors });
  }
});