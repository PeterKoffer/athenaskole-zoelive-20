
import { GeneratedContent } from './types.ts';
import { createGradeAlignedPrompt, PromptConfig } from './promptBuilder.ts';
import { callOpenAI } from './apiClient.ts';

export async function generateContentWithOpenAI(requestData: any): Promise<GeneratedContent | null> {
  console.log('🤖 generateContentWithOpenAI called with grade-level alignment:', requestData);
  
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY') || Deno.env.get('OpenaiAPI');
  
  if (!openaiApiKey) {
    console.error('❌ No OpenAI API key found');
    throw new Error('OpenAI API key not configured');
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

  const result = await callOpenAI(openaiApiKey, prompt);
  
  if (!result.success) {
    console.error('❌ OpenAI call failed:', result.error);
    throw new Error(result.error || 'OpenAI call failed');
  }

  return result.data || null;
}
