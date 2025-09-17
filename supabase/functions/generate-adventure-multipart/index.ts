// Simplified Multi-Prompt Adventure Generation Edge Function
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Enhanced logging
function logInfo(message: string, data?: any) {
  const timestamp = new Date().toISOString();
  if (data) {
    console.log(`[${timestamp}] ℹ️  ${message}`, JSON.stringify(data, null, 2));
  } else {
    console.log(`[${timestamp}] ℹ️  ${message}`);
  }
}

function logError(message: string, error?: any) {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] ❌ ${message}`, error);
}

function logSuccess(message: string, data?: any) {
  const timestamp = new Date().toISOString();
  if (data) {
    console.log(`[${timestamp}] ✅ ${message}`, JSON.stringify(data, null, 2));
  } else {
    console.log(`[${timestamp}] ✅ ${message}`);
  }
}

// Simplified AI call for testing
async function callOpenAI(prompt: string): Promise<any> {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIApiKey) {
    logError('OpenAI API key not configured');
    throw new Error('OpenAI API key not configured');
  }

  logInfo('🤖 Calling OpenAI...');

  try {
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
            content: 'Du er en uddannelsesekspert. Returner valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      logError(`OpenAI API error: ${response.status}`, errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    logSuccess('✅ OpenAI response received');
    return data;

  } catch (error) {
    logError('Error calling OpenAI', error);
    throw error;
  }
}

// Simple adventure generator
async function generateSimpleAdventure(context: any) {
  logInfo('🚀 Starting simple adventure generation', context);
  
  const prompt = `Lav en simpel adventure for "${context.title}" til ${context.gradeLevel}. klasse.
  
  Returner JSON format:
  {
    "title": "${context.title}",
    "description": "En kort beskrivelse af adventure",
    "phases": [
      {
        "name": "Intro",
        "duration": 30,
        "activity": "Beskrivelse af aktivitet"
      }
    ],
    "success": true
  }`;

  try {
    const response = await callOpenAI(prompt);
    const content = response.choices[0].message.content;
    
    try {
      const parsed = JSON.parse(content);
      logSuccess('✅ Adventure generated successfully');
      return parsed;
    } catch (parseError) {
      logError('Failed to parse JSON', parseError);
      // Return fallback response
      return {
        title: context.title,
        description: "En spændende læringseventyr venter!",
        phases: [
          {
            name: "Intro",
            duration: 30,
            activity: "Start din adventure"
          }
        ],
        success: true
      };
    }
  } catch (error) {
    logError('Error generating adventure', error);
    throw error;
  }
}

// Main request handler
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    logInfo('📋 Handling CORS preflight');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logInfo('🚀 Starting generate-adventure-multipart function');

    const requestData = await req.json();
    logInfo('📨 Received request data', {
      adventure: requestData.adventure?.title,
      subject: requestData.adventure?.subject
    });

    // Extract context
    const context = {
      title: requestData.adventure?.title || 'Learning Adventure',
      subject: requestData.adventure?.subject || 'General',
      gradeLevel: requestData.adventure?.gradeLevel || 7,
      interests: requestData.studentProfile?.interests || ['learning']
    };

    logInfo('📋 Adventure context', context);

    // Generate adventure
    const adventure = await generateSimpleAdventure(context);

    logSuccess('✅ Adventure generation completed');

    return new Response(JSON.stringify({
      success: true,
      lesson: {
        title: adventure.title,
        description: adventure.description,
        stages: adventure.phases || [],
        activities: adventure.phases || []
      },
      generationType: 'multi-prompt-simplified',
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    logError('❌ Error in generate-adventure-multipart', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Unknown error occurred',
      lesson: {
        title: "Test Adventure",
        description: "En simpel test adventure",
        stages: [
          {
            name: "Test Phase",
            duration: 30,
            activity: "Test aktivitet"
          }
        ],
        activities: []
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200, // Return 200 even on error to avoid CORS issues
    });
  }
});