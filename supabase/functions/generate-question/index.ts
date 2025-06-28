
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { QuestionGenerationRequest, GeneratedQuestion } from './types.ts';
import { generateQuestionWithOpenAI } from './openaiClient.ts';
import { validateQuestionStructure } from './validator.ts';
import { validateMathAnswer } from './mathValidator.ts';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log(`🚀 Edge function called at ${new Date().toISOString()}`);
  console.log(`📊 Request method: ${req.method}`);
  console.log(`🔑 OpenAI API Key available: ${!!openAIApiKey}`);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody: QuestionGenerationRequest = await req.json();
    console.log(`📥 Request body:`, requestBody);

    const { 
      subject, 
      skillArea, 
      difficultyLevel, 
      userId, 
      questionIndex = 0,
      promptVariation = 'basic',
      specificContext = ''
    } = requestBody;

    console.log(`🎯 Generating ${promptVariation} question for ${subject}/${skillArea} (Level ${difficultyLevel})`);

    if (!openAIApiKey) {
      console.error('❌ OpenAI API key not found in environment');
      return new Response(JSON.stringify({ 
        error: 'OpenAI API key not configured',
        success: false 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Generate question using OpenAI
    let questionData = await generateQuestionWithOpenAI(requestBody, openAIApiKey);

    // Validate the response structure
    if (!validateQuestionStructure(questionData)) {
      throw new Error('Invalid question structure from AI');
    }

    // Validate math for specific problem types
    const mathValidation = validateMathAnswer(questionData, skillArea);
    if (!mathValidation.isValid) {
      console.log(`🔧 Applying math correction...`);
      if (mathValidation.correctedIndex !== undefined) {
        questionData.correct = mathValidation.correctedIndex;
        console.log(`✅ Corrected answer index to: ${questionData.correct}`);
      } else {
        console.error(`❌ Math validation failed: ${mathValidation.error}`);
        throw new Error(mathValidation.error || 'Math validation failed');
      }
    }

    console.log(`✅ Generated valid question: ${questionData.question.substring(0, 50)}...`);
    console.log(`🎯 Final correct answer index: ${questionData.correct} -> "${questionData.options[questionData.correct]}"`);

    return new Response(JSON.stringify(questionData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Error in generate-question function:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
