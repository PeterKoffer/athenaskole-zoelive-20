// @ts-nocheck
import { corsHeaders } from './cors.ts';
import { ErrorResponse, SuccessResponse } from './types.ts';

export function createErrorResponse(error: string, debug?: any, status: number = 500): Response {
  const response: ErrorResponse = {
    success: false,
    error,
    debug
  };

  return new Response(
    JSON.stringify(response),
    { 
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
}

export function createSuccessResponse(generatedContent: any): Response {
  const response: SuccessResponse = {
    success: true,
    generatedContent
  };

  console.log('🎯 Final content prepared successfully');
  console.log('📤 Returning success response');

  return new Response(
    JSON.stringify(response),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
}
