
import { OpenAIResponse, GeneratedContent } from './types.ts';

export interface APICallResult {
  success: boolean;
  data?: GeneratedContent;
  error?: string;
  debug?: any;
}

export async function callOpenAI(apiKey: string, prompt: string): Promise<APICallResult> {
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
            content: 'You are an AI education assistant that creates grade-level appropriate questions aligned with educational standards. Always generate questions that match the requested grade level, subject, and educational standards. Use age-appropriate language and examples. Return only valid JSON with no formatting. CRITICAL: Make sure the "correct" field points to the INDEX of the actual correct answer in the options array.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
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

    return parseOpenAIResponse(openAIData);

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

export async function callDeepSeek(apiKey: string, prompt: string): Promise<APICallResult> {
  console.log('🤖 Making request to DeepSeek API...');
  console.log('🌐 Using endpoint: https://api.deepseek.com/v1/chat/completions');
  console.log('🎯 Using model: deepseek-chat');

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are an AI education assistant that creates grade-level appropriate questions aligned with educational standards. Always generate questions that match the requested grade level, subject, and educational standards. Use age-appropriate language and examples. Return only valid JSON with no formatting. CRITICAL: Make sure the "correct" field points to the INDEX of the actual correct answer in the options array.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    console.log('📡 DeepSeek Response Details:');
    console.log('  - Status:', response.status);
    console.log('  - Status Text:', response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ DeepSeek API error response:', errorText);
      
      let errorMessage = `DeepSeek API error: ${response.status} - ${response.statusText}`;
      
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.error?.message) {
          errorMessage = `DeepSeek API error: ${errorJson.error.message}`;
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

    const deepSeekData: OpenAIResponse = await response.json();
    console.log('✅ DeepSeek response received successfully');

    if (!deepSeekData.choices?.[0]?.message?.content) {
      console.error('❌ Invalid DeepSeek response structure:', deepSeekData);
      return {
        success: false,
        error: 'Invalid response structure from DeepSeek',
        debug: {
          response: deepSeekData,
          hasChoices: !!deepSeekData.choices,
          choicesLength: deepSeekData.choices?.length || 0,
          firstChoice: deepSeekData.choices?.[0] || null
        }
      };
    }

    return parseOpenAIResponse(deepSeekData);

  } catch (error) {
    console.error('💥 Unexpected error in DeepSeek call:', error);
    return {
      success: false,
      error: `DeepSeek request failed: ${error.message}`,
      debug: {
        errorName: error.name,
        errorMessage: error.message,
        errorStack: error.stack
      }
    };
  }
}

function parseOpenAIResponse(responseData: OpenAIResponse): APICallResult {
  const contentText = responseData.choices[0].message.content.trim();
  console.log('📄 Raw AI content (first 200 chars):', contentText.substring(0, 200));

  // Clean any potential markdown formatting
  const cleanContent = contentText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

  let generatedContent: GeneratedContent;
  try {
    generatedContent = JSON.parse(cleanContent);
    console.log('✅ Successfully parsed JSON content');
    
    // Validate that the correct answer index is valid
    if (generatedContent.correct >= generatedContent.options.length || generatedContent.correct < 0) {
      console.error('❌ Invalid correct answer index:', generatedContent.correct, 'for options:', generatedContent.options);
      throw new Error('Invalid correct answer index generated');
    }
    
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
}
