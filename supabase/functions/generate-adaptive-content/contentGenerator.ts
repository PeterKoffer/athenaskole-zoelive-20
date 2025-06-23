import { GeneratedContent } from './types.ts';
import { createGradeAlignedPrompt, PromptConfig } from './promptBuilder.ts';
import { callOpenAI } from './apiClient.ts';

export async function generateContentWithOpenAI(requestData: any): Promise<GeneratedContent | null> {
  console.log('🤖 generateContentWithOpenAI called with:', {
    subject: requestData.subject,
    skillArea: requestData.skillArea,
    difficultyLevel: requestData.difficultyLevel,
    gradeLevel: requestData.gradeLevel,
    hasStandardsAlignment: !!requestData.standardsAlignment
  });
  
  // Use the OpenAI API key that was just provided
  const openaiApiKey = Deno.env.get('OpenaiAPI') || Deno.env.get('OPENAI_API_KEY');
  
  if (!openaiApiKey) {
    console.error('❌ No OpenAI API key found in environment variables');
    throw new Error('OpenAI API key not configured - please add OpenaiAPI to your Supabase Edge Function Secrets');
  }

  console.log('🔑 Using OpenAI API key:', {
    keySource: Deno.env.get('OpenaiAPI') ? 'OpenaiAPI' : 'OPENAI_API_KEY',
    keyLength: openaiApiKey.length,
    keyPreview: openaiApiKey.substring(0, 8) + '...' + openaiApiKey.substring(openaiApiKey.length - 4)
  });

  const promptConfig: PromptConfig = {
    subject: requestData.subject,
    skillArea: requestData.skillArea,
    difficultyLevel: requestData.difficultyLevel,
    previousQuestions: requestData.previousQuestions || [],
    diversityPrompt: requestData.diversityPrompt,
    sessionId: requestData.sessionId,
    gradeLevel: requestData.gradeLevel,
    standardsAlignment: requestData.standardsAlignment
  };

  const prompt = createGradeAlignedPrompt(promptConfig);
  console.log('📝 Generated prompt for Grade', requestData.gradeLevel || 'default');

  const result = await callOpenAI(openaiApiKey, prompt);
  
  if (!result.success) {
    console.error('❌ OpenAI call failed:', result.error);
    throw new Error(`OpenAI API error: ${result.error}`);
  }

  console.log('✅ OpenAI generation successful');
  return result.data || null;
}

// Keep the DeepSeek function as backup
export async function generateContentWithDeepSeek(requestData: any): Promise<GeneratedContent | null> {
  console.log('🤖 generateContentWithDeepSeek called with:', {
    subject: requestData.subject,
    skillArea: requestData.skillArea,
    difficultyLevel: requestData.difficultyLevel,
    gradeLevel: requestData.gradeLevel,
    hasStandardsAlignment: !!requestData.standardsAlignment
  });
  
  // Try different API key environment variables in order of preference
  const deepSeekApiKey = Deno.env.get('DEEPSEEK_API_KEY') || 
                        Deno.env.get('DeepSeek_API');
  
  if (!deepSeekApiKey) {
    console.error('❌ No DeepSeek API key found in environment variables');
    throw new Error('DeepSeek API key not configured - please add DEEPSEEK_API_KEY to your Supabase Edge Function Secrets');
  }

  console.log('🔑 Using DeepSeek API key:', {
    keySource: Deno.env.get('DEEPSEEK_API_KEY') ? 'DEEPSEEK_API_KEY' : 'DeepSeek_API',
    keyLength: deepSeekApiKey.length,
    keyPreview: deepSeekApiKey.substring(0, 8) + '...' + deepSeekApiKey.substring(deepSeekApiKey.length - 4)
  });

  const promptConfig: PromptConfig = {
    subject: requestData.subject,
    skillArea: requestData.skillArea,
    difficultyLevel: requestData.difficultyLevel,
    previousQuestions: requestData.previousQuestions || [],
    diversityPrompt: requestData.diversityPrompt,
    sessionId: requestData.sessionId,
    gradeLevel: requestData.gradeLevel,
    standardsAlignment: requestData.standardsAlignment
  };

  const prompt = createGradeAlignedPrompt(promptConfig);
  console.log('📝 Generated prompt for Grade', requestData.gradeLevel || 'default');

  const { callDeepSeek } = await import('./apiClient.ts');
  const result = await callDeepSeek(deepSeekApiKey, prompt);
  
  if (!result.success) {
    console.error('❌ DeepSeek call failed:', result.error);
    throw new Error(`DeepSeek API error: ${result.error}`);
  }

  console.log('✅ DeepSeek generation successful');
  return result.data || null;
}

// Keep the old function for backward compatibility
export const generateContentWithOpenAI = generateContentWithOpenAI;
