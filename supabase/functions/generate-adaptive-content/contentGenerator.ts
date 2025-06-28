
import { createGradeAlignedPrompt } from './promptBuilder.ts';

export async function generateContentWithOpenAI(requestData: any) {
  const openaiKey = Deno.env.get('OpenaiAPI') || Deno.env.get('OPENAI_API_KEY');
  
  if (!openaiKey) {
    throw new Error('OpenAI API key not found');
  }

  console.log('🔑 Using OpenAI API key:', {
    keySource: Deno.env.get('OpenaiAPI') ? 'OpenaiAPI' : 'OPENAI_API_KEY',
    keyLength: openaiKey.length,
    keyPreview: openaiKey.substring(0, 7) + '...' + openaiKey.slice(-4)
  });

  console.log('🤖 generateContentWithOpenAI called with:', {
    subject: requestData.subject,
    skillArea: requestData.skillArea,
    difficultyLevel: requestData.difficultyLevel,
    gradeLevel: requestData.gradeLevel,
    hasStandardsAlignment: !!requestData.standardsAlignment
  });

  try {
    const prompt = createGradeAlignedPrompt(requestData);

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
            content: 'You are an expert educational content creator. Generate age-appropriate, engaging questions for K-12 students. Always respond with valid JSON only.'
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
      const errorText = await response.text();
      console.error('❌ OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content;

    console.log('📝 Raw OpenAI response:', generatedText.substring(0, 200) + '...');

    // Parse JSON response
    const cleanedResponse = generatedText.replace(/```json\n?|\n?```/g, '').trim();
    const parsedContent = JSON.parse(cleanedResponse);

    // Validate required fields
    if (!parsedContent.question || !parsedContent.options || !Array.isArray(parsedContent.options)) {
      throw new Error('Invalid response format from OpenAI');
    }

    console.log('✅ OpenAI content generated successfully');
    return { ...parsedContent, prompt_used: prompt };

  } catch (error) {
    console.error('❌ OpenAI generation failed:', error);
    throw error;
  }
}

export async function generateContentWithDeepSeek(requestData: any) {
  const deepSeekKey = Deno.env.get('DEEPSEEK_API_KEY') || Deno.env.get('DeepSeek_API');
  
  if (!deepSeekKey) {
    throw new Error('DeepSeek API key not found');
  }

  console.log('🔑 Using DeepSeek API key:', {
    keySource: Deno.env.get('DEEPSEEK_API_KEY') ? 'DEEPSEEK_API_KEY' : 'DeepSeek_API',
    keyLength: deepSeekKey.length,
    keyPreview: deepSeekKey.substring(0, 7) + '...' + deepSeekKey.slice(-4)
  });

  console.log('🤖 generateContentWithDeepSeek called with:', {
    subject: requestData.subject,
    skillArea: requestData.skillArea,
    difficultyLevel: requestData.difficultyLevel,
    gradeLevel: requestData.gradeLevel,
    hasStandardsAlignment: !!requestData.standardsAlignment
  });

  try {
    const prompt = createGradeAlignedPrompt(requestData);

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
            content: 'You are an expert educational content creator. Generate age-appropriate, engaging questions for K-12 students. Always respond with valid JSON only.'
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
      const errorText = await response.text();
      console.error('❌ DeepSeek API error:', response.status, errorText);
      throw new Error(`DeepSeek API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content;

    console.log('📝 Raw DeepSeek response:', generatedText.substring(0, 200) + '...');

    // Parse JSON response
    const cleanedResponse = generatedText.replace(/```json\n?|\n?```/g, '').trim();
    const parsedContent = JSON.parse(cleanedResponse);

    // Validate required fields
    if (!parsedContent.question || !parsedContent.options || !Array.isArray(parsedContent.options)) {
      throw new Error('Invalid response format from DeepSeek');
    }

    console.log('✅ DeepSeek content generated successfully');
    return { ...parsedContent, prompt_used: prompt };

  } catch (error) {
    console.error('❌ DeepSeek generation failed:', error);
    throw error;
  }
}
