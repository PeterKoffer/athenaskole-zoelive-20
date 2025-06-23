import { GeneratedContent } from './types.ts';
import { createGradeAlignedPrompt, PromptConfig } from './promptBuilder.ts';
import { callDeepSeek } from './apiClient.ts';

export async function generateContentWithDeepSeek(requestData: any): Promise<GeneratedContent | null> {
  console.log('🤖 generateContentWithDeepSeek called with grade-level alignment:', requestData);
  
  const deepSeekApiKey = Deno.env.get('DEEPSEEK_API_KEY') || Deno.env.get('OpenaiAPI') || Deno.env.get('OPENAI_API_KEY');
  
  if (!deepSeekApiKey) {
    console.error('❌ No DeepSeek API key found');
    throw new Error('DeepSeek API key not configured');
  }

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
  console.log('📝 Using grade-aligned prompt for Grade', requestData.gradeLevel);

  const result = await callDeepSeek(deepSeekApiKey, prompt);
  
  if (!result.success) {
    console.error('❌ DeepSeek call failed:', result.error);
    throw new Error(result.error || 'DeepSeek call failed');
  }

  return result.data || null;
}

// Keep the old function for backward compatibility
export const generateContentWithOpenAI = generateContentWithDeepSeek;
