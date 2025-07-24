import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

if (!openaiApiKey) {
  console.error('OPENAI_API_KEY not found');
}

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Supabase credentials not found');
}

const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

function hashKey(obj: unknown): string {
  return btoa(JSON.stringify(obj));
}

const PROMPT_VERSION = 1;

function buildPrompt(req: any) {
  const system = `
Du er en dygtig pædagogisk designer (K-12).
Returner KUN valid JSON, der matcher skemaet:
{
  "title": string,
  "durationMinutes": number,
  "objectives": string[],
  "activities": { "type": string, "timebox": number, "instructions": string }[],
  "materials": string[],
  "reflectionPrompts": string[]
}
`;

  const user = `
[MODE]: ${req.mode}
[SUBJECT]: ${req.subject}
[GRADE]: ${req.gradeLevel}
[CURRICULUM]: ${req.curriculum}
[STUDENT_ABILITY]: ${req.studentProfile?.ability ?? 'normal'}
[LEARNING_STYLE]: ${req.studentProfile?.learningStyle ?? 'mixed'}

Lav en lektion (120-180 min for daily / 30-60 min for training) med aktiviteter, materialer og refleksionsspørgsmål.
`;

  return { system, user };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { 
      status: 405,
      headers: corsHeaders 
    });
  }

  try {
    const body = await req.json();
    const key = hashKey({ body, v: PROMPT_VERSION });

    console.log('Checking cache for key:', key);

    // Check cache first
    const { data: cached } = await supabase
      .from("ai_cache")
      .select("json")
      .eq("key", key)
      .maybeSingle();

    if (cached?.json) {
      console.log('Cache hit, returning cached content');
      return new Response(JSON.stringify(cached.json), { 
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json" 
        } 
      });
    }

    console.log('Cache miss, generating new content');

    const { system, user } = buildPrompt(body);

    // Make streaming request to OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.4,
        stream: true,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    if (!response.body) {
      throw new Error('No response body from OpenAI');
    }

    let fullContent = "";
    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        const reader = response.body!.getReader();
        const decoder = new TextDecoder();

        try {
          while (true) {
            const { done, value } = await reader.read();
            
            if (done) {
              console.log('Stream complete, saving to cache');
              controller.enqueue(encoder.encode(`event: done\ndata: end\n\n`));
              
              // Try to parse and cache the complete response
              try {
                const json = JSON.parse(fullContent);
                await supabase.from("ai_cache").upsert({ key, json });
                console.log('Content cached successfully');
              } catch (parseError) {
                console.error('Failed to parse or cache content:', parseError);
              }
              
              controller.close();
              break;
            }

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                
                if (data === '[DONE]') {
                  continue;
                }
                
                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.choices?.[0]?.delta?.content ?? "";
                  
                  if (content) {
                    fullContent += content;
                    controller.enqueue(encoder.encode(`event: chunk\ndata: ${content}\n\n`));
                  }
                } catch (parseError) {
                  // Skip malformed JSON chunks
                  continue;
                }
              }
            }
          }
        } catch (error) {
          console.error('Stream error:', error);
          controller.enqueue(encoder.encode(`event: error\ndata: ${error.message}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
      },
    });

  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      },
    });
  }
});