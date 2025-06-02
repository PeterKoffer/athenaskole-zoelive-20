
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('🚀 AI Content Generation Function Called');

  try {
    const requestBody = await req.json();
    console.log('📥 Request received:', requestBody);

    const { subject, skillArea, difficultyLevel } = requestBody;

    // Check for OpenAI API key - using the correct secret name "OpenaiAPI"
    const openAIApiKey = Deno.env.get('OpenaiAPI');
    
    if (!openAIApiKey) {
      console.error('❌ OpenaiAPI secret not found in environment');
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'OpenAI API key not configured. Please add OpenaiAPI to Supabase Edge Function secrets.'
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('🔑 OpenAI API key found, proceeding with generation');

    // Create the prompt
    const prompt = `Generate a math question about fractions suitable for elementary students.

Return ONLY a valid JSON object with this exact structure:
{
  "question": "What is 1/2 + 1/4?",
  "options": ["1/6", "2/6", "3/4", "3/6"],
  "correct": 2,
  "explanation": "To add fractions, find a common denominator. 1/2 = 2/4, so 2/4 + 1/4 = 3/4",
  "learningObjectives": ["Adding fractions with different denominators", "Finding common denominators"]
}

Make sure:
- The question is about fractions (adding, subtracting, multiplying, or dividing)
- There are exactly 4 options
- The "correct" field is the index (0, 1, 2, or 3) of the correct answer
- The explanation clearly shows how to solve the problem
- Return ONLY the JSON, no markdown formatting or code blocks`;

    console.log('🤖 Sending request to OpenAI');

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: 'You are a math teacher creating fraction problems. Return only valid JSON with no formatting.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    console.log('📡 OpenAI response status:', openAIResponse.status);

    if (!openAIResponse.ok) {
      const errorText = await openAIResponse.text();
      console.error('❌ OpenAI API error:', errorText);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: `OpenAI API error: ${openAIResponse.status} - ${errorText}`
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const openAIData = await openAIResponse.json();
    console.log('✅ OpenAI response received');

    if (!openAIData.choices?.[0]?.message?.content) {
      console.error('❌ Invalid OpenAI response structure');
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Invalid response from OpenAI'
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    let generatedContent;
    try {
      const contentText = openAIData.choices[0].message.content.trim();
      console.log('📄 Raw OpenAI content:', contentText);
      
      // Clean any potential markdown formatting
      const cleanContent = contentText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      generatedContent = JSON.parse(cleanContent);
      
      console.log('✅ Successfully parsed generated content:', generatedContent);
    } catch (parseError) {
      console.error('❌ JSON parse failed:', parseError.message);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Failed to parse AI response as JSON'
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate the generated content
    if (!generatedContent.question || 
        !Array.isArray(generatedContent.options) || 
        generatedContent.options.length !== 4 ||
        typeof generatedContent.correct !== 'number' || 
        !generatedContent.explanation) {
      console.error('❌ Invalid content structure:', generatedContent);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Generated content has invalid structure'
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Ensure all required fields with defaults
    const finalContent = {
      question: generatedContent.question,
      options: generatedContent.options,
      correct: Number(generatedContent.correct),
      explanation: generatedContent.explanation,
      learningObjectives: generatedContent.learningObjectives || ['Fraction arithmetic'],
      estimatedTime: 30
    };

    console.log('🎯 Returning successful response:', finalContent);

    return new Response(
      JSON.stringify({ 
        success: true, 
        generatedContent: finalContent
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('💥 Unexpected error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: `Server error: ${error.message}`
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
