
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

    const { subject, skillArea, difficultyLevel, previousQuestions = [] } = requestBody;

    // Check for OpenAI API key
    const openAIApiKey = Deno.env.get('OpenaiAPI');
    console.log('🔑 API Key Check:');
    console.log('  - Key exists:', !!openAIApiKey);
    console.log('  - Key starts with sk-:', openAIApiKey ? openAIApiKey.startsWith('sk-') : false);
    console.log('  - Previous questions count:', previousQuestions.length);
    
    if (!openAIApiKey) {
      console.error('❌ OpenaiAPI secret not found in environment');
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'OpenAI API key not configured. Please check the OpenaiAPI secret in Supabase.',
          debug: {
            secretName: 'OpenaiAPI',
            availableVars: Object.keys(Deno.env.toObject())
          }
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!openAIApiKey.startsWith('sk-')) {
      console.error('❌ Invalid OpenAI API key format');
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Invalid OpenAI API key format. Key should start with "sk-"',
          debug: {
            keyStartsWith: openAIApiKey.substring(0, 5)
          }
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('🔑 OpenAI API key validated successfully');

    // Create the prompt with previous questions to avoid duplicates
    let prompt = `Generate a math question about fractions suitable for elementary students.

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

    // Add previous questions to avoid duplicates
    if (previousQuestions.length > 0) {
      prompt += `\n\nIMPORTANT: Do NOT generate any of these previous questions:\n${previousQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}

Create a completely different fraction problem that hasn't been asked before.`;
    }

    console.log('🤖 Making request to OpenAI API...');
    console.log('🌐 Using endpoint: https://api.openai.com/v1/chat/completions');
    console.log('🎯 Using model: gpt-4o-mini');

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
            content: 'You are a math teacher creating fraction problems. Return only valid JSON with no formatting. Ensure each question is unique and different from previous ones.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8, // Increased for more variety
        max_tokens: 500,
      }),
    });

    console.log('📡 OpenAI Response Details:');
    console.log('  - Status:', openAIResponse.status);
    console.log('  - Status Text:', openAIResponse.statusText);

    if (!openAIResponse.ok) {
      const errorText = await openAIResponse.text();
      console.error('❌ OpenAI API error response:', errorText);
      
      let errorMessage = `OpenAI API error: ${openAIResponse.status} - ${openAIResponse.statusText}`;
      
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.error?.message) {
          errorMessage = `OpenAI API error: ${errorJson.error.message}`;
        }
      } catch (e) {
        console.log('Could not parse error as JSON');
      }
      
      return new Response(
        JSON.stringify({ 
          success: false,
          error: errorMessage,
          debug: {
            status: openAIResponse.status,
            statusText: openAIResponse.statusText,
            errorResponse: errorText
          }
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const openAIData = await openAIResponse.json();
    console.log('✅ OpenAI response received successfully');

    if (!openAIData.choices?.[0]?.message?.content) {
      console.error('❌ Invalid OpenAI response structure:', openAIData);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Invalid response structure from OpenAI',
          debug: {
            response: openAIData,
            hasChoices: !!openAIData.choices,
            choicesLength: openAIData.choices?.length || 0,
            firstChoice: openAIData.choices?.[0] || null
          }
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const contentText = openAIData.choices[0].message.content.trim();
    console.log('📄 Raw OpenAI content (first 200 chars):', contentText.substring(0, 200));

    // Clean any potential markdown formatting
    const cleanContent = contentText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    let generatedContent;
    try {
      generatedContent = JSON.parse(cleanContent);
      console.log('✅ Successfully parsed JSON content');
    } catch (parseError) {
      console.error('❌ JSON parse failed:', parseError.message);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Failed to parse AI response as JSON',
          debug: {
            parseError: parseError.message,
            rawContent: contentText,
            cleanedContent: cleanContent
          }
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate the generated content
    const validation = {
      hasQuestion: !!generatedContent.question,
      hasOptions: Array.isArray(generatedContent.options),
      optionsLength: generatedContent.options?.length,
      hasCorrect: typeof generatedContent.correct === 'number',
      correctInRange: typeof generatedContent.correct === 'number' && generatedContent.correct >= 0 && generatedContent.correct <= 3,
      hasExplanation: !!generatedContent.explanation
    };

    console.log('🔍 Content validation:', validation);

    if (!validation.hasQuestion || !validation.hasOptions || validation.optionsLength !== 4 || !validation.hasCorrect || !validation.correctInRange || !validation.hasExplanation) {
      console.error('❌ Content validation failed:', generatedContent);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Generated content failed validation',
          debug: {
            content: generatedContent,
            validation: validation
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

    console.log('🎯 Final content prepared successfully');
    console.log('📤 Returning success response');

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
    console.error('💥 Unexpected error in function:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: `Server error: ${error.message}`,
        debug: {
          errorName: error.name,
          errorMessage: error.message,
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
