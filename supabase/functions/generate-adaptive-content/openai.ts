
import { OpenAIResponse, GeneratedContent } from './types.ts';

export async function generateContentWithOpenAI(requestData: any): Promise<GeneratedContent | null> {
  console.log('🤖 generateContentWithOpenAI called with:', requestData);
  
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY') || Deno.env.get('OpenaiAPI');
  
  if (!openaiApiKey) {
    console.error('❌ No OpenAI API key found');
    throw new Error('OpenAI API key not configured');
  }

  const prompt = createPrompt(requestData.previousQuestions || []);
  console.log('📝 Using prompt:', prompt);

  const result = await callOpenAI(openaiApiKey, prompt);
  
  if (!result.success) {
    console.error('❌ OpenAI call failed:', result.error);
    throw new Error(result.error || 'OpenAI call failed');
  }

  return result.data || null;
}

export async function callOpenAI(apiKey: string, prompt: string): Promise<{ success: boolean; data?: GeneratedContent; error?: string; debug?: any }> {
  console.log('🤖 Making request to OpenAI API...');
  console.log('🌐 Using endpoint: https://api.openai.com/v1/chat/completions');
  console.log('🎯 Using model: gpt-4o-mini');

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a math teacher creating fraction problems. Return only valid JSON with no formatting. Ensure each question is unique and different from previous ones.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 500,
      }),
    });

    console.log('📡 OpenAI Response Details:');
    console.log('  - Status:', response.status);
    console.log('  - Status Text:', response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenAI API error response:', errorText);
      
      let errorMessage = `OpenAI API error: ${response.status} - ${response.statusText}`;
      
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.error?.message) {
          errorMessage = `OpenAI API error: ${errorJson.error.message}`;
        }
      } catch (e) {
        console.log('Could not parse error as JSON');
      }
      
      return {
        success: false,
        error: errorMessage,
        debug: {
          status: response.status,
          statusText: response.statusText,
          errorResponse: errorText
        }
      };
    }

    const openAIData: OpenAIResponse = await response.json();
    console.log('✅ OpenAI response received successfully');

    if (!openAIData.choices?.[0]?.message?.content) {
      console.error('❌ Invalid OpenAI response structure:', openAIData);
      return {
        success: false,
        error: 'Invalid response structure from OpenAI',
        debug: {
          response: openAIData,
          hasChoices: !!openAIData.choices,
          choicesLength: openAIData.choices?.length || 0,
          firstChoice: openAIData.choices?.[0] || null
        }
      };
    }

    const contentText = openAIData.choices[0].message.content.trim();
    console.log('📄 Raw OpenAI content (first 200 chars):', contentText.substring(0, 200));

    // Clean any potential markdown formatting
    const cleanContent = contentText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    let generatedContent: GeneratedContent;
    try {
      generatedContent = JSON.parse(cleanContent);
      console.log('✅ Successfully parsed JSON content');
    } catch (parseError) {
      console.error('❌ JSON parse failed:', parseError.message);
      return {
        success: false,
        error: 'Failed to parse AI response as JSON',
        debug: {
          parseError: parseError.message,
          rawContent: contentText,
          cleanedContent: cleanContent
        }
      };
    }

    return { success: true, data: generatedContent };

  } catch (error) {
    console.error('💥 Unexpected error in OpenAI call:', error);
    return {
      success: false,
      error: `OpenAI request failed: ${error.message}`,
      debug: {
        errorName: error.name,
        errorMessage: error.message,
        errorStack: error.stack
      }
    };
  }
}

function createPrompt(previousQuestions: string[]): string {
  let prompt = `Generate a math question about fractions suitable for elementary students.

Return ONLY a valid JSON object with this exact structure:
{
  "question": "What is 1/2 + 1/4?",
  "options": ["1/6", "2/6", "3/4", "3/6"],
  "correct": 2,
  "explanation": "To add fractions, find a common denominator. 1/2 = 2/4, so 2/4 + 1/4 = 3/4",
  "learningObjectives": ["Adding fractions with different denominators", "Finding common denominators"]
}

Make sure:
- The question is about fractions (adding, subtracting, multiplying, or dividing)
- There are exactly 4 options
- The "correct" field is the index (0, 1, 2, or 3) of the correct answer
- The explanation clearly shows how to solve the problem
- Return ONLY the JSON, no markdown formatting or code blocks`;

  if (previousQuestions.length > 0) {
    prompt += `\n\nIMPORTANT: Do NOT generate any of these previous questions:\n${previousQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}

Create a completely different fraction problem that hasn't been asked before.`;
  }

  return prompt;
}
