import { OpenAIResponse, GeneratedContent } from './types.ts';

export async function generateContentWithOpenAI(requestData: any): Promise<GeneratedContent | null> {
  console.log('🤖 generateContentWithOpenAI called with grade-level alignment:', requestData);
  
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY') || Deno.env.get('OpenaiAPI');
  
  if (!openaiApiKey) {
    console.error('❌ No OpenAI API key found');
    throw new Error('OpenAI API key not configured');
  }

  const prompt = createGradeAlignedPrompt(
    requestData.subject, 
    requestData.skillArea, 
    requestData.difficultyLevel, 
    requestData.previousQuestions || [],
    requestData.diversityPrompt,
    requestData.sessionId,
    requestData.gradeLevel,
    requestData.standardsAlignment
  );
  console.log('📝 Using grade-aligned prompt for Grade', requestData.gradeLevel);

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

function createGradeAlignedPrompt(
  subject: string, 
  skillArea: string, 
  difficultyLevel: number, 
  previousQuestions: string[],
  diversityPrompt?: string,
  sessionId?: number,
  gradeLevel?: number,
  standardsAlignment?: any
): string {
  console.log('🎯 Creating grade-aligned prompt for Grade', gradeLevel, 'subject:', subject);
  
  const grade = gradeLevel || Math.min(12, Math.max(1, difficultyLevel));
  const gradeDescriptors = {
    1: { vocab: "simple, concrete words", examples: "everyday objects and basic counting", cognitive: "recognition and recall" },
    2: { vocab: "basic vocabulary with simple sentences", examples: "familiar situations and small numbers", cognitive: "basic understanding and application" },
    3: { vocab: "grade-appropriate terms with clear explanations", examples: "school and community contexts", cognitive: "analysis of simple problems" },
    4: { vocab: "intermediate vocabulary", examples: "real-world applications", cognitive: "problem-solving with multiple steps" },
    5: { vocab: "more advanced terminology", examples: "complex real-world scenarios", cognitive: "synthesis and evaluation" },
    6: { vocab: "middle school level vocabulary", examples: "abstract concepts with concrete examples", cognitive: "analytical thinking" },
    7: { vocab: "pre-algebra terminology", examples: "scientific and mathematical reasoning", cognitive: "logical analysis" },
    8: { vocab: "advanced middle school concepts", examples: "complex problem scenarios", cognitive: "abstract reasoning" },
    9: { vocab: "high school foundation vocabulary", examples: "academic and real-world applications", cognitive: "critical thinking" },
    10: { vocab: "intermediate academic vocabulary", examples: "complex analysis scenarios", cognitive: "synthesis and evaluation" },
    11: { vocab: "advanced academic concepts", examples: "sophisticated real-world problems", cognitive: "advanced critical thinking" },
    12: { vocab: "college-preparatory terminology", examples: "complex academic scenarios", cognitive: "sophisticated analysis and synthesis" }
  };

  const currentGrade = gradeDescriptors[grade as keyof typeof gradeDescriptors] || gradeDescriptors[6];
  
  let basePrompt = '';
  
  if (subject === 'mathematics') {
    basePrompt = `Generate a UNIQUE mathematics question for Grade ${grade} students about ${skillArea}.

GRADE ${grade} REQUIREMENTS:
- Use ${currentGrade.vocab}
- Create examples involving ${currentGrade.examples}
- Focus on ${currentGrade.cognitive}
- Age-appropriate complexity for ${grade === 1 ? 'ages 6-7' : grade === 12 ? 'ages 17-18' : `grade ${grade}`}

${standardsAlignment ? `
STANDARDS ALIGNMENT:
- Standard: ${standardsAlignment.code}
- Focus: ${standardsAlignment.title}
- Description: ${standardsAlignment.description}
- Domain: ${standardsAlignment.domain}
` : ''}

CRITICAL REQUIREMENTS:
- Create a question that is appropriate for Grade ${grade} mathematics curriculum
- Use numbers and concepts suitable for this grade level
- ${diversityPrompt || 'Be extremely creative and unique'}
- Ensure mathematical accuracy
- Use fresh, age-appropriate examples

Session ID: ${sessionId} - This must be completely unique for Grade ${grade}.`;

  } else if (subject === 'english') {
    basePrompt = `Generate a UNIQUE English/Language Arts question for Grade ${grade} students.

GRADE ${grade} REQUIREMENTS:
- Reading level appropriate for Grade ${grade}
- Use ${currentGrade.vocab}
- Examples involving ${currentGrade.examples}
- Focus on ${currentGrade.cognitive}

${standardsAlignment ? `
STANDARDS ALIGNMENT:
- Standard: ${standardsAlignment.code}
- Focus: ${standardsAlignment.title}
- Description: ${standardsAlignment.description}
- Domain: ${standardsAlignment.domain}
` : ''}

CRITICAL REQUIREMENTS:
- Create content appropriate for Grade ${grade} reading and comprehension level
- Use age-appropriate themes and vocabulary
- ${diversityPrompt || 'Be extremely creative with scenarios and examples'}
- Focus on grade-level literacy skills

Session ID: ${sessionId} - This must be original Grade ${grade} content.`;

  } else if (subject === 'science') {
    basePrompt = `Generate a UNIQUE science question for Grade ${grade} students.

GRADE ${grade} REQUIREMENTS:
- Scientific concepts appropriate for Grade ${grade}
- Use ${currentGrade.vocab}
- Examples involving ${currentGrade.examples}
- Focus on ${currentGrade.cognitive}

${standardsAlignment ? `
STANDARDS ALIGNMENT:
- Standard: ${standardsAlignment.code}
- Focus: ${standardsAlignment.title}
- Description: ${standardsAlignment.description}
- Domain: ${standardsAlignment.domain}
` : ''}

CRITICAL REQUIREMENTS:
- Create science content appropriate for Grade ${grade} understanding
- Use age-appropriate scientific concepts and terminology
- ${diversityPrompt || 'Explore diverse scientific topics appropriate for this grade'}
- Focus on grade-level scientific inquiry

Session ID: ${sessionId} - This must be original Grade ${grade} science content.`;

  } else {
    basePrompt = `Generate a UNIQUE educational question for Grade ${grade} students in ${subject} - ${skillArea}.

GRADE ${grade} REQUIREMENTS:
- Content appropriate for Grade ${grade} curriculum
- Use ${currentGrade.vocab}
- Examples involving ${currentGrade.examples}
- Focus on ${currentGrade.cognitive}

Session ID: ${sessionId} - Create grade-appropriate original content.
${diversityPrompt || 'Be maximally creative while maintaining grade-level appropriateness'}`;
  }

  // Add standards compliance
  basePrompt += `

EXAMPLE STRUCTURE (create something completely different with appropriate grade level):
{
  "question": "Create a Grade ${grade} appropriate question here",
  "options": ["Grade ${grade} level option 1", "Grade ${grade} level option 2", "Grade ${grade} level option 3", "Grade ${grade} level option 4"],
  "correct": 0,
  "explanation": "Grade ${grade} appropriate explanation using suitable vocabulary",
  "learningObjectives": ["Grade ${grade} skill 1", "Grade ${grade} skill 2"]
}

RETURN ONLY valid JSON, no markdown formatting.`;

  // Add anti-repetition for grade level
  if (previousQuestions.length > 0) {
    basePrompt += `\n\nCRITICAL: You MUST NOT create any question similar to these previous Grade ${grade} questions:
${previousQuestions.slice(0, 15).map((q, i) => `${i + 1}. ${q}`).join('\n')}

Your new Grade ${grade} question must be:
- About a completely different scenario appropriate for Grade ${grade}
- Using different numbers, examples, or concepts suitable for this grade
- Focusing on a different aspect of Grade ${grade} ${subject} curriculum
- Absolutely unique and never asked before at this grade level

Grade ${grade} Session ${sessionId}: Generate completely fresh, grade-appropriate content!`;
  }

  console.log('📝 Grade-aligned prompt created for Grade', grade);
  return basePrompt;
}
