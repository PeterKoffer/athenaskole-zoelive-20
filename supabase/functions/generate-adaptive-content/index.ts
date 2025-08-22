// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { withCors, okCors, json } from '../_shared/cors.ts';

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return okCors(req);
  }

  try {
    // Validate API key first
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      console.error('❌ OPENAI_API_KEY not configured');
      return json(req, { error: 'OPENAI_API_KEY not set' }, { status: 500 });
    }

    const { systemPrompt, userPrompt, model = "gpt-4o-mini", temperature = 0.4 } = await req.json();

    console.log('🤖 Generating content with OpenAI:', { model, temperature });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ OpenAI API error:', error);
      return json(req, { error: `OpenAI API error: ${response.status} ${error}` }, { status: 502 });
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    console.log('✅ Content generated successfully');
    
    return json(req, { content });

  } catch (error: any) {
    console.error('❌ Content generation error:', error);
    return json(req, { error: String(error?.message ?? error) }, { status: 500 });
  }
});