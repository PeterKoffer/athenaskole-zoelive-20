import { OpenAIResponse, GeneratedContent } from './types.ts';

export async function generateContentWithOpenAI(requestData: any): Promise<GeneratedContent | null> {
  console.log('🤖 generateContentWithOpenAI called with enhanced diversity:', requestData);
  
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY') || Deno.env.get('OpenaiAPI');
  
  if (!openaiApiKey) {
    console.error('❌ No OpenAI API key found');
    throw new Error('OpenAI API key not configured');
  }

  const prompt = createEnhancedPrompt(
    requestData.subject, 
    requestData.skillArea, 
    requestData.difficultyLevel, 
    requestData.previousQuestions || [],
    requestData.diversityPrompt,
    requestData.sessionId
  );
  console.log('📝 Using enhanced diversity prompt for subject:', requestData.subject);

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
            content: 'You are an AI education assistant that creates questions for specific subjects. Always generate questions that match the requested subject and skill area. Return only valid JSON with no formatting. CRITICAL: Make sure the "correct" field points to the INDEX of the actual correct answer in the options array.'
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

    const contentText = openAIData.choices[0].message.content.trim();
    console.log('📄 Raw OpenAI content (first 200 chars):', contentText.substring(0, 200));

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

function createEnhancedPrompt(
  subject: string, 
  skillArea: string, 
  difficultyLevel: number, 
  previousQuestions: string[],
  diversityPrompt?: string,
  sessionId?: number
): string {
  console.log('🎯 Creating enhanced diversity prompt for subject:', subject, 'skillArea:', skillArea);
  
  let basePrompt = '';
  
  // Generate subject-specific prompts with maximum creativity
  if (subject === 'mathematics') {
    basePrompt = `Generate a COMPLETELY UNIQUE mathematics question about ${skillArea} for elementary students (difficulty ${difficultyLevel}).

CRITICAL REQUIREMENTS:
- Create a question that has NEVER been asked before
- Use different numbers, scenarios, and contexts than any previous questions
- ${diversityPrompt || 'Be extremely creative and unique'}
- Make the math calculation absolutely correct
- Use fresh examples and contexts

Session ID: ${sessionId} - This must be a completely unique question for this session.

Example structure (but create something completely different):
{
  "question": "A farmer has 23 apple trees and 17 pear trees. How many fruit trees does the farmer have in total?",
  "options": ["40", "39", "41", "38"],
  "correct": 0,
  "explanation": "To find the total, we add: 23 + 17 = 40 fruit trees",
  "learningObjectives": ["Addition", "Word problems"]
}

IMPORTANT: 
- Use completely different numbers than any example
- Create a unique scenario or context
- Verify your math is correct
- Make sure the correct answer is properly indexed
- Return ONLY valid JSON, no markdown`;

  } else if (subject === 'english') {
    basePrompt = `Generate a COMPLETELY UNIQUE English reading comprehension question for elementary students.

CRITICAL REQUIREMENTS:
- Create content that is absolutely different from any previous questions
- Use unique sentences, scenarios, and vocabulary
- ${diversityPrompt || 'Be extremely creative with contexts and examples'}
- Focus on reading comprehension skills

Session ID: ${sessionId} - This must be completely original content.

Example structure (but create something totally different):
{
  "question": "Read this sentence: 'The curious kitten climbed the tall oak tree to watch the sunset.' What did the kitten do?",
  "options": ["slept", "climbed", "jumped", "ran"],
  "correct": 1,
  "explanation": "The sentence states that the kitten 'climbed the tall oak tree'",
  "learningObjectives": ["Reading comprehension", "Verb identification"]
}

IMPORTANT:
- Create a completely unique sentence with different subjects, actions, and objects
- Use fresh vocabulary and scenarios
- Ensure clear reading comprehension focus
- Return ONLY valid JSON, no markdown`;

  } else if (subject === 'science') {
    basePrompt = `Generate a COMPLETELY UNIQUE science question for elementary discovery learning.

CRITICAL REQUIREMENTS:
- Create a question about a different scientific concept or phenomenon
- Use unique examples and scenarios not used before
- ${diversityPrompt || 'Explore diverse scientific topics and creative examples'}
- Focus on discovery and understanding

Session ID: ${sessionId} - This must be original scientific content.

Example structure (but create something entirely different):
{
  "question": "Why do leaves change color in autumn?",
  "options": ["They get cold", "Chlorophyll breaks down", "They get tired", "The sun is weaker"],
  "correct": 1,
  "explanation": "Leaves change color because chlorophyll breaks down in autumn, revealing other pigments",
  "learningObjectives": ["Plant biology", "Seasonal changes"]
}

IMPORTANT:
- Choose a completely different scientific topic
- Use unique examples and scenarios
- Provide educational scientific explanations
- Return ONLY valid JSON, no markdown`;

  } else {
    basePrompt = `Generate a COMPLETELY UNIQUE educational question for ${subject} - ${skillArea}.

Session ID: ${sessionId} - Create absolutely original content.
${diversityPrompt || 'Be maximally creative and unique'}

Return ONLY valid JSON with question, options (4 choices), correct (index), explanation, and learningObjectives.`;
  }

  // Add anti-repetition instructions
  if (previousQuestions.length > 0) {
    basePrompt += `\n\nCRITICAL: You MUST NOT create any question similar to these previous ones:
${previousQuestions.slice(0, 20).map((q, i) => `${i + 1}. ${q}`).join('\n')}

Your new question must be:
- About a completely different scenario/context
- Using different numbers, words, or examples
- Focusing on a different aspect of the topic
- Absolutely unique and never asked before

Session ${sessionId}: Generate something completely fresh and original!`;
  }

  console.log('📝 Enhanced diversity prompt created for:', subject);
  return basePrompt;
}
