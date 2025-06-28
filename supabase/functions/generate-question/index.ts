
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

    console.log(`🎯 Generating specific ${subject} question ${questionIndex + 1} for ${skillArea}`)

    // Create more specific prompts for fraction questions
    const fractionPrompts = {
      basic: `Generate a straightforward fraction addition question with like denominators`,
      word_problem: `Generate a word problem involving adding fractions with like denominators`,
      mixed: `Generate a fraction addition question that may require simplification`,
      applied: `Generate a practical fraction addition problem with real-world context`,
      visual: `Generate a fraction addition question that could be visualized with shapes`,
      step_by_step: `Generate a fraction addition question perfect for showing steps`
    };

    const mathPrompts = {
      'fraction addition with like denominators': fractionPrompts,
      'decimal multiplication': {
        basic: `Generate a straightforward decimal multiplication question`,
        word_problem: `Generate a word problem involving decimal multiplication`,
        money: `Generate a decimal multiplication question using money amounts`,
        measurement: `Generate a decimal multiplication question using measurements`
      }
    };

    const promptStyle = mathPrompts[skillArea as keyof typeof mathPrompts]?.[promptVariation as keyof typeof fractionPrompts] || 
                       `Generate a ${promptVariation} multiple-choice question`;

    const prompt = `You are an expert math teacher creating Grade ${difficultyLevel} questions.

${promptStyle} for ${skillArea}.

SPECIFIC REQUIREMENTS:
- Create a unique, specific question (not generic)
- Use realistic numbers appropriate for Grade ${difficultyLevel}
- Provide exactly 4 multiple choice options
- Make sure only ONE option is clearly correct
- Include a brief, clear explanation

For fraction addition with like denominators:
- Use denominators like 4, 6, 8, 10, 12 (appropriate for Grade ${difficultyLevel})
- Make numerators that create meaningful problems
- One answer should be the correct sum, others should be common mistakes
- Example good question: "What is 3/8 + 2/8?"

CRITICAL: Respond ONLY with valid JSON in this exact format:
{
  "question": "Your specific question here",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correct": 0,
  "explanation": "Brief explanation of why this is correct"
}

Subject: ${subject}
Skill Area: ${skillArea}
Grade Level: ${difficultyLevel}
Question ${questionIndex + 1}`

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
            content: 'You are an expert Grade 4-5 math teacher. You create specific, engaging math questions that are perfectly suited for the grade level. Always respond with valid JSON only. Never include markdown formatting or extra text.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 400
      }),
    })

    if (!response.ok) {
      console.error(`❌ OpenAI API error: ${response.status}`)
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const generatedContent = data.choices[0].message.content.trim()

    console.log(`📝 Raw AI response: ${generatedContent}`)

    // Clean up the response - remove any markdown formatting
    let cleanedContent = generatedContent
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .replace(/^\s*```.*?\n/g, '')
      .replace(/\n```\s*$/g, '')
      .trim()

    // Parse the JSON response
    let questionData
    try {
      questionData = JSON.parse(cleanedContent)
    } catch (parseError) {
      console.error('❌ JSON Parse Error:', parseError)
      console.error('❌ Failed to parse content:', cleanedContent)
      
      // Try to extract JSON from the response
      const jsonMatch = cleanedContent.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        try {
          questionData = JSON.parse(jsonMatch[0])
          console.log('✅ Successfully extracted JSON from response')
        } catch (extractError) {
          console.error('❌ Failed to extract JSON:', extractError)
          throw new Error('Invalid JSON response from AI')
        }
      } else {
        throw new Error('No valid JSON found in response')
      }
    }

    // Validate the response structure
    if (!questionData || typeof questionData !== 'object') {
      throw new Error('Response is not a valid object')
    }

    if (!questionData.question || typeof questionData.question !== 'string') {
      throw new Error('Missing or invalid question field')
    }

    if (!questionData.options || !Array.isArray(questionData.options) || questionData.options.length !== 4) {
      throw new Error('Missing or invalid options field - must be array of 4 options')
    }

    if (typeof questionData.correct !== 'number' || questionData.correct < 0 || questionData.correct > 3) {
      throw new Error('Missing or invalid correct field - must be number 0-3')
    }

    if (!questionData.explanation || typeof questionData.explanation !== 'string') {
      questionData.explanation = "Good work on this problem!"
    }

    console.log(`✅ Generated specific question: ${questionData.question.substring(0, 60)}...`)
    console.log(`📊 Options: ${questionData.options.join(', ')}`)
    console.log(`✔️ Correct answer: ${questionData.options[questionData.correct]}`)

    return new Response(JSON.stringify(questionData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('❌ Error generating question:', error)
    
    // Return a specific fallback question based on the subject/skill area
    const { subject = 'mathematics', skillArea = 'general math', difficultyLevel = 5, questionIndex = 0 } = await req.json().catch(() => ({}))
    
    let fallbackQuestion
    
    if (skillArea.includes('fraction') && skillArea.includes('like denominators')) {
      // Specific fraction fallback
      const numerator1 = 2 + (questionIndex % 3)
      const numerator2 = 1 + (questionIndex % 2)
      const denominator = [6, 8, 10, 12][questionIndex % 4]
      const correctSum = numerator1 + numerator2
      
      fallbackQuestion = {
        question: `What is ${numerator1}/${denominator} + ${numerator2}/${denominator}?`,
        options: [
          `${correctSum}/${denominator}`,
          `${correctSum}/${denominator * 2}`,
          `${numerator1 + numerator2}/${denominator + denominator}`,
          `${correctSum - 1}/${denominator}`
        ],
        correct: 0,
        explanation: `When adding fractions with the same denominator, add the numerators and keep the denominator: ${numerator1} + ${numerator2} = ${correctSum}, so the answer is ${correctSum}/${denominator}.`
      }
    } else if (skillArea.includes('decimal multiplication')) {
      // Specific decimal fallback
      const factor1 = (1.2 + questionIndex * 0.3).toFixed(1)
      const factor2 = (2.0 + questionIndex * 0.4).toFixed(1)
      const product = (parseFloat(factor1) * parseFloat(factor2)).toFixed(2)
      
      fallbackQuestion = {
        question: `What is ${factor1} × ${factor2}?`,
        options: [
          product,
          (parseFloat(product) + 1).toFixed(2),
          (parseFloat(product) - 0.5).toFixed(2),
          (parseFloat(product) * 2).toFixed(2)
        ],
        correct: 0,
        explanation: `To multiply decimals, multiply the numbers and place the decimal point correctly. ${factor1} × ${factor2} = ${product}.`
      }
    } else {
      // Generic fallback
      fallbackQuestion = {
        question: `What is an important concept in Grade ${difficultyLevel} ${subject}? [Question ${questionIndex + 1}]`,
        options: [
          "Understanding the fundamentals", 
          "Practicing regularly", 
          "Applying knowledge creatively", 
          "All of the above"
        ],
        correct: 3,
        explanation: "All of these approaches are essential for effective learning in any subject."
      }
    }

    return new Response(JSON.stringify(fallbackQuestion), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
