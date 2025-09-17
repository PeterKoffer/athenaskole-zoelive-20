// Structured Adventure Blueprint Generation
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Legacy interface for compatibility with frontend
interface AdventureRequest {
  adventureTitle: string;
  subject: string;
  gradeLevel: number;
  interests: string[];
  calendarKeywords: string[];
  lessonDuration: number;
}

// Comprehensive Blueprint Types
type AdaptiveLevel = "remedial" | "core" | "stretch";

interface AdventureBlueprint {
  version: "nelie.adventure.v1";
  adventure: {
    id: string;
    title: string;
    forhistory_hook: {
      text: string;
      image_prompt: string;
    };
    learning_goals: Array<{
      subject: string;
      curriculum_ref: string;
      goal: string;
    }>;
    parameters: {
      grade: number;
      curriculum: string;
      school_philosophy: string;
      teacher_weights: Record<string, number>;
      lesson_duration_minutes: number;
      student_ability: string;
      learning_style: string[];
      interests: string[];
      calendar: {
        keywords: string[];
        day_minutes: number;
      };
    };
    timebox_policy: {
      total_minutes: number;
      phase_budgeting: string;
      checkpoint_every_minutes: number;
      grace_period_minutes: number;
      fallback_rule: string;
    };
    global_pacing_controls: {
      adaptive_levels: AdaptiveLevel[];
      difficulty_band: {
        min: number;
        target: number;
        max: number;
      };
      mastery_gate_policy: string;
      branching_mode: string;
    };
    phases: Array<{
      id: string;
      name: string;
      target_minutes: {
        core: number;
        min: number;
        max: number;
      };
      objective: string;
      narrative: string;
      activities: Array<{
        type: string;
        subject: string;
        estimated_minutes: number;
        adaptive?: {
          level_map: Record<AdaptiveLevel, string>;
        };
        input_spec?: Record<string, unknown>;
        scoring?: {
          auto: boolean;
          partial_credit?: boolean;
        };
        hints?: number;
        success_criteria?: string;
        remediation?: {
          offer: boolean;
          max_minutes: number;
          content: string;
        };
        enrichment?: {
          offer: boolean;
          max_minutes: number;
          content: string;
        };
        decisions?: number;
        feedback_mode?: string;
        items?: Array<{
          format: string;
          prompt: string;
        }>;
        rubric?: Array<{
          dimension: string;
          scale: string;
        }>;
        next_step_rules?: Array<{
          if: string;
          then: string;
        }>;
      }>;
      assets?: {
        images?: Array<{
          role: string;
          prompt: string;
        }>;
      };
      checkpoints?: Array<{
        minute: number;
        ensure: string;
        on_miss: string;
      }>;
    }>;
    assessment_summary: {
      auto_scored: string[];
      teacher_review: string[];
      mastery_gate_results: Record<string, string>;
    };
    time_adaptation_runtime_rules: Array<{
      if: string;
      then: string[];
    }>;
    validation: {
      age_fit: boolean;
      curriculum_coverage_ok: boolean;
      token_budget_ok: boolean;
      notes?: string;
    };
  };
}

// Create structured blueprint prompt for comprehensive educational adventures
function createStructuredAdventurePrompt(request: AdventureRequest): string {
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

  return `Du er en uddannelsesarkitekt der genererer strukturerede læringseventyr som JSON-blueprints. 

Du skal skabe spændende, sammenhængende undervisning der:
- Integrerer faglige mål naturligt i en adventure-historie
- Sikrer alle elever samme tidsramme men med tilpasset sværhedsgrad
- Kombinerer multiple fag i samme adventure
- Inkluderer checkpoints for at holde klassen synkron
- Har adaptive aktiviteter der tilpasser sig elevens niveau

ADVENTURE: "${adventureTitle}"
HOVEDFAG: ${subject}
KLASSETRIN: ${gradeLevel}  
ELEVINTERESSER: ${interestText}
KALENDER: ${contextText}
TOTAL MINUTTER: ${lessonDuration}

Returner præcis dette JSON-skema:

{
  "version": "nelie.adventure.v1",
  "adventure": {
    "id": "adventure-${Date.now()}",
    "title": "${adventureTitle}",
    "forhistory_hook": {
      "text": "2-3 dramatiske sætninger der starter eventyret. Du er hovedpersonen i en spændende historie hvor din viden bliver din superkraft...",
      "image_prompt": "Epic adventure scene with students as heroes"
    },
    "learning_goals": [
      {"subject": "${subject}", "curriculum_ref": "DK/${subject}/${gradeLevel}.1", "goal": "Anvende ${subject} i spændende problemløsning"},
      {"subject": "Tværfagligt", "curriculum_ref": "DK/Mixed/${gradeLevel}.1", "goal": "Integrere viden på tværs af fag"}
    ],
    "parameters": {
      "grade": ${gradeLevel},
      "curriculum": "DK-Common", 
      "school_philosophy": "Adventure-based epic learning",
      "teacher_weights": {"${subject}": 0.5, "Other": 0.5},
      "lesson_duration_minutes": ${lessonDuration},
      "student_ability": "mixed",
      "learning_style": ["visual", "kinesthetic", "narrative"],
      "interests": ${JSON.stringify(interests)},
      "calendar": {"keywords": ${JSON.stringify(calendarKeywords)}, "day_minutes": ${lessonDuration}}
    },
    "timebox_policy": {
      "total_minutes": ${lessonDuration},
      "phase_budgeting": "fixed_core+elastic_enrichment",
      "checkpoint_every_minutes": 15,
      "grace_period_minutes": 5,
      "fallback_rule": "prefer_core_completion_over_enrichment"
    },
    "global_pacing_controls": {
      "adaptive_levels": ["remedial", "core", "stretch"],
      "difficulty_band": {"min": 0.8, "target": 1.0, "max": 1.2},
      "mastery_gate_policy": "soft-gate-with-recap",
      "branching_mode": "linear-core-with-optional-sidequests"
    },
    "phases": [
      {
        "id": "phase-1",
        "name": "Eventyret Begynder",
        "target_minutes": {"core": ${Math.round(lessonDuration * 0.25)}, "min": ${Math.round(lessonDuration * 0.2)}, "max": ${Math.round(lessonDuration * 0.3)}},
        "objective": "Introducer adventure-verdenen og diagnosticer elevniveau",
        "narrative": "🚨 KRISEALARMEN LYDER! Du befinder dig pludselig i en situation hvor kun din ${subject}-viden kan redde dagen. Hvad gør du først?",
        "activities": [
          {
            "type": "diagnostic_adventure_start",
            "subject": "${subject}",
            "estimated_minutes": ${Math.round(lessonDuration * 0.15)},
            "adaptive": {
              "level_map": {
                "remedial": "3 guidede opgaver med ekstra hjælp",
                "core": "5 standardopgaver i adventure-kontekst", 
                "stretch": "7 udfordrende opgaver med bonus elementer"
              }
            },
            "success_criteria": ">= 70% korrekte for at fortsætte adventure",
            "next_step_rules": [
              {"if": "score < 0.7", "then": "unlock_remedial_adventure_training"},
              {"if": "score >= 0.9", "then": "offer_hero_mode_challenges"}
            ]
          }
        ],
        "assets": {"images": [{"role": "scene", "prompt": "Student hero starting epic ${subject} adventure"}]},
        "checkpoints": [{"minute": ${Math.round(lessonDuration * 0.2)}, "ensure": "adventure started and diagnostic done", "on_miss": "skip optional story elements"}]
      },
      {
        "id": "phase-2", 
        "name": "Heltens Rejse",
        "target_minutes": {"core": ${Math.round(lessonDuration * 0.4)}, "min": ${Math.round(lessonDuration * 0.35)}, "max": ${Math.round(lessonDuration * 0.45)}},
        "objective": "Mestre ${subject} gennem spændende udfordringer",
        "narrative": "⚡ DIT FØRSTE STORE TEST! Adventure-verdenen præsenterer dig for komplekse udfordringer. Din ${subject}-viden vokser og bliver stærkere for hver opgave du løser...",
        "activities": [
          {
            "type": "epic_problem_solving",
            "subject": "${subject}",
            "estimated_minutes": ${Math.round(lessonDuration * 0.25)},
            "adaptive": {
              "level_map": {
                "remedial": "Trinvis guidning + 4 opgaver med støtte",
                "core": "6 progressivt sværere adventure-opgaver",
                "stretch": "8 komplekse multi-step challenges + bonus quests"
              }
            },
            "scoring": {"auto": true, "partial_credit": true},
            "hints": 2,
            "success_criteria": ">= 75% eller fuldført med hjælp",
            "remediation": {"offer": true, "max_minutes": 8, "content": "${subject} adventure boot camp"},
            "enrichment": {"offer": true, "max_minutes": 12, "content": "Hero-level ${subject} mastery challenges"}
          },
          {
            "type": "creative_adventure_task",
            "subject": "Tværfagligt", 
            "estimated_minutes": ${Math.round(lessonDuration * 0.1)},
            "adaptive": {
              "level_map": {
                "remedial": "Guidet kreativitet med skabeloner",
                "core": "Fri kreativ opgave med ${subject} fokus",
                "stretch": "Avanceret kreativ projekt med multiple løsninger"
              }
            }
          }
        ],
        "checkpoints": [{"minute": ${Math.round(lessonDuration * 0.6)}, "ensure": "main challenges completed", "on_miss": "skip enrichment, go to wrap-up"}]
      },
      {
        "id": "phase-3",
        "name": "Den Ultimative Test", 
        "target_minutes": {"core": ${Math.round(lessonDuration * 0.35)}, "min": ${Math.round(lessonDuration * 0.25)}, "max": ${Math.round(lessonDuration * 0.4)}},
        "objective": "Anvende al læring i episk finale og reflektere",
        "narrative": "🏆 DEN STORE FINALE! Alt hvad du har lært gennem adventure skal nu bruges i det ultimative opgør. Kan du blive den helt verden har brug for?",
        "activities": [
          {
            "type": "master_challenge",
            "subject": "${subject}",
            "estimated_minutes": ${Math.round(lessonDuration * 0.2)},
            "adaptive": {
              "level_map": {
                "remedial": "Trinvist master-challenge med støtte",
                "core": "Komplet ${subject} integration challenge",
                "stretch": "Multi-layered master quest med innovation"
              }
            },
            "decisions": 3,
            "feedback_mode": "immediate",
            "success_criteria": "Succesfuld anvendelse af ${subject} i finale"
          },
          {
            "type": "hero_reflection",
            "subject": "Tværfagligt",
            "estimated_minutes": ${Math.round(lessonDuration * 0.1)},
            "items": [
              {"format": "adventure_reflection", "prompt": "Hvordan føltes det at være helt? Hvad var din superkraft?"},
              {"format": "learning_celebration", "prompt": "Hvilken ${subject}-viden reddede dagen?"},
              {"format": "hero_rating", "prompt": "Rate din helt-performance (1-5 stjerner)"}
            ]
          }
        ]
      }
    ],
    "assessment_summary": {
      "auto_scored": ["phase-1.diagnostic_adventure_start", "phase-2.epic_problem_solving", "phase-3.master_challenge"],
      "teacher_review": ["phase-2.creative_adventure_task", "phase-3.hero_reflection"],
      "mastery_gate_results": {"${subject}": "adventure_complete"}
    },
    "time_adaptation_runtime_rules": [
      {"if": "behind_schedule", "then": ["trim:enrichment", "reduce:creative_time", "focus:core_objectives"]},
      {"if": "ahead_of_schedule", "then": ["unlock:stretch", "add:bonus_sidequests<=15m", "enhance:storytelling"]}
    ],
    "validation": {
      "age_fit": true,
      "curriculum_coverage_ok": true, 
      "token_budget_ok": true,
      "notes": "Epic adventure blueprint with ${lessonDuration}min structure and adaptive difficulty"
    }
  }
}

KRAV:
- Skab spændende narrativ der gør ${subject} til en superkraft
- Brug elevinteresser: ${interestText} aktivt i story og karakterer  
- Integrer kalender kontekst: ${contextText}
- Tilpas til klassetrin ${gradeLevel} sprog og kompleksitet
- Sikr total tid på ${lessonDuration} minutter fordelt intelligent
- Alle aktiviteter skal føles som naturlige dele af adventure
- Elever er HELTE, ikke bare studerende

Returner KUN valid JSON.`;
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

// Enhanced JSON parsing for adventure blueprints
function parseAdventureBlueprintJSON(content: string): AdventureBlueprint {
  logInfo('🔍 Parsing adventure blueprint JSON response...');
  
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
    logSuccess('✅ Successfully parsed adventure blueprint JSON');
    
    // Validate the adventure blueprint structure
    if (!parsed.version || parsed.version !== "nelie.adventure.v1") {
      logError('❌ Invalid adventure blueprint version');
      throw new Error('Invalid adventure blueprint version');
    }

    if (!parsed.adventure || !parsed.adventure.title || !parsed.adventure.phases) {
      logError('❌ Invalid adventure blueprint structure - missing required fields');
      throw new Error('Invalid adventure blueprint structure');
    }

    if (!Array.isArray(parsed.adventure.phases) || parsed.adventure.phases.length === 0) {
      logError('❌ Adventure blueprint has no phases');
      throw new Error('Adventure blueprint must have at least one phase');
    }

    logInfo('📚 Parsed adventure blueprint preview', {
      version: parsed.version,
      title: parsed.adventure.title,
      totalMinutes: parsed.adventure.timebox_policy?.total_minutes,
      phasesCount: parsed.adventure.phases.length,
      learningGoals: parsed.adventure.learning_goals?.length || 0
    });

    logSuccess('✅ Adventure blueprint validation passed');
    return parsed as AdventureBlueprint;
    
  } catch (error) {
    logError('❌ Adventure blueprint JSON parsing failed', error);
    logError('📄 Failed content', jsonString.substring(0, 500));
    throw new Error(`Failed to parse adventure blueprint JSON: ${error.message}`);
  }
}

// Main structured adventure generation function
async function generateStructuredAdventure(request: AdventureRequest): Promise<AdventureBlueprint> {
  logInfo('🚀 Starting structured adventure blueprint generation for', request.adventureTitle);
  logInfo('📨 Received request for adventure', request.adventureTitle);

  // Build the structured adventure prompt
  const prompt = createStructuredAdventurePrompt(request);
  logInfo('📋 Built structured adventure context', {
    subject: request.subject,
    gradeLevel: request.gradeLevel,
    lessonDuration: request.lessonDuration,
    studentInterests: request.interests
  });

  // Generate content with OpenAI
  const content = await callOpenAI(prompt);
  logInfo('📥 Received OpenAI response');

  // Parse and validate the adventure blueprint
  const adventure = parseAdventureBlueprintJSON(content);
  logSuccess(`✅ Successfully generated structured adventure with ${adventure.adventure.phases.length} phases`);

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

    // Generate the structured adventure blueprint
    const adventure = await generateStructuredAdventure(adventureRequest);

    // Return the adventure blueprint
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