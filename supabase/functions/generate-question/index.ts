
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { 
      subject, 
      skillArea, 
      difficultyLevel, 
      userId, 
      questionIndex, 
      promptVariation = 'basic',
      specificContext = 'fundamental concepts'
    } = await req.json()

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    console.log(`🎯 Generating VARIED question ${questionIndex + 1} for ${subject} - ${skillArea} (${promptVariation})`)

    // Create more specific and varied prompts
    const variationPrompts = {
      basic: `Generate a straightforward multiple-choice question`,
      word_problem: `Generate a word problem multiple-choice question with real-world context`,
      mixed: `Generate a multiple-choice question that combines different aspects of the topic`,
      applied: `Generate an applied multiple-choice question that shows practical use`,
      inference: `Generate a multiple-choice question that requires inference and critical thinking`,
      details: `Generate a multiple-choice question focusing on specific details and facts`
    };

    const promptStyle = variationPrompts[promptVariation as keyof typeof variationPrompts] || variationPrompts.basic;

    const prompt = `${promptStyle} for Grade ${difficultyLevel} ${subject} focusing on ${skillArea}.

Context: ${specificContext}
Question Number: ${questionIndex + 1} (make this unique)

Requirements:
- Create a UNIQUE question that hasn't been asked before
- Make it age-appropriate for Grade ${difficultyLevel}
- Provide exactly 4 multiple choice options
- Make sure only one option is clearly correct
- Include a brief explanation for the correct answer
- Use realistic numbers and scenarios
- Ensure this question is different from typical textbook questions

Format your response as JSON:
{
  "question": "Your unique question here",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correct": 0,
  "explanation": "Brief explanation of why this is correct"
}

Subject: ${subject}
Skill Area: ${skillArea}
Grade Level: ${difficultyLevel}
Variation: ${promptVariation}`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert educational content creator specializing in creating UNIQUE, varied K-12 curriculum-aligned questions. Each question you create should be completely different from previous ones. Always respond with valid JSON only. Focus on creativity and variety while maintaining educational value.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8, // Increased for more variety
        max_tokens: 500
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const generatedContent = data.choices[0].message.content

    // Parse the JSON response
    let questionData
    try {
      questionData = JSON.parse(generatedContent)
    } catch (parseError) {
      console.error('❌ Failed to parse AI response:', generatedContent)
      throw new Error('Invalid JSON response from AI')
    }

    // Validate the response structure
    if (!questionData.question || !questionData.options || !Array.isArray(questionData.options)) {
      throw new Error('Invalid question structure from AI')
    }

    console.log(`✅ Generated UNIQUE question ${questionIndex + 1}: ${questionData.question.substring(0, 50)}...`)

    return new Response(JSON.stringify(questionData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('❌ Error generating question:', error)
    
    // Return a unique fallback question
    const fallbackQuestion = {
      question: `What is an important Grade ${difficultyLevel || 5} concept in ${subject || 'mathematics'}? [Unique-${Date.now()}]`,
      options: [
        "Understanding the fundamentals", 
        "Practicing regularly", 
        "Applying knowledge creatively", 
        "All of the above"
      ],
      correct: 3,
      explanation: "All of these approaches are essential for effective learning in any subject."
    }

    return new Response(JSON.stringify(fallbackQuestion), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
