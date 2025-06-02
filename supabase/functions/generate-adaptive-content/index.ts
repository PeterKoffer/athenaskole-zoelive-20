
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { subject, skillArea, difficultyLevel, userId } = await req.json();

    console.log('🔄 Received request:', { subject, skillArea, difficultyLevel, userId });

    if (!subject || !skillArea || !difficultyLevel || !userId) {
      throw new Error('Missing required parameters');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log(`🤖 Generating content for ${subject}/${skillArea} at level ${difficultyLevel}`);

    // Create detailed prompt based on subject, skill area, and difficulty
    const prompt = `Generate an educational question for a Danish learning system with the following specifications:

Subject: ${subject}
Skill Area: ${skillArea}
Difficulty Level: ${difficultyLevel} (scale 1-10, where 1 is beginner and 10 is expert)

Generate a JSON response with this exact structure:
{
  "question": "A clear, age-appropriate question in Danish",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correct": 1,
  "explanation": "A detailed explanation in Danish of why the correct answer is right and why others are wrong",
  "learningObjectives": ["Objective 1", "Objective 2"],
  "estimatedTime": 5
}

Requirements:
- Make the question appropriate for difficulty level ${difficultyLevel}
- Include 4 multiple choice options in Danish
- The "correct" field should be the index (0-3) of the correct answer
- Explanation should be educational and encouraging in Danish
- Learning objectives should be specific and measurable in Danish
- Estimated time should be realistic in minutes
- For mathematics: include calculation problems, word problems, or concept questions
- For danish: include reading comprehension, grammar, vocabulary, or spelling
- For english: include basic english vocabulary, simple phrases, or pronunciation
- Ensure content is engaging and educational for Danish students

Return only valid JSON, no additional text.`;

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
            content: 'You are an expert Danish educational content creator. Generate high-quality, pedagogically sound learning materials in Danish. Always respond with valid JSON only.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;

    console.log('🤖 Raw OpenAI response:', generatedContent);

    // Parse the generated JSON content
    let parsedContent;
    try {
      parsedContent = JSON.parse(generatedContent);
    } catch (parseError) {
      console.error('❌ Failed to parse OpenAI response:', generatedContent);
      throw new Error('Invalid JSON response from OpenAI');
    }

    console.log('✅ Parsed content:', parsedContent);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Save the generated content to the adaptive_content table
    const { data: savedContent, error: saveError } = await supabase
      .from('adaptive_content')
      .insert({
        subject,
        skill_area: skillArea,
        difficulty_level: difficultyLevel,
        content_type: 'multiple_choice',
        title: `${subject.charAt(0).toUpperCase() + subject.slice(1)} - ${skillArea}`,
        content: parsedContent,
        learning_objectives: parsedContent.learningObjectives || [],
        estimated_time: parsedContent.estimatedTime || 5
      })
      .select()
      .single();

    if (saveError) {
      console.error('❌ Error saving content:', saveError);
      throw new Error(`Failed to save generated content: ${saveError.message}`);
    }

    console.log('✅ Content saved successfully:', savedContent);

    // Log the AI interaction
    const { error: logError } = await supabase.from('ai_interactions').insert({
      user_id: userId,
      ai_service: 'openai',
      interaction_type: 'content_generation',
      prompt_text: prompt,
      response_data: { generatedContent: parsedContent },
      success: true,
      subject,
      skill_area: skillArea,
      difficulty_level: difficultyLevel
    });

    if (logError) {
      console.error('⚠️ Warning: Failed to log AI interaction:', logError);
    }

    console.log('🎉 Successfully generated and saved adaptive content');

    return new Response(JSON.stringify({ 
      success: true, 
      content: savedContent,
      generatedContent: parsedContent 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Error in generate-adaptive-content function:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
