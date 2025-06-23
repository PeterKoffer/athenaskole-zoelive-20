
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { generateContentWithDeepSeek } from './contentGenerator.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('🚀 Generate-adaptive-content function called at:', new Date().toISOString());
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const requestData = await req.json();
    console.log('📋 Request data received:', {
      subject: requestData.subject,
      skillArea: requestData.skillArea,
      difficultyLevel: requestData.difficultyLevel,
      userId: requestData.userId?.substring(0, 8) + '...',
      hasGradeLevel: !!requestData.gradeLevel,
      hasPreviousQuestions: Array.isArray(requestData.previousQuestions) && requestData.previousQuestions.length > 0
    });

    // Check for API key availability
    const deepSeekKey = Deno.env.get('DEEPSEEK_API_KEY');
    const openaiKey = Deno.env.get('OpenaiAPI');
    const openaiKeyAlt = Deno.env.get('OPENAI_API_KEY');
    
    console.log('🔑 API Key status:', {
      hasDeepSeekKey: !!deepSeekKey,
      hasOpenaiAPI: !!openaiKey,
      hasOpenaiKeyAlt: !!openaiKeyAlt,
      deepSeekKeyLength: deepSeekKey?.length || 0,
      openaiKeyLength: openaiKey?.length || 0,
      openaiKeyAltLength: openaiKeyAlt?.length || 0
    });

    if (!deepSeekKey && !openaiKey && !openaiKeyAlt) {
      console.error('❌ No API keys found in environment');
      return new Response(JSON.stringify({
        success: false,
        error: 'No API keys configured. Please add DEEPSEEK_API_KEY, OpenaiAPI, or OPENAI_API_KEY to your Supabase Edge Function Secrets.',
        debug: {
          availableEnvVars: Object.keys(Deno.env.toObject()).filter(key => key.includes('API') || key.includes('KEY'))
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      });
    }

    // Generate content using DeepSeek API
    console.log('🤖 Attempting AI content generation...');
    const generatedContent = await generateContentWithDeepSeek(requestData);
    
    if (!generatedContent) {
      console.error('❌ AI generation returned null/undefined');
      return new Response(JSON.stringify({
        success: false,
        error: 'AI content generation failed - no content returned',
        debug: {
          requestData: {
            subject: requestData.subject,
            skillArea: requestData.skillArea,
            difficultyLevel: requestData.difficultyLevel
          }
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      });
    }

    console.log('✅ Content generated successfully:', {
      hasQuestion: !!generatedContent.question,
      optionsCount: generatedContent.options?.length || 0,
      hasExplanation: !!generatedContent.explanation,
      correctIndex: generatedContent.correct
    });

    return new Response(JSON.stringify({
      success: true,
      generatedContent: generatedContent,
      debug: {
        timestamp: new Date().toISOString(),
        apiUsed: 'deepseek',
        generationTime: 'success'
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('💥 Unexpected error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Unknown error occurred',
      debug: {
        errorName: error.name,
        errorStack: error.stack,
        timestamp: new Date().toISOString()
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});
