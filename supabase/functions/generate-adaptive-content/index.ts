
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { generateContentWithTrainingGroundPrompt, generateContentWithOpenAI, generateContentWithDeepSeek } from './contentGenerator.ts';
import { createDailyProgramPrompt } from '../prompts/index.ts';

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
      type: requestData.type,
      subject: requestData.subject,
      skillArea: requestData.skillArea,
      difficultyLevel: requestData.difficultyLevel,
      hasPrompt: !!requestData.prompt,
      userId: requestData.userId?.substring(0, 8) + '...',
      hasGradeLevel: !!requestData.gradeLevel,
      hasPreviousQuestions: Array.isArray(requestData.previousQuestions) && requestData.previousQuestions.length > 0
    });

    // Check for API key availability - prioritize OpenAI
    const openaiKey = Deno.env.get('OpenaiAPI') || Deno.env.get('OPENAI_API_KEY');
    const deepSeekKey = Deno.env.get('DEEPSEEK_API_KEY') || Deno.env.get('DeepSeek_API');
    
    console.log('🔑 API Key status:', {
      hasOpenaiKey: !!openaiKey,
      hasDeepSeekKey: !!deepSeekKey,
      openaiKeyLength: openaiKey?.length || 0,
      deepSeekKeyLength: deepSeekKey?.length || 0
    });

    if (!openaiKey && !deepSeekKey) {
      console.error('❌ No API keys found in environment');
      return new Response(JSON.stringify({
        success: false,
        error: 'No API keys configured. Please add OpenaiAPI or DEEPSEEK_API_KEY to your Supabase Edge Function Secrets.',
        debug: {
          availableEnvVars: Object.keys(Deno.env.toObject()).filter(key => key.includes('API') || key.includes('KEY'))
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      });
    }

    // Handle universe generation requests
    if (requestData.type === 'universe_generation') {
      console.log('🌌 Processing universe generation request');
      
      try {
        const universeContent = await generateUniverseContent(requestData, openaiKey, deepSeekKey);
        
        return new Response(JSON.stringify({
          success: true,
          generatedContent: universeContent,
          debug: {
            timestamp: new Date().toISOString(),
            type: 'universe_generation'
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } catch (error) {
        console.error('❌ Universe generation failed:', error);
        
        return new Response(JSON.stringify({
          success: false,
          error: `Universe generation failed: ${error.message}`,
          debug: {
            errorName: error.name,
            timestamp: new Date().toISOString()
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        });
      }
    }

    // Handle regular content generation (existing logic)
    let generatedContent = null;
    let apiUsed = 'none';

    if (openaiKey) {
      try {
        console.log('🤖 Attempting OpenAI content generation with new prompt...');
        generatedContent = await generateContentWithTrainingGroundPrompt(requestData);
        apiUsed = 'openai';
      } catch (error) {
        console.error('❌ OpenAI generation failed:', error);
        
        // Fallback to DeepSeek if available
        if (deepSeekKey) {
          console.log('🔄 Falling back to DeepSeek...');
          try {
            generatedContent = await generateContentWithDeepSeek(requestData);
            apiUsed = 'deepseek-fallback';
          } catch (deepSeekError) {
            console.error('❌ DeepSeek fallback also failed:', deepSeekError);
            throw error; // Throw original OpenAI error
          }
        } else {
          throw error;
        }
      }
    } else if (deepSeekKey) {
      console.log('🤖 Attempting DeepSeek content generation...');
      generatedContent = await generateContentWithDeepSeek(requestData);
      apiUsed = 'deepseek';
    }
    
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
          },
          apiUsed
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
      correctIndex: generatedContent.correct,
      apiUsed
    });

    return new Response(JSON.stringify({
      success: true,
      generatedContent: generatedContent,
      debug: {
        timestamp: new Date().toISOString(),
        apiUsed,
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

async function generateUniverseContent(requestData: any, openaiKey?: string, deepSeekKey?: string) {
  const prompt = createDailyProgramPrompt(
    requestData.prompt,
    requestData.gradeLevel || 4,
    requestData.learningStyle || 'mixed'
  );

  if (openaiKey) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert educational content creator. Generate engaging learning universes for students. Always return valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 800
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Clean and parse JSON
    const cleanedContent = content.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleanedContent);
  }
  
  if (deepSeekKey) {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${deepSeekKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are an expert educational content creator. Generate engaging learning universes for students. Always return valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 800
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Clean and parse JSON
    const cleanedContent = content.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleanedContent);
  }
  
  throw new Error('No API keys available');
}
