// @ts-nocheck
import { GeneratedContent, ValidationResult } from './types.ts';

export function validateApiKey(apiKey: string | undefined): { isValid: boolean; error?: string } {
  console.log('🔑 API Key Check:');
  console.log('  - Key exists:', !!apiKey);
  console.log('  - Key starts with sk-:', apiKey ? apiKey.startsWith('sk-') : false);
  
  if (!apiKey) {
    console.error('❌ OpenaiAPI secret not found in environment');
    return {
      isValid: false,
      error: 'OpenAI API key not configured. Please check the OpenaiAPI secret in Supabase.'
    };
  }

  if (!apiKey.startsWith('sk-')) {
    console.error('❌ Invalid OpenAI API key format');
    return {
      isValid: false,
      error: 'Invalid OpenAI API key format. Key should start with "sk-"'
    };
  }

  console.log('🔑 OpenAI API key validated successfully');
  return { isValid: true };
}

export function validateContent(content: GeneratedContent): ValidationResult {
  const validation = {
    hasQuestion: !!content.question,
    hasOptions: Array.isArray(content.options),
    optionsLength: content.options?.length,
    hasCorrect: typeof content.correct === 'number',
    correctInRange: typeof content.correct === 'number' && content.correct >= 0 && content.correct <= 3,
    hasExplanation: !!content.explanation
  };

  console.log('🔍 Content validation:', validation);
  return validation;
}

export function isValidContent(validation: ValidationResult): boolean {
  return validation.hasQuestion && 
         validation.hasOptions && 
         validation.optionsLength === 4 && 
         validation.hasCorrect && 
         validation.correctInRange && 
         validation.hasExplanation;
}
