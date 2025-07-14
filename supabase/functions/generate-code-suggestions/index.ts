
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CodeSuggestionRequest {
  prompt: string;
  context?: string;
  language?: string;
  includeSupabase?: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const { prompt, context = '', language = 'typescript', includeSupabase = false }: CodeSuggestionRequest = await req.json();

    if (!prompt) {
      throw new Error('Prompt is required');
    }

    console.log('🤖 Generating code suggestions for:', { prompt, language, includeSupabase });

    // Build system prompt based on requirements
    let systemPrompt = `You are an expert software developer and code assistant. Generate clean, well-documented code suggestions based on the user's request.

Guidelines:
- Write modern, best-practice code
- Include helpful comments
- Use TypeScript when applicable
- Follow established patterns and conventions
- Provide working, production-ready code
- Keep code concise but complete`;

    if (includeSupabase) {
      systemPrompt += `
- You specialize in Supabase integration
- Use proper Supabase client patterns
- Include proper error handling for database operations
- Use Row Level Security (RLS) best practices when relevant
- Provide both client-side and server-side examples when appropriate`;
    }

    const userPrompt = context 
      ? `Context: ${context}\n\nRequest: ${prompt}\n\nLanguage: ${language}`
      : `Request: ${prompt}\n\nLanguage: ${language}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.1, // Low temperature for more consistent code generation
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const suggestion = data.choices[0].message.content;

    console.log('✅ Generated code suggestion successfully');

    return new Response(JSON.stringify({ 
      success: true,
      suggestion,
      language,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('💥 Error in generate-code-suggestions function:', error);
    
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
