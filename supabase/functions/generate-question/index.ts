
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
    const { subject, skillArea, difficultyLevel, userId, questionIndex } = await req.json()

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    console.log(`🎯 Generating question for ${subject} - ${skillArea} (Grade ${difficultyLevel})`)

    const prompt = `Generate a multiple-choice question for Grade ${difficultyLevel} ${subject} focusing on ${skillArea}.

Requirements:
- Create a clear, age-appropriate question
- Provide exactly 4 multiple choice options
- Make sure only one option is clearly correct
- Include a brief explanation for the correct answer
- Use realistic numbers and scenarios appropriate for Grade ${difficultyLevel}

Format your response as JSON:
{
  "question": "Your question here",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correct": 0,
  "explanation": "Brief explanation of why this is correct"
}

Subject: ${subject}
Skill Area: ${skillArea}
Grade Level: ${difficultyLevel}`

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
            content: 'You are an expert educational content creator specializing in K-12 curriculum-aligned questions. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
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

    console.log(`✅ Generated question: ${questionData.question.substring(0, 50)}...`)

    return new Response(JSON.stringify(questionData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('❌ Error generating question:', error)
    
    // Return a fallback question
    const fallbackQuestion = {
      question: `What is an important concept in ${subject || 'mathematics'}?`,
      options: ["Understanding the basics", "Practicing regularly", "Applying knowledge", "All of the above"],
      correct: 3,
      explanation: "All of these are important for learning mathematics effectively."
    }

    return new Response(JSON.stringify(fallbackQuestion), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
