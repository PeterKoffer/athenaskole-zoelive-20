
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      subject, 
      skillArea, 
      difficultyLevel, 
      userId, 
      questionIndex = 0,
      promptVariation = 'basic',
      specificContext = ''
    } = await req.json();

    console.log(`🎯 Generating ${promptVariation} question for ${subject}/${skillArea} (Level ${difficultyLevel})`);

    // Create varied prompts based on type
    let systemPrompt = '';
    let userPrompt = '';

    if (skillArea.includes('fraction') && skillArea.includes('like denominators')) {
      if (skillArea.includes('addition')) {
        systemPrompt = `You are an expert math teacher creating Grade ${difficultyLevel} fraction addition problems. Create problems that are age-appropriate and educationally sound.`;
        
        if (promptVariation === 'word_problem') {
          userPrompt = `Create a word problem about adding fractions with like denominators. Include a real-world scenario that ${difficultyLevel}th graders can relate to (like pizza slices, cake pieces, or toy collections). The fractions should have the same denominator and the sum should be less than 1.`;
        } else if (promptVariation === 'mixed') {
          userPrompt = `Create a mixed fraction addition problem with like denominators. Include both a direct math problem and a brief word context.`;
        } else {
          userPrompt = `Create a fraction addition problem with like denominators. Use fractions where both have the same denominator (like 6, 8, 10, or 12) and the sum is less than 1.`;
        }
      } else if (skillArea.includes('subtraction')) {
        systemPrompt = `You are an expert math teacher creating Grade ${difficultyLevel} fraction subtraction problems. Create problems that are age-appropriate and educationally sound.`;
        
        if (promptVariation === 'word_problem') {
          userPrompt = `Create a word problem about subtracting fractions with like denominators. Include a real-world scenario that ${difficultyLevel}th graders can relate to. The first fraction should be larger than the second.`;
        } else {
          userPrompt = `Create a fraction subtraction problem with like denominators. Use fractions where both have the same denominator and the first fraction is larger than the second.`;
        }
      }
    } else if (skillArea.includes('decimal multiplication')) {
      systemPrompt = `You are an expert math teacher creating Grade ${difficultyLevel} decimal multiplication problems.`;
      userPrompt = `Create a decimal multiplication problem appropriate for Grade ${difficultyLevel}. Use decimals with 1-2 decimal places each.`;
    } else {
      // Generic math problem
      systemPrompt = `You are an expert teacher creating Grade ${difficultyLevel} ${subject} problems for ${skillArea}.`;
      userPrompt = `Create an educational ${subject} problem about ${skillArea} appropriate for Grade ${difficultyLevel} students.`;
    }

    const fullPrompt = `${userPrompt}

IMPORTANT: Return ONLY a valid JSON object with this exact structure:
{
  "question": "Your question here",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correct": 0,
  "explanation": "Clear explanation of why the answer is correct"
}

Requirements:
- The "correct" field should be the index (0-3) of the correct answer
- Make exactly 4 multiple choice options
- Ensure the correct answer is actually correct
- Make wrong answers plausible but clearly incorrect
- Use age-appropriate language for Grade ${difficultyLevel}
- Include step-by-step explanation`;

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
          { role: 'user', content: fullPrompt }
        ],
        temperature: 0.7 + (questionIndex * 0.1), // Vary temperature for diversity
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content.trim();
    
    console.log(`🤖 Raw AI response: ${content.substring(0, 100)}...`);

    // Parse JSON response
    let questionData;
    try {
      // Try to extract JSON if wrapped in markdown
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/```\s*([\s\S]*?)\s*```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : content;
      questionData = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('❌ Failed to parse AI response as JSON:', parseError);
      throw new Error('Invalid JSON response from AI');
    }

    // Validate the response structure
    if (!questionData.question || !Array.isArray(questionData.options) || 
        questionData.options.length !== 4 || typeof questionData.correct !== 'number' ||
        questionData.correct < 0 || questionData.correct > 3) {
      throw new Error('Invalid question structure from AI');
    }

    console.log(`✅ Generated valid question: ${questionData.question.substring(0, 50)}...`);

    return new Response(JSON.stringify(questionData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Error in generate-question function:', error);
    
    // Return a structured error response
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
