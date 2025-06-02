
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { handleCors } from './cors.ts';
import { validateRequest, parseRequestBody } from './requestHandler.ts';
import { generateContentWithOpenAI } from './openai.ts';
import { validateGeneratedContent } from './validation.ts';
import { createErrorResponse, createSuccessResponse } from './response.ts';

serve(async (req) => {
  console.log('🚀 Edge function called');
  
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Validate request method
    const methodValidation = validateRequest(req);
    if (methodValidation) {
      return createErrorResponse(methodValidation.error, null, 405);
    }

    // Parse and validate request body
    const requestData = await parseRequestBody(req);
    if ('success' in requestData && !requestData.success) {
      return createErrorResponse(requestData.error, requestData.debug, 400);
    }

    console.log('📋 Request data validated:', {
      subject: requestData.subject,
      skillArea: requestData.skillArea,
      difficultyLevel: requestData.difficultyLevel,
      previousQuestions: requestData.previousQuestions?.length || 0
    });

    // Generate content using OpenAI
    const generatedContent = await generateContentWithOpenAI(requestData);
    if (!generatedContent) {
      return createErrorResponse('Failed to generate content from OpenAI');
    }

    // Validate the generated content
    const validation = validateGeneratedContent(generatedContent);
    if (!validation.hasQuestion || !validation.hasOptions || !validation.hasCorrect || !validation.hasExplanation) {
      console.error('❌ Content validation failed:', validation);
      return createErrorResponse('Generated content failed validation', validation);
    }

    console.log('✅ Content generated and validated successfully');
    return createSuccessResponse(generatedContent);

  } catch (error) {
    console.error('💥 Unexpected error:', error);
    return createErrorResponse('Internal server error', error.message);
  }
});
