
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

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error('❌ OpenAI API key not found');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'OpenAI API key not configured. Please set OPENAI_API_KEY in Supabase Edge Function secrets.' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create AI prompt based on subject and skill area
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
      console.error('❌ OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ OpenAI response received:', data);

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response from OpenAI');
    }

    let generatedContent;
    try {
      generatedContent = JSON.parse(data.choices[0].message.content);
    } catch (parseError) {
      console.error('❌ Failed to parse OpenAI response as JSON:', parseError);
      // Create fallback content
      generatedContent = {
        question: `Sample question for ${subject} - ${skillArea}`,
        options: ['Answer A', 'Answer B', 'Answer C', 'Answer D'],
        correct: 0,
        explanation: `This is a sample question for ${subject} in the ${skillArea} area.`,
        learningObjectives: [`Understanding ${skillArea} concepts`]
      };
    }

    // Ensure required fields exist
    if (!generatedContent.question || !generatedContent.options || !Array.isArray(generatedContent.options)) {
      throw new Error('Generated content is missing required fields');
    }

    console.log('📝 Generated content:', generatedContent);

    // Save to database
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
      console.error('❌ Error saving to database:', saveError);
      // Still return the generated content even if save fails
    } else {
      console.log('✅ Content saved to database:', savedContent);
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
        error: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
