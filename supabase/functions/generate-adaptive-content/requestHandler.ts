// @ts-nocheck
import { RequestBody, ErrorResponse } from './types.ts';
import { createErrorResponse } from './response.ts';

export function validateRequest(request: Request): RequestBody | ErrorResponse {
  if (request.method !== 'POST') {
    return {
      success: false,
      error: 'Method not allowed. Use POST.',
    };
  }

  return null; // Valid request, continue processing
}

export async function parseRequestBody(request: Request): Promise<RequestBody | ErrorResponse> {
  try {
    const body = await request.json();
    
    if (!body.subject || !body.skillArea || !body.userId) {
      return {
        success: false,
        error: 'Missing required fields: subject, skillArea, userId',
      };
    }

    return {
      subject: body.subject,
      skillArea: body.skillArea,
      difficultyLevel: body.difficultyLevel || 1,
      userId: body.userId,
      previousQuestions: body.previousQuestions || []
    };
  } catch (error) {
    return {
      success: false,
      error: 'Invalid JSON in request body',
      debug: error.message
    };
  }
}
