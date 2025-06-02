
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

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

  try {
    const { subject, skillArea, difficultyLevel, userId }: GenerateContentRequest = await req.json();

    console.log('🔄 Processing content generation request:', { subject, skillArea, difficultyLevel, userId });

    // Use the correct secret name from Supabase
    const openAIApiKey = Deno.env.get('OpenaiAPI');
    if (!openAIApiKey) {
      console.error('❌ OpenAI API key not found in secrets');
      throw new Error('OpenAI API key not configured');
    }

    console.log('✅ OpenAI API key found, generating content with AI...');

    const prompt = `Generate an educational multiple-choice question for:
Subject: ${subject}
Skill Area: ${skillArea}
Difficulty Level: ${difficultyLevel} (1-10 scale)

Create a JSON response with the following structure:
{
  "question": "The main question text",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correct": 0,
  "explanation": "Explanation of why the correct answer is right",
  "learningObjectives": ["Learning objective 1", "Learning objective 2"]
}

Make the question appropriate for the difficulty level and subject matter. Ensure it's educational and engaging.`;

    console.log('🤖 Sending request to OpenAI...');

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
            content: 'You are an educational content generator. Always respond with valid JSON only, no additional text.'
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

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ OpenAI response received:', data);

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response structure from OpenAI');
    }

    let generatedContent;
    try {
      generatedContent = JSON.parse(data.choices[0].message.content);
      console.log('🎯 Successfully parsed AI-generated content:', generatedContent);
    } catch (parseError) {
      console.error('❌ Failed to parse OpenAI response as JSON:', parseError);
      throw new Error('Failed to parse AI response');
    }

    // Validate required fields
    if (!generatedContent.question || !generatedContent.options || !Array.isArray(generatedContent.options)) {
      console.error('❌ Invalid content structure:', generatedContent);
      throw new Error('Invalid content structure from AI');
    }

    // Ensure correct field is a number
    if (typeof generatedContent.correct !== 'number') {
      generatedContent.correct = 0;
    }

    // Ensure we have learning objectives
    if (!generatedContent.learningObjectives || !Array.isArray(generatedContent.learningObjectives)) {
      generatedContent.learningObjectives = [`Understanding ${skillArea} concepts in ${subject}`];
    }

    console.log('📝 Final generated content:', generatedContent);

    // Try to save to database (optional, don't fail if this doesn't work)
    try {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data: savedContent, error: saveError } = await supabase
        .from('adaptive_content')
        .insert({
          subject,
          skill_area: skillArea,
          difficulty_level: difficultyLevel,
          title: generatedContent.question,
          content: generatedContent,
          learning_objectives: generatedContent.learningObjectives || [],
          estimated_time: 30
        })
        .select()
        .single();

      if (saveError) {
        console.error('❌ Error saving to database (continuing anyway):', saveError);
      } else {
        console.log('✅ Content saved to database:', savedContent);
      }
    } catch (dbError) {
      console.error('❌ Database error (continuing anyway):', dbError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        generatedContent: {
          ...generatedContent,
          estimatedTime: 30
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('❌ Error in generate-adaptive-content function:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'Unknown error occurred'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
