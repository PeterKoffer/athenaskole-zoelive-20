
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
    console.log('📥 Request received:', JSON.stringify(requestBody, null, 2));

    const { subject, skillArea, difficultyLevel } = requestBody;

    // Check for OpenAI API key - using the correct secret name "OpenaiAPI"
    const openAIApiKey = Deno.env.get('OpenaiAPI');
    console.log('🔑 Checking API key... Key exists:', !!openAIApiKey);
    console.log('🔑 Key length:', openAIApiKey ? openAIApiKey.length : 0);
    
    if (!openAIApiKey) {
      console.error('❌ OpenaiAPI secret not found in environment');
      console.log('🔍 Available env vars:', Object.keys(Deno.env.toObject()));
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'OpenAI API key not configured. Please add OpenaiAPI to Supabase Edge Function secrets.',
          debug: {
            availableVars: Object.keys(Deno.env.toObject())
          }
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

    console.log('🤖 Sending request to OpenAI with model gpt-4o-mini');

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
    console.log('📡 OpenAI response headers:', Object.fromEntries(openAIResponse.headers.entries()));

    if (!openAIResponse.ok) {
      const errorText = await openAIResponse.text();
      console.error('❌ OpenAI API error:', errorText);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: `OpenAI API error: ${openAIResponse.status} - ${errorText}`,
          debug: {
            status: openAIResponse.status,
            statusText: openAIResponse.statusText,
            errorText: errorText
          }
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const openAIData = await openAIResponse.json();
    console.log('✅ OpenAI response received:', JSON.stringify(openAIData, null, 2));

    if (!openAIData.choices?.[0]?.message?.content) {
      console.error('❌ Invalid OpenAI response structure');
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Invalid response from OpenAI',
          debug: {
            response: openAIData
          }
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
      console.log('🧹 Cleaned content:', cleanContent);
      
      generatedContent = JSON.parse(cleanContent);
      
      console.log('✅ Successfully parsed generated content:', JSON.stringify(generatedContent, null, 2));
    } catch (parseError) {
      console.error('❌ JSON parse failed:', parseError.message);
      console.error('❌ Content that failed to parse:', openAIData.choices[0].message.content);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Failed to parse AI response as JSON',
          debug: {
            parseError: parseError.message,
            rawContent: openAIData.choices[0].message.content
          }
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
          error: 'Generated content has invalid structure',
          debug: {
            content: generatedContent,
            validation: {
              hasQuestion: !!generatedContent.question,
              hasOptions: Array.isArray(generatedContent.options),
              optionsLength: generatedContent.options?.length,
              hasCorrect: typeof generatedContent.correct === 'number',
              hasExplanation: !!generatedContent.explanation
            }
          }
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

    console.log('🎯 Returning successful response:', JSON.stringify(finalContent, null, 2));

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
    console.error('💥 Error stack:', error.stack);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: `Server error: ${error.message}`,
        debug: {
          errorName: error.name,
          errorStack: error.stack
        }
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
