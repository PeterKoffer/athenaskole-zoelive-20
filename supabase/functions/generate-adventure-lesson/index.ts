import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AdventureRequest {
  adventureTitle: string;
  subject: string;
  gradeLevel: number;
  interests?: string[];
  calendarKeywords?: string[];
  lessonDuration?: number;
}

// Create epic adventure prompt that generates truly exciting educational content
function createEpicAdventurePrompt(request: AdventureRequest): string {
  const {
    adventureTitle,
    subject,
    gradeLevel,
    interests = ['adventure', 'mystery', 'technology'],
    calendarKeywords = ['interactive learning'],
    lessonDuration = 135
  } = request;

  const interestText = interests.join(', ');
  const contextText = calendarKeywords.join(', ');

  return `🎬 CREATE AN EPIC EDUCATIONAL ADVENTURE! 🎬

Title: "${adventureTitle}"
Subject: ${subject} | Grade: ${gradeLevel} | Duration: ${lessonDuration} min
Student Interests: ${interestText}

🔥 MAKE THIS FEEL LIKE A BLOCKBUSTER MOVIE OR VIDEO GAME!

This should be:
- A thrilling story with high stakes and dramatic tension
- An immersive world where students are the heroes
- A quest where ${subject} knowledge is their superpower
- An adventure with plot twists, mysteries, and epic moments

🎯 STORY FORMULA:
1. HOOK: Dramatic opening crisis that demands immediate action
2. QUEST: Epic journey with escalating challenges and discoveries  
3. CLIMAX: Final showdown where everything depends on their knowledge
4. VICTORY: Triumphant resolution with celebration of learning

📚 EDUCATIONAL INTEGRATION:
- ${subject} concepts must be essential to survival/success in the story
- Knowledge unlocks new abilities or solves critical problems
- Learning feels like gaining superpowers or secret knowledge
- Grade ${gradeLevel} appropriate complexity woven into adventure

🎮 ACTIVITY TYPES:
- "Decode the Ancient Message" (multiple choice with story consequences)
- "Hack the Enemy System" (problem-solving under pressure)
- "Navigate the Dangerous Territory" (apply knowledge to survive)
- "Build Your Escape Device" (creative engineering challenge)
- "Negotiate with Aliens" (use concepts to communicate)

⚡ EXCITEMENT ELEMENTS:
- Countdown timers and urgent deadlines
- Plot twists that shock and surprise
- Characters in danger who need rescuing
- Discoveries that change everything
- Epic battles between good and evil
- Mysterious powers to unlock

Return ONLY this JSON structure with THRILLING content:

{
  "title": "${adventureTitle}",
  "subject": "${subject}",
  "gradeLevel": ${gradeLevel},
  "scenario": "You are [heroic role] when [shocking crisis] threatens [people/world/mission]. Only your ${subject} skills can [save the day/unlock the mystery/defeat the enemy]. Time is running out...",
  "learningObjectives": [
    "Master ${subject} through life-or-death challenges",
    "Use knowledge as your superpower to overcome impossible odds",
    "Apply learning in high-stakes situations that matter"
  ],
  "stages": [
    {
      "id": "crisis-strikes",
      "title": "Crisis Strikes!",
      "description": "Something terrible happens - heroes needed immediately!",
      "duration": ${Math.round(lessonDuration * 0.3)},
      "storyText": "🚨 EMERGENCY ALERT! [Dramatic crisis] has just occurred! You're the only one who can [heroic mission] using ${subject}. The countdown has begun...",
      "activities": [
        {
          "type": "multipleChoice",
          "title": "Emergency Response",
          "instructions": "Lives are at stake! Make the right choice or face disaster!",
          "content": {
            "question": "Critical ${subject} challenge where wrong answer = catastrophe in the story",
            "options": [
              "Heroic action that saves lives",
              "Clever solution that outwits danger", 
              "Dangerous choice that risks everything",
              "Safe option that might be too slow"
            ],
            "correctAnswer": 1,
            "explanation": "🎉 BRILLIANT! Your ${subject} knowledge just saved everyone! Here's how this works and why it was the perfect choice...",
            "points": 50
          }
        }
      ]
    },
    {
      "id": "epic-quest",
      "title": "The Epic Quest",
      "description": "Journey into danger with your newfound powers",
      "duration": ${Math.round(lessonDuration * 0.4)},
      "storyText": "🗡️ PLOT TWIST! You discover [shocking revelation] that changes everything! Now you must [epic challenge] while [dramatic obstacle]. Your ${subject} abilities are evolving...",
      "activities": [
        {
          "type": "multipleChoice",
          "title": "The Ultimate Test",
          "instructions": "Everything depends on this moment! Choose your destiny!",
          "content": {
            "question": "Advanced ${subject} puzzle that unlocks the path to victory",
            "options": [
              "Unleash your full power",
              "Use stealth and cunning",
              "Rally allies to your cause", 
              "Sacrifice yourself for others"
            ],
            "correctAnswer": 0,
            "explanation": "⚡ INCREDIBLE! You've unlocked your true potential! This ${subject} mastery reveals the secret to [story resolution]...",
            "points": 75
          }
        },
        {
          "type": "creativeTask",
          "title": "Build Your Legendary Tool",
          "instructions": "Design the ultimate device/plan/solution using your ${subject} mastery to overcome the final challenge!"
        }
      ]
    },
    {
      "id": "final-showdown",
      "title": "Final Showdown",
      "description": "The epic climax - save the world!",
      "duration": ${Math.round(lessonDuration * 0.3)},
      "storyText": "🏆 THE FINAL BATTLE! Face-to-face with [ultimate villain/challenge]. Everything you've learned has led to this moment. The fate of [world/universe/people] rests in your hands. 3... 2... 1... FIGHT!",
      "activities": [
        {
          "type": "multipleChoice",
          "title": "Victory or Defeat",
          "instructions": "This is it! One final test to prove you're the ultimate ${subject} hero!",
          "content": {
            "question": "Master-level ${subject} challenge that brings together everything from your journey",
            "options": [
              "Channel all your knowledge into one devastating attack",
              "Use wisdom and strategy to outmaneuver the enemy",
              "Inspire others with your incredible understanding",
              "Transform the enemy through the power of education"
            ],
            "correctAnswer": 3,
            "explanation": "🎆 LEGENDARY VICTORY! You didn't just win - you transformed everything! Your ${subject} mastery has created a better world. You are truly a hero!",
            "points": 100
          }
        }
      ]
    }
  ],
  "estimatedTime": ${lessonDuration}
}

CRITICAL REQUIREMENTS:
- Every word must EXCITE and INSPIRE students
- Use action words: "unleash", "discover", "battle", "triumph"
- Students are HEROES, not just learners
- ${subject} knowledge is their SUPERPOWER
- Every choice has DRAMATIC story consequences
- Make them feel like they're IN a movie/game
- Victory should feel EPIC and well-earned

Return ONLY the JSON - no explanations, no markdown, just pure adventure!`;
}

// Enhanced logging for better debugging
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

// Improved OpenAI API call with better error handling
async function callOpenAI(prompt: string) {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!openAIApiKey) {
    throw new Error('OpenAI API key not configured');
  }

  logInfo('🔑 API Key configured: Yes (sk-proj-...)');
  logInfo('🤖 Calling OpenAI for epic adventure generation...');

  const requestBody = {
    model: 'gpt-5-mini-2025-08-07',
    messages: [
      {
        role: 'system' as const,
        content: 'You are an expert educational adventure creator who makes learning feel like the most exciting video game or movie ever. Always return valid JSON responses that will blow students\' minds with excitement!'
      },
      {
        role: 'user' as const,
        content: prompt
      }
    ],
    max_completion_tokens: 4000,
    response_format: { type: "json_object" as const }
  };

  logInfo('📤 Request body preview', {
    model: requestBody.model,
    messages: requestBody.messages.map(m => ({ role: m.role, content: m.content.substring(0, 100) + '...' })),
    max_completion_tokens: requestBody.max_completion_tokens
  });

  logInfo('📝 Prompt preview', prompt.substring(0, 200) + '...');
  logInfo('✏️ Generated prompt length', prompt.length);
  logInfo('📤 Request model', requestBody.model);

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  logInfo('📥 Response status', response.status);
  
  if (!response.ok) {
    const errorText = await response.text();
    logError(`OpenAI API error: ${response.status}`, errorText);
    throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
  }

  const responseHeaders: Record<string, string> = {};
  response.headers.forEach((value, key) => {
    responseHeaders[key] = value;
  });
  logInfo('📥 Response headers', responseHeaders);

  const data = await response.json();
  
  logSuccess('✅ Successfully received OpenAI response');
  logInfo('🤖 OpenAI response received', {
    id: data.id,
    model: data.model,
    choices: data.choices?.length,
    usage: data.usage,
    finishReason: data.choices?.[0]?.finish_reason
  });

  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    logError('❌ Invalid OpenAI response - missing choices or message', data);
    throw new Error('Invalid OpenAI response structure');
  }

  const content = data.choices[0].message.content;
  
  if (!content) {
    logError('❌ Invalid OpenAI response - missing content', data);
    
    if (data.choices[0].finish_reason === 'length') {
      logError('❌ Response was truncated due to length limit');
      throw new Error('Response truncated due to length limit. Please try again with a shorter prompt.');
    }
    
    throw new Error('OpenAI response missing content');
  }

  logInfo('📄 Raw content length', content.length);
  logInfo('📄 Response content preview', content.substring(0, 200) + '...');

  return content;
}

// Enhanced JSON parsing with better error handling
function parseAdventureJSON(content: string) {
  logInfo('🔍 Parsing JSON response...');
  
  // Clean the content - remove any markdown or extra text
  let jsonString = content.trim();
  
  // Extract JSON if it's wrapped in code blocks or other text
  const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    jsonString = jsonMatch[0];
    logInfo('📄 Extracted JSON substring', jsonString.substring(0, 200) + '...');
  }

  logInfo('📄 Content preview', jsonString.substring(0, 200) + '...');
  logInfo('📄 Response content length', jsonString.length);

  try {
    const parsed = JSON.parse(jsonString);
    logSuccess('✅ Successfully parsed JSON');
    
    // Validate the adventure structure
    if (!parsed.title || !parsed.subject || !parsed.stages || !Array.isArray(parsed.stages)) {
      logError('❌ Invalid adventure structure - missing required fields');
      throw new Error('Invalid adventure structure');
    }

    if (parsed.stages.length === 0) {
      logError('❌ Adventure has no stages');
      throw new Error('Adventure must have at least one stage');
    }

    logInfo('📚 Parsed lesson preview', {
      title: parsed.title,
      subject: parsed.subject,
      gradeLevel: parsed.gradeLevel,
      stagesCount: parsed.stages.length,
      scenario: parsed.scenario?.substring(0, 100) + '...'
    });

    logSuccess('✅ Adventure validation passed');
    return parsed;
    
  } catch (error) {
    logError('❌ JSON parsing failed', error);
    logError('📄 Failed content', jsonString.substring(0, 500));
    throw new Error(`Failed to parse adventure JSON: ${error.message}`);
  }
}

// Main adventure generation function
async function generateEpicAdventure(request: AdventureRequest) {
  logInfo('🚀 Starting epic adventure generation for', request.adventureTitle);
  logInfo('📨 Received request for adventure', request.adventureTitle);

  // Build the epic adventure prompt
  const prompt = createEpicAdventurePrompt(request);
  logInfo('📋 Built epic adventure context', {
    subject: request.subject,
    gradeLevel: request.gradeLevel,
    lessonDuration: request.lessonDuration,
    studentInterests: request.interests
  });

  // Generate content with OpenAI
  const content = await callOpenAI(prompt);
  logInfo('📥 Received OpenAI response');

  // Parse and validate the adventure
  const adventure = parseAdventureJSON(content);
  logSuccess(`✅ Successfully generated epic adventure with ${adventure.stages.length} stages`);

  return adventure;
}

// Main request handler
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logInfo('🚀 Starting generate-adventure-lesson function');

    // Parse request
    const requestData = await req.json();
    logInfo('✅ Adventure metadata valid, generating lesson...');

    // Extract data from the complex frontend structure and map to AdventureRequest
    const adventureRequest: AdventureRequest = {
      adventureTitle: requestData.adventure?.title || 'Epic Learning Adventure',
      subject: requestData.adventure?.subject || 'General Learning',
      gradeLevel: requestData.adventure?.gradeLevel || 7,
      interests: requestData.studentProfile?.interests || ['adventure', 'mystery', 'technology'],
      calendarKeywords: requestData.calendarContext?.keywords || ['interactive learning'],
      lessonDuration: requestData.schoolSettings?.lessonDuration || 135
    };

    logInfo('📋 Mapped adventure request', adventureRequest);

    // Generate the epic adventure
    const adventure = await generateEpicAdventure(adventureRequest);

    // Return the adventure
    return new Response(JSON.stringify(adventure), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    logError('Error in generate-adventure-lesson', error);
    
    // Return a fallback exciting adventure instead of boring content
    const fallbackAdventure = {
      title: "Emergency Mission: Save the Day!",
      subject: "Learning",
      gradeLevel: 7,
      scenario: "🚨 ALERT! A crisis has struck and you're the only one who can solve it! Your knowledge is your superpower - use it wisely to become the hero everyone needs!",
      learningObjectives: [
        "Use your brain as the ultimate problem-solving weapon",
        "Think like a hero under pressure", 
        "Save the day with smart decisions"
      ],
      stages: [
        {
          id: "emergency",
          title: "Emergency Alert!",
          description: "Something's wrong - heroes needed NOW!",
          duration: 45,
          storyText: "🔥 RED ALERT! The situation is critical and time is running out. You have the skills to save everyone - but do you have the courage?",
          activities: [
            {
              type: "multipleChoice",
              title: "First Response",
              instructions: "Quick! What's your first move as the hero?",
              content: {
                question: "When facing an emergency, what's the most important first step?",
                options: [
                  "Panic and run away",
                  "Stop, think, and assess the situation", 
                  "Jump in without a plan",
                  "Wait for someone else to act"
                ],
                correctAnswer: 1,
                explanation: "🎉 Perfect! A true hero always thinks before acting. Your calm, smart approach just saved the day!",
                points: 50
              }
            }
          ]
        }
      ],
      estimatedTime: 45
    };

    return new Response(JSON.stringify(fallbackAdventure), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  }
});