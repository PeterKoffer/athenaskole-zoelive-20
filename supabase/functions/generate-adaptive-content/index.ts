
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

  console.log('🚀 Edge function started');

  try {
    const requestBody = await req.json();
    console.log('📥 Request received:', requestBody);

    const { subject, skillArea, difficultyLevel, userId }: GenerateContentRequest = requestBody;

    // Check for OpenAI API key
    const openAIApiKey = Deno.env.get('OpenaiAPI');
    console.log('🔑 OpenAI API key status:', openAIApiKey ? 'Found' : 'Missing');
    
    if (!openAIApiKey) {
      console.error('❌ No OpenAI API key found in environment');
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'OpenAI API key not configured',
          debug: 'Missing OpenaiAPI secret in Supabase'
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const prompt = `Generate an educational multiple-choice question for:
Subject: ${subject}
Skill Area: ${skillArea}
Difficulty Level: ${difficultyLevel} (1-10 scale)

Create a JSON response with this exact structure:
{
  "question": "The main question text",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correct": 0,
  "explanation": "Explanation of why the correct answer is right",
  "learningObjectives": ["Learning objective 1", "Learning objective 2"]
}

Make the question appropriate for the difficulty level and subject matter. Ensure it's educational and engaging.`;

    console.log('🤖 Sending request to OpenAI...');
    console.log('📝 Prompt:', prompt);

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
            content: 'You are an educational content generator. Always respond with valid JSON only, no additional text or markdown formatting.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    console.log('📡 OpenAI response status:', openAIResponse.status);
    console.log('📡 OpenAI response headers:', Object.fromEntries(openAIResponse.headers.entries()));

    if (!openAIResponse.ok) {
      const errorText = await openAIResponse.text();
      console.error('❌ OpenAI API error:', openAIResponse.status, errorText);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: `OpenAI API error: ${openAIResponse.status}`,
          debug: errorText
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const openAIData = await openAIResponse.json();
    console.log('✅ OpenAI raw response:', JSON.stringify(openAIData, null, 2));

    if (!openAIData.choices || !openAIData.choices[0] || !openAIData.choices[0].message) {
      console.error('❌ Invalid OpenAI response structure:', openAIData);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Invalid response structure from OpenAI',
          debug: openAIData
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const contentText = openAIData.choices[0].message.content;
    console.log('📄 Content to parse:', contentText);

    let generatedContent;
    try {
      generatedContent = JSON.parse(contentText);
      console.log('✅ Successfully parsed content:', generatedContent);
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError);
      console.error('❌ Raw content that failed to parse:', contentText);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Failed to parse AI response as JSON',
          debug: { parseError: parseError.message, rawContent: contentText }
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate required fields
    if (!generatedContent.question || !generatedContent.options || !Array.isArray(generatedContent.options)) {
      console.error('❌ Invalid content structure:', generatedContent);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Invalid content structure from AI',
          debug: generatedContent
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Ensure correct field is a number
    if (typeof generatedContent.correct !== 'number') {
      console.log('⚠️ Fixing correct field type');
      generatedContent.correct = parseInt(generatedContent.correct) || 0;
    }

    // Ensure we have learning objectives
    if (!generatedContent.learningObjectives || !Array.isArray(generatedContent.learningObjectives)) {
      console.log('⚠️ Adding default learning objectives');
      generatedContent.learningObjectives = [`Understanding ${skillArea} concepts in ${subject}`];
    }

    const finalContent = {
      ...generatedContent,
      estimatedTime: 30
    };

    console.log('🎯 Final generated content:', finalContent);

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
    console.error('💥 Unexpected error in edge function:', error);
    console.error('💥 Error stack:', error.stack);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'Unknown error occurred',
        debug: error.stack
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
