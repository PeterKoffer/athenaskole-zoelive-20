
import { QuestionGenerationRequest, GeneratedQuestion } from './types.ts';
import { parseEducationalContext, buildEducationalPrompt } from './educationalParametersBuilder.ts';

export async function generateQuestionWithOpenAI(
  request: QuestionGenerationRequest,
  openAIApiKey: string
): Promise<GeneratedQuestion> {
  const { questionIndex = 0 } = request;

  // Parse the comprehensive educational context
  const educationalContext = parseEducationalContext(request);
  console.log(`🎓 Educational context:`, {
    grade: educationalContext.gradeLevel,
    hasTeacherReqs: !!educationalContext.teacherRequirements,
    hasSchoolStandards: !!educationalContext.schoolStandards,
    hasStudentAdaptation: !!educationalContext.studentAdaptation,
    learningStyle: educationalContext.studentAdaptation?.learningStyle
  });

  // Build comprehensive educational prompt
  const educationalPrompt = buildEducationalPrompt(educationalContext);
  
  const systemPrompt = `You are an expert K-12 educational content creator specializing in personalized learning. You understand:
- Grade-level appropriate curriculum standards
- Individual student learning needs and adaptations
- Teacher pedagogical requirements
- School district policies and learning objectives

Your role is to create questions that are perfectly aligned with all these educational parameters while ensuring mathematical and logical accuracy.

CRITICAL: Never create questions with equivalent answer options (like 1/2 and 2/4, or 0.5 and 50%).`;

  console.log(`🤖 Calling OpenAI with personalized K-12 prompt for Grade ${educationalContext.gradeLevel}`);
  console.log(`📝 Educational prompt length: ${educationalPrompt.length} characters`);

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
        { role: 'user', content: educationalPrompt }
      ],
      temperature: 0.7 + (questionIndex * 0.05), // Add slight variation for uniqueness
      max_tokens: 1000,
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
  
  console.log(`🤖 Raw AI response: ${content.substring(0, 200)}...`);

  // Parse JSON response
  try {
    // Try to extract JSON if wrapped in markdown
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/```\s*([\s\S]*?)\s*```/);
    const jsonStr = jsonMatch ? jsonMatch[1] : content;
    const questionData = JSON.parse(jsonStr);
    
    console.log(`✅ Parsed personalized K-12 question data:`, {
      hasQuestion: !!questionData.question,
      optionsCount: questionData.options?.length,
      correctIndex: questionData.correct,
      hasEducationalNotes: !!questionData.educationalNotes
    });
    
    return questionData;
  } catch (parseError) {
    console.error('❌ Failed to parse AI response as JSON:', parseError);
    console.error('❌ Raw content was:', content);
    throw new Error('Invalid JSON response from AI');
  }
}
