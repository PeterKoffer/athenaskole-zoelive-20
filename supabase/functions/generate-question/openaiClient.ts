
import { QuestionGenerationRequest, GeneratedQuestion } from './types.ts';
import { generatePrompts } from './promptGenerator.ts';

export async function generateQuestionWithOpenAI(
  request: QuestionGenerationRequest,
  openAIApiKey: string
): Promise<GeneratedQuestion> {
  const { systemPrompt, userPrompt } = generatePrompts(request);
  const { questionIndex = 0 } = request;

  console.log(`🤖 Calling OpenAI with system prompt: ${systemPrompt.substring(0, 100)}...`);
  console.log(`🤖 User prompt: ${userPrompt.substring(0, 100)}...`);

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7 + (questionIndex * 0.1), // Vary temperature for diversity
      max_tokens: 800,
    }),
  });

  console.log(`📊 OpenAI response status: ${response.status}`);

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`❌ OpenAI API error: ${response.status} - ${errorText}`);
    throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content.trim();
  
  console.log(`🤖 Raw AI response: ${content}`);

  // Parse JSON response
  try {
    // Try to extract JSON if wrapped in markdown
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/```\s*([\s\S]*?)\s*```/);
    const jsonStr = jsonMatch ? jsonMatch[1] : content;
    const questionData = JSON.parse(jsonStr);
    console.log(`✅ Parsed question data:`, questionData);
    
    return questionData;
  } catch (parseError) {
    console.error('❌ Failed to parse AI response as JSON:', parseError);
    console.error('❌ Raw content was:', content);
    throw new Error('Invalid JSON response from AI');
  }
}
