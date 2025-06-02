
import { OpenAIResponse, GeneratedContent } from './types.ts';

export async function generateContentWithOpenAI(requestData: any): Promise<GeneratedContent | null> {
  console.log('🤖 generateContentWithOpenAI called with:', requestData);
  
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY') || Deno.env.get('OpenaiAPI');
  
  if (!openaiApiKey) {
    console.error('❌ No OpenAI API key found');
    throw new Error('OpenAI API key not configured');
  }

  const prompt = createPrompt(requestData.subject, requestData.skillArea, requestData.difficultyLevel, requestData.previousQuestions || []);
  console.log('📝 Using prompt for subject:', requestData.subject, 'skillArea:', requestData.skillArea);

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
            content: 'You are an AI education assistant that creates questions for specific subjects. Always generate questions that match the requested subject and skill area. Return only valid JSON with no formatting.'
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

function createPrompt(subject: string, skillArea: string, difficultyLevel: number, previousQuestions: string[]): string {
  console.log('🎯 Creating prompt for subject:', subject, 'skillArea:', skillArea);
  
  let prompt = '';
  
  // Generate subject-specific prompts - this is the critical fix
  if (subject === 'english') {
    prompt = `Generate an English reading comprehension question suitable for elementary students.

Return ONLY a valid JSON object with this exact structure:
{
  "question": "Read this sentence: 'The cat sat on the mat.' What did the cat do?",
  "options": ["ran", "jumped", "sat", "flew"],
  "correct": 2,
  "explanation": "The sentence clearly states 'The cat sat on the mat', so the correct answer is 'sat'.",
  "learningObjectives": ["Reading comprehension", "Verb identification"]
}

Make sure:
- The question focuses on reading comprehension, vocabulary, or grammar
- There are exactly 4 options
- The "correct" field is the index (0, 1, 2, or 3) of the correct answer
- The explanation clearly shows the reasoning
- Return ONLY the JSON, no markdown formatting or code blocks`;
  } else if (subject === 'mathematics') {
    prompt = `Generate a mathematics question about ${skillArea} suitable for elementary students (difficulty level ${difficultyLevel}).

Return ONLY a valid JSON object with this exact structure:
{
  "question": "What is 1/2 + 1/4?",
  "options": ["1/6", "2/6", "3/4", "3/6"],
  "correct": 2,
  "explanation": "To add fractions, find a common denominator. 1/2 = 2/4, so 2/4 + 1/4 = 3/4",
  "learningObjectives": ["Adding fractions with different denominators", "Finding common denominators"]
}

Make sure:
- The question is about mathematics (arithmetic, fractions, geometry, etc.)
- There are exactly 4 options
- The "correct" field is the index (0, 1, 2, or 3) of the correct answer
- The explanation clearly shows how to solve the problem
- Return ONLY the JSON, no markdown formatting or code blocks`;
  } else if (subject === 'creative_writing') {
    prompt = `Generate a creative writing exercise suitable for elementary students.

Return ONLY a valid JSON object with this exact structure:
{
  "question": "Complete this story starter: 'Once upon a time, in a magical forest, there lived a small dragon who...'",
  "options": ["could not fly", "loved to sing", "was afraid of fire", "collected shiny rocks"],
  "correct": 1,
  "explanation": "Any of these options could work creatively, but 'loved to sing' creates an interesting contrast and story opportunity.",
  "learningObjectives": ["Creative thinking", "Story development", "Character creation"]
}

Make sure:
- The question encourages creativity and imagination
- There are exactly 4 options
- The "correct" field is the index (0, 1, 2, or 3) of the most interesting creative choice
- The explanation shows why this choice works well for storytelling
- Return ONLY the JSON, no markdown formatting or code blocks`;
  } else if (subject === 'science') {
    prompt = `Generate a science discovery question suitable for elementary students.

Return ONLY a valid JSON object with this exact structure:
{
  "question": "What happens when you mix baking soda and vinegar?",
  "options": ["Nothing happens", "It gets hot", "It fizzes and bubbles", "It changes color"],
  "correct": 2,
  "explanation": "When baking soda (a base) mixes with vinegar (an acid), they react to create carbon dioxide gas, which causes fizzing and bubbling.",
  "learningObjectives": ["Chemical reactions", "Acids and bases", "Observation skills"]
}

Make sure:
- The question focuses on scientific concepts, experiments, or natural phenomena
- There are exactly 4 options
- The "correct" field is the index (0, 1, 2, or 3) of the correct answer
- The explanation includes the scientific reasoning
- Return ONLY the JSON, no markdown formatting or code blocks`;
  } else {
    // Fallback to math if subject is not recognized
    console.log('⚠️ Unknown subject, falling back to math:', subject);
    prompt = `Generate a basic math question suitable for elementary students.

Return ONLY a valid JSON object with this exact structure:
{
  "question": "What is 5 + 3?",
  "options": ["6", "7", "8", "9"],
  "correct": 2,
  "explanation": "5 + 3 = 8",
  "learningObjectives": ["Basic addition"]
}`;
  }

  if (previousQuestions.length > 0) {
    prompt += `\n\nIMPORTANT: Do NOT generate any of these previous questions:\n${previousQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}

Create a completely different ${subject} question that hasn't been asked before.`;
  }

  console.log('📝 Final prompt created for:', subject);
  return prompt;
}
