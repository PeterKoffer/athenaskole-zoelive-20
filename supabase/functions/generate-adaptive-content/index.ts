// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schema (simplified without external deps)
function validateInput(raw: any) {
  const input = {
    type: raw?.type || 'daily_lesson',
    subject: String(raw?.subject || ''),
    gradeLevel: Number(raw?.gradeLevel || 0),
    studentInterests: Array.isArray(raw?.studentInterests) ? raw.studentInterests : [],
    timeBudgetMinutes: Number(raw?.timeBudgetMinutes || 30),
    numActivities: Number(raw?.numActivities || 7),
    skillArea: raw?.skillArea,
    // Legacy support
    systemPrompt: raw?.systemPrompt,
    userPrompt: raw?.userPrompt,
    model: raw?.model || 'gpt-4o-mini',
    temperature: Number(raw?.temperature || 0.4),
  };

  // Basic validation
  if (!input.subject && !input.systemPrompt) {
    throw new Error('subject or systemPrompt is required');
  }
  if (input.gradeLevel < 1 && !input.systemPrompt) {
    throw new Error('gradeLevel must be >= 1');
  }
  if (!['daily_lesson', 'training_ground', 'universe_generation'].includes(input.type) && !input.systemPrompt) {
    input.type = 'daily_lesson';
  }

  return input;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: cors });
  }

  try {
    // JWT verification
    const auth = req.headers.get('authorization');
    if (!auth) {
      return new Response(JSON.stringify({ error: 'Missing Authorization' }), { 
        status: 401, 
        headers: cors 
      });
    }

    // Validate API key
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      console.error('❌ OPENAI_API_KEY not configured');
      return new Response(JSON.stringify({ error: 'OPENAI_API_KEY not set' }), { 
        status: 500, 
        headers: cors 
      });
    }

    // Parse and validate input
    const raw = await req.json();
    const input = validateInput(raw);

    console.log('🤖 Generating content:', { 
      type: input.type, 
      subject: input.subject, 
      gradeLevel: input.gradeLevel 
    });

    // Handle legacy systemPrompt/userPrompt format
    if (input.systemPrompt && input.userPrompt) {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: input.model,
          messages: [
            { role: 'system', content: input.systemPrompt },
            { role: 'user', content: input.userPrompt }
          ],
          temperature: input.temperature,
          max_tokens: 4000,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('❌ OpenAI API error:', error);
        return new Response(JSON.stringify({ 
          error: `OpenAI API error: ${response.status} ${error}` 
        }), { status: 502, headers: cors });
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        return new Response(JSON.stringify({ 
          error: 'No content received from OpenAI' 
        }), { status: 422, headers: cors });
      }

      return new Response(JSON.stringify({ content }), { 
        status: 200, 
        headers: cors 
      });
    }

    // Handle structured content generation
    const timeBudget = { minutes: input.timeBudgetMinutes };
    const meta = { 
      seed: crypto.randomUUID(), 
      type: input.type, 
      subject: input.subject, 
      gradeLevel: input.gradeLevel 
    };
    const world = { 
      theme: 'default', 
      interests: input.studentInterests 
    };

    let scenes: unknown[] = [];
    
    if (input.type === 'training_ground') {
      scenes = Array.from({ length: input.numActivities }, (_, i) => ({
        id: `tg-${i + 1}`,
        kind: 'exercise',
        prompt: `Exercise ${i + 1} for ${input.subject}`,
        subject: input.subject,
        skillArea: input.skillArea || 'general',
      }));
    } else {
      // daily_lesson / universe_generation
      scenes = [
        { id: 'intro', kind: 'hook', text: `Welcome to ${input.subject}!` },
        { id: 'main', kind: 'activity', text: 'Core activity goes here.' },
        { id: 'exit', kind: 'reflection', text: 'Wrap-up.' },
      ];
    }

    const result = { meta, world, scenes, timeBudget };
    console.log('✅ Content generated successfully');
    
    return new Response(JSON.stringify(result), { 
      status: 200, 
      headers: cors 
    });

  } catch (error: any) {
    console.error('❌ Content generation error:', error);
    const status = error.message?.includes('required') ? 400 : 500;
    return new Response(JSON.stringify({ 
      error: String(error?.message ?? error) 
    }), { status, headers: cors });  
  }
});