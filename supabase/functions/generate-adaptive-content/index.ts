
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { handleCors } from './cors.ts';
import { RequestBody, GeneratedContent } from './types.ts';
import { validateApiKey, validateContent, isValidContent } from './validation.ts';
import { createPrompt } from './prompt.ts';
import { callOpenAI } from './openai.ts';
import { createErrorResponse, createSuccessResponse } from './response.ts';

serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  console.log('🚀 AI Content Generation Function Called');

  try {
    const requestBody: RequestBody = await req.json();
    console.log('📥 Request received:', JSON.stringify(requestBody, null, 2));

    const { subject, skillArea, difficultyLevel, previousQuestions = [] } = requestBody;

    // Validate API key
    const openAIApiKey = Deno.env.get('OpenaiAPI');
    const keyValidation = validateApiKey(openAIApiKey);
    
    if (!keyValidation.isValid) {
      return createErrorResponse(keyValidation.error!, {
        secretName: 'OpenaiAPI',
        availableVars: Object.keys(Deno.env.toObject())
      });
    }

    console.log('  - Previous questions count:', previousQuestions.length);

    // Create prompt
    const prompt = createPrompt(previousQuestions);

    // Call OpenAI
    const openAIResult = await callOpenAI(openAIApiKey!, prompt);
    
    if (!openAIResult.success) {
      return createErrorResponse(openAIResult.error!, openAIResult.debug);
    }

    const generatedContent = openAIResult.data!;

    // Validate the generated content
    const validation = validateContent(generatedContent);

    if (!isValidContent(validation)) {
      console.error('❌ Content validation failed:', generatedContent);
      return createErrorResponse('Generated content failed validation', {
        content: generatedContent,
        validation: validation
      });
    }

    // Ensure all required fields with defaults
    const finalContent: GeneratedContent = {
      question: generatedContent.question,
      options: generatedContent.options,
      correct: Number(generatedContent.correct),
      explanation: generatedContent.explanation,
      learningObjectives: generatedContent.learningObjectives || ['Fraction arithmetic'],
      estimatedTime: 30
    };

    return createSuccessResponse(finalContent);

  } catch (error) {
    console.error('💥 Unexpected error in function:', error);
    
    return createErrorResponse(`Server error: ${error.message}`, {
      errorName: error.name,
      errorMessage: error.message,
      errorStack: error.stack
    });
  }
});
