
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GenerateContentRequest {
  subject: string;
  skillArea: string;
  difficultyLevel: number;
  userId: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('🚀 AI Content Generation started');

  try {
    const requestBody = await req.json();
    console.log('📥 Received request:', requestBody);

    const { subject, skillArea, difficultyLevel }: GenerateContentRequest = requestBody;

    const openAIApiKey = Deno.env.get('OpenaiAPI');
    
    if (!openAIApiKey) {
      console.error('❌ OpenAI API key missing');
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'OpenAI API key not configured'
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('🔑 OpenAI API key found');

    // Create a specific prompt based on subject and skill area
    let specificPrompt = '';
    if (subject === 'matematik' && skillArea === 'fractions') {
      specificPrompt = `Generate a math question about fractions at difficulty level ${difficultyLevel}. 
      Include operations like adding, subtracting, multiplying, or dividing fractions.
      Make it challenging but appropriate for the level.`;
    } else {
      specificPrompt = `Generate an educational question for ${subject} focusing on ${skillArea} at difficulty level ${difficultyLevel}.`;
    }

    const prompt = `${specificPrompt}

Return a JSON object with this EXACT structure (no markdown, no code blocks, just pure JSON):
{
  "question": "The main question text here",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correct": 0,
  "explanation": "Clear explanation of why the answer is correct",
  "learningObjectives": ["Learning objective 1", "Learning objective 2"]
}

The correct field should be the INDEX (0, 1, 2, or 3) of the correct answer in the options array.
Make sure the question is educational and appropriate for the difficulty level.`;

    console.log('🤖 Sending to OpenAI:', { prompt: prompt.substring(0, 100) + '...' });

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
            content: 'You are an educational content generator. Return ONLY valid JSON, no markdown formatting or code blocks.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    console.log('📡 OpenAI response status:', openAIResponse.status);

    if (!openAIResponse.ok) {
      const errorText = await openAIResponse.text();
      console.error('❌ OpenAI API error:', errorText);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: `OpenAI API error: ${openAIResponse.status}`,
          details: errorText
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

    const contentText = openAIData.choices[0].message.content.trim();
    console.log('📄 Raw content:', contentText);

    let generatedContent;
    try {
      // Clean the content in case there are markdown artifacts
      const cleanContent = contentText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      generatedContent = JSON.parse(cleanContent);
      console.log('✅ Successfully parsed AI content');
    } catch (parseError) {
      console.error('❌ JSON parse failed:', parseError.message);
      console.error('❌ Content that failed:', contentText);
      
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Failed to parse AI response',
          rawContent: contentText
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate the structure
    if (!generatedContent.question || !Array.isArray(generatedContent.options) || 
        typeof generatedContent.correct !== 'number' || !generatedContent.explanation) {
      console.error('❌ Invalid content structure:', generatedContent);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Invalid content structure from AI'
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Ensure all required fields
    const finalContent = {
      question: generatedContent.question,
      options: generatedContent.options,
      correct: Number(generatedContent.correct),
      explanation: generatedContent.explanation,
      learningObjectives: generatedContent.learningObjectives || [`Understanding ${skillArea} in ${subject}`],
      estimatedTime: 30
    };

    console.log('🎯 Final content generated successfully');

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
        error: 'Unexpected server error',
        details: error.message
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
