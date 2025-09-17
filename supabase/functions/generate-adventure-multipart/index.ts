// Simplified Multi-Prompt Adventure Generation Edge Function with Budget Control
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { BudgetGuard, extractUsageFromLLMResponse, type StepName } from "../_shared/BudgetGuard.ts";

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

// Budget Guard Configuration
const PLANNED_STEPS: StepName[] = ["hook", "phaseplan", "narrative", "quiz", "writing", "scenario", "images", "exit", "validator"];

function modelSpec(name: string, in_cost: number, out_cost: number, maxOut = 2048) {
  return { name, in_per_mtok: in_cost, out_per_mtok: out_cost, max_output_tokens: maxOut };
}

const budgetGuard = new BudgetGuard({
  plannedSteps: PLANNED_STEPS,
  tokenBudgetTotal: Number(Deno.env.get("TOKEN_BUDGET_TOTAL") ?? "18000"),
  costCapUSD: Deno.env.get("COST_CAP_USD") ? Number(Deno.env.get("COST_CAP_USD")) : undefined,
  jsonMinified: (Deno.env.get("USE_JSON_MINIFIED") ?? "true").toLowerCase() === "true",
  reserveForCritical: 1500,
  modelMap: {
    hook: modelSpec(Deno.env.get("MODEL_HOOK") ?? "gpt-4o-mini", 0.15, 0.6, 256),
    phaseplan: modelSpec(Deno.env.get("MODEL_PHASEPLAN") ?? "gpt-4o-mini", 0.15, 0.6, 1024),
    narrative: modelSpec(Deno.env.get("MODEL_NARRATIVE") ?? "gpt-4o-mini", 0.15, 0.6, 512),
    quiz: modelSpec(Deno.env.get("MODEL_QUIZ") ?? "gpt-4o-mini", 0.15, 0.6, 700),
    writing: modelSpec(Deno.env.get("MODEL_WRITING") ?? "gpt-4o-mini", 0.15, 0.6, 900),
    scenario: modelSpec(Deno.env.get("MODEL_SCENARIO") ?? "gpt-4o-mini", 0.15, 0.6, 600),
    minigame: modelSpec(Deno.env.get("MODEL_MINIGAME") ?? "gpt-4o-mini", 0.15, 0.6, 400),
    images: modelSpec(Deno.env.get("MODEL_IMAGES") ?? "gpt-4o-mini", 0.15, 0.6, 160),
    exit: modelSpec(Deno.env.get("MODEL_EXIT") ?? "gpt-4o-mini", 0.15, 0.6, 180),
    validator: modelSpec(Deno.env.get("MODEL_VALIDATOR") ?? "gpt-4o-mini", 0.15, 0.6, 200),
    enrichment: modelSpec(Deno.env.get("MODEL_ENRICH") ?? "gpt-4o-mini", 0.15, 0.6, 200),
  },
  stepConfig: {
    hook: { priority: 1, default_max_output_tokens: 180 },
    phaseplan: { priority: 1, default_max_output_tokens: 900 },
    narrative: { priority: 2, default_max_output_tokens: 400 },
    quiz: { priority: 1, default_max_output_tokens: 700 },
    writing: { priority: 1, default_max_output_tokens: 900 },
    scenario: { priority: 2, default_max_output_tokens: 600 },
    minigame: { priority: 3, default_max_output_tokens: 300 },
    images: { priority: 3, default_max_output_tokens: 140 },
    exit: { priority: 2, default_max_output_tokens: 150 },
    validator: { priority: 1, default_max_output_tokens: 120 },
    enrichment: { priority: 3, default_max_output_tokens: 180 },
  },
});

// Budget-aware AI call
async function callOpenAI(model: string, system: string, user: string, max_tokens: number): Promise<{text: string; usage?: any; raw: any}> {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIApiKey) {
    logError('OpenAI API key not configured');
    throw new Error('OpenAI API key not configured');
  }

  logInfo(`🤖 Calling OpenAI (${model}, max_tokens: ${max_tokens})...`);

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user }
        ],
        max_tokens,
        temperature: 0.7
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      logError(`OpenAI API error: ${response.status}`, errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content ?? "";
    const usage = extractUsageFromLLMResponse(data);
    
    logSuccess('✅ OpenAI response received');
    return { text, usage, raw: data };

  } catch (error) {
    logError('Error calling OpenAI', error);
    throw error;
  }
}

// Generate hook step
async function generateHook(context: any) {
  const begin = budgetGuard.beginStep("hook");
  if (!begin.allowed) {
    logInfo(`❌ Hook step skipped: ${begin.reason}`);
    return { skipped: true, reason: begin.reason };
  }

  const system = "Du skriver kun JSON: {text, image_prompt}. Max 120 ord i text.";
  const user = JSON.stringify({ 
    adventureId: context.title, 
    title: context.title, 
    grade: context.gradeLevel 
  });

  try {
    const { text, usage } = await callOpenAI(begin.model.name, system, user, begin.max_tokens);
    budgetGuard.finishStep(begin.logIndex, usage);

    // Parse JSON response
    const match = text.match(/\{[\s\S]*\}/);
    const jsonText = match ? match[0] : text;
    const data = JSON.parse(jsonText);
    
    logSuccess('✅ Hook generated successfully');
    return { data };
  } catch (error) {
    budgetGuard.finishStep(begin.logIndex, text);
    logError('Error generating hook', error);
    return { 
      data: { 
        text: "Welcome to an exciting learning adventure!", 
        image_prompt: "students learning together" 
      } 
    };
  }
}

// Generate phase plan step
async function generatePhaseplan(context: any) {
  const begin = budgetGuard.beginStep("phaseplan");
  if (!begin.allowed) {
    logInfo(`❌ Phaseplan step skipped: ${begin.reason}`);
    return { skipped: true, reason: begin.reason };
  }

  const system = "Du er en uddannelsesekspert. Returner valid JSON.";
  const prompt = `Lav en detaljeret phaseplan for "${context.title}" til ${context.gradeLevel}. klasse.
  
  Returner JSON format:
  {
    "title": "${context.title}",
    "description": "En kort beskrivelse af adventure",
    "phases": [
      {
        "name": "Phase navn",
        "duration": 30,
        "activity": "Detaljeret beskrivelse af aktivitet"
      }
    ]
  }`;

  try {
    const { text, usage } = await callOpenAI(begin.model.name, system, prompt, begin.max_tokens);
    budgetGuard.finishStep(begin.logIndex, usage);

    // Parse JSON response
    const match = text.match(/\{[\s\S]*\}/);
    const jsonText = match ? match[0] : text;
    const data = JSON.parse(jsonText);
    
    logSuccess('✅ Phaseplan generated successfully');
    return { data };
  } catch (error) {
    budgetGuard.finishStep(begin.logIndex, text);
    logError('Error generating phaseplan', error);
    return {
      data: {
        title: context.title,
        description: "En spændende læringseventyr venter!",
        phases: [
          {
            name: "Intro",
            duration: 30,
            activity: "Start din adventure"
          }
        ]
      }
    };
  }
}

// Budget-controlled adventure generator
async function generateBudgetAdventure(context: any) {
  logInfo('🚀 Starting budget-controlled adventure generation', context);
  
  // Generate hook
  const hookResult = await generateHook(context);
  
  // Generate main phase plan
  const phasePlanResult = await generatePhaseplan(context);
  
  // Use phaseplan data or fallback
  const adventureData = phasePlanResult.data || {
    title: context.title,
    description: "En spændende læringseventyr venter!",
    phases: [
      {
        name: "Intro",
        duration: 30,
        activity: "Start din adventure"
      }
    ]
  };

  logSuccess('✅ Budget adventure generated successfully');
  return adventureData;
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

    // Generate adventure with budget control
    const adventure = await generateBudgetAdventure(context);

    logSuccess('✅ Adventure generation completed');

    return new Response(JSON.stringify({
      success: true,
      lesson: {
        title: adventure.title,
        subject: context.subject,
        gradeLevel: context.gradeLevel,
        scenario: adventure.description,
        learningObjectives: ["Learn through hands-on experience", "Develop creative skills"],
        stages: (adventure.phases || []).map((phase: any, index: number) => ({
          id: `stage-${index + 1}`,
          title: phase.name || `Stage ${index + 1}`,
          description: phase.activity || "Adventure activity",
          duration: phase.duration || 30,
          storyText: phase.activity,
          activities: [{
            type: 'creativeTask',
            title: phase.name || `Stage ${index + 1}`,
            instructions: phase.activity || "Complete this stage to continue your adventure!"
          }]
        })),
        estimatedTime: (adventure.phases || []).reduce((total: number, phase: any) => total + (phase.duration || 30), 0)
      },
      generationType: 'multi-prompt-budget-controlled',
      timestamp: new Date().toISOString(),
      meta: {
        budget: budgetGuard.report()
      }
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