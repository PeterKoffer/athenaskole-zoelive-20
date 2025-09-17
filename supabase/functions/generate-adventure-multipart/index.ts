// Multi-Prompt Adventure Generation Edge Function
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AdventureContext {
  adventureId: string;
  title: string;
  subject: string;
  gradeLevel: number;
  interests: string[];
  calendarKeywords: string[];
  totalMinutes: number;
  studentAbility: 'remedial' | 'core' | 'stretch';
}

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

// AI call wrapper
async function callAI(prompt: string, context: string = "general"): Promise<any> {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIApiKey) {
    throw new Error('OpenAI API key not configured');
  }

  logInfo(`🤖 Calling AI for: ${context}`);

  const requestBody = {
    model: 'gpt-5-mini-2025-08-07',
    messages: [
      {
        role: 'system' as const,
        content: 'Du er en ekspert uddannelsesarkitekt der laver strukturerede, spændende adventures. Returner altid valid JSON som specificeret i prompten.'
      },
      {
        role: 'user' as const,
        content: prompt
      }
    ],
    max_completion_tokens: 3000,
    response_format: { type: "json_object" as const }
  };

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    logError(`OpenAI API error for ${context}: ${response.status}`, errorText);
    throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  
  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    logError(`Invalid OpenAI response for ${context}`, data);
    throw new Error(`Invalid OpenAI response for ${context}`);
  }

  const content = data.choices[0].message.content;
  
  try {
    const parsed = JSON.parse(content);
    logSuccess(`✅ Successfully parsed JSON for ${context}`);
    return parsed;
  } catch (error) {
    logError(`Failed to parse JSON for ${context}`, error);
    logError('Raw content:', content);
    throw new Error(`Failed to parse JSON for ${context}: ${error.message}`);
  }
}

// 1. Master Template Generator
function generateMasterTemplate(context: AdventureContext) {
  const phaseCount = Math.max(3, Math.min(6, Math.ceil(context.totalMinutes / 35)));
  
  return {
    totalMinutes: context.totalMinutes,
    phaseCount,
    structure: 'intro → learning → practice → integration → reflection',
    timeAllocation: {
      intro: Math.round(context.totalMinutes * 0.15),
      learning: Math.round(context.totalMinutes * 0.35),
      practice: Math.round(context.totalMinutes * 0.30),
      integration: Math.round(context.totalMinutes * 0.15),
      reflection: Math.round(context.totalMinutes * 0.05)
    }
  };
}

// 2. Forhistorie Generator
async function generateForhistorie(context: AdventureContext) {
  const prompt = `Skriv en fængende forhistorie til adventure "${context.title}" for ${context.gradeLevel}. klasse.

KRAV:
- Max 120 ord
- 2. person ("Du opdager...")
- Alderssvarende sprog
- Indbygger elevinteresser: ${context.interests.join(', ')}
- Drama og spænding der hægter eleven

RETURNER JSON:
{
  "text": "Forhistorie tekst her...",
  "image_prompt": "Kort beskrivelse til billede-AI",
  "hook_factor": "1-10 rating af hvor fængende det er"
}`;

  return await callAI(prompt, "forhistorie");
}

// 3. Fase Planner
async function generateFasePlan(context: AdventureContext) {
  const template = generateMasterTemplate(context);
  
  const prompt = `Plan ${template.phaseCount} faser for adventure "${context.title}" (${context.totalMinutes} min total).

KONTEKST:
- Hovedfag: ${context.subject}
- Klassetrin: ${context.gradeLevel}
- Elevinteresser: ${context.interests.join(', ')}
- Kalender: ${context.calendarKeywords.join(', ')}

FASE STRUKTUR (følg denne rækkefølge):
1. Intro & Hook (${template.timeAllocation.intro} min)
2. Læring & Opdagelse (${template.timeAllocation.learning} min) 
3. Praktisk Anvendelse (${template.timeAllocation.practice} min)
4. Integration & Kreativitet (${template.timeAllocation.integration} min)
5. Refleksion & Afslutning (${template.timeAllocation.reflection} min)

RETURNER JSON:
{
  "phases": [
    {
      "id": "phase-1",
      "name": "Fase navn",
      "subject": "Primært fag",
      "targetMinutes": antal_minutter,
      "objective": "Hvad eleven skal opnå",
      "order": 1
    }
  ]
}`;

  return await callAI(prompt, "fase-plan");
}

// 4. Quiz Builder
async function generateQuiz(phase: any, context: AdventureContext) {
  const prompt = `Lav quiz til fase "${phase.name}" for ${context.gradeLevel}. klasse.

FAGLIGT FOKUS: ${phase.subject}
MÅL: ${phase.objective}
TID: ${phase.targetMinutes} min (så 4-6 spørgsmål)

ADAPTIVE NIVEAUER:
- Remedial: Enklere formulering, flere hints, trinvis opbygning
- Core: Standard niveau for klassetrinnet  
- Stretch: Udfordrende, kræver dybere forståelse

ADVENTURE KONTEKST: ${context.title}
Spørgsmål skal relatere til adventure-historien.

RETURNER JSON:
{
  "remedial": {
    "questions": [
      {
        "question": "Spørgsmål tekst",
        "choices": ["A", "B", "C", "D"],
        "correct": 0,
        "explanation": "Hvorfor dette er rigtigt",
        "hints": ["Hint 1", "Hint 2"]
      }
    ]
  },
  "core": {
    "questions": [
      {
        "question": "Spørgsmål tekst",
        "choices": ["A", "B", "C", "D"],
        "correct": 0,
        "explanation": "Hvorfor dette er rigtigt"
      }
    ]
  },
  "stretch": {
    "questions": [
      {
        "question": "Spørgsmål tekst",
        "choices": ["A", "B", "C", "D"],
        "correct": 0,
        "explanation": "Hvorfor dette er rigtigt",
        "bonus_challenge": "Ekstra udfordring"
      }
    ]
  }
}`;

  return await callAI(prompt, `quiz-${phase.id}`);
}

// 5. Scenario Builder
async function generateScenario(phase: any, context: AdventureContext) {
  const prompt = `Lav beslutningsscenarie for fase "${phase.name}".

KONTEKST:
- Adventure: ${context.title}
- Fag: ${phase.subject}
- Mål: ${phase.objective}
- Alder: ${context.gradeLevel}

STRUKTUR:
- 2-3 scenarie-situationer
- Hver har 3-4 realistiske valg
- Ét er klart bedre (fagligt korrekt)
- Øjeblikkelig feedback der forklarer konsekvenser

RETURNER JSON:
{
  "scenarios": [
    {
      "id": "scenario-1",
      "situation": "Beskrivelse af situation",
      "context": "Hvorfor dette er relevant for adventure",
      "choices": [
        {
          "text": "Valg beskrivelse",
          "outcome": "Hvad sker der",
          "is_optimal": false,
          "learning_point": "Hvad eleven lærer af dette valg"
        }
      ]
    }
  ]
}`;

  return await callAI(prompt, `scenario-${phase.id}`);
}

// 6. Image Prompt Generator
async function generateImagePrompts(phase: any, context: AdventureContext) {
  const prompt = `Lav billede-prompts for fase "${phase.name}" i adventure "${context.title}".

FASE INFO:
- Aktivitet fokus: ${phase.subject}
- Stemning: ${phase.objective}
- Varighed: ${phase.targetMinutes} min

BILLEDE BEHOV:
1. Scene-setting (baggrund for fasen)
2. Activity illustration (viser hvad eleven gør)

STIL KRAV:
- Friendligt og inspirerende
- Alderssvarende for ${context.gradeLevel}. klasse
- Adventure/story følelse
- Inkluderer diverse elever

RETURNER JSON:
{
  "scene_image": {
    "prompt": "Detaljeret billede beskrivelse",
    "style": "illustration",
    "mood": "energetic"
  },
  "activity_image": {
    "prompt": "Billede der viser aktiviteten",
    "style": "illustration", 
    "mood": "engaging"
  }
}`;

  return await callAI(prompt, `images-${phase.id}`);
}

// 7. Reflection Generator
async function generateReflection(phases: any[], context: AdventureContext) {
  const subjects = [...new Set(phases.map(p => p.subject))];
  
  const prompt = `Lav refleksionsspørgsmål for afslutning af adventure "${context.title}".

DÆKKET I DAG:
- Fag: ${subjects.join(', ')}
- Hovedmål: ${phases.map(p => p.objective).join('; ')}
- Total tid: ${context.totalMinutes} min

REFLEKSIONS TYPER:
1. Faglig konsolidering ("Hvad lærte du om X?")
2. Adventure forbindelse ("Hvordan hjalp X dig i historien?")
3. Fremtidig anvendelse ("Hvor kunne du bruge dette?")
4. Selvvurdering ("Hvor sikker føler du dig nu?")

RETURNER JSON:
{
  "questions": [
    {
      "type": "subject_consolidation",
      "prompt": "Spørgsmål tekst",
      "expected_elements": ["Element eleven bør nævne"]
    }
  ],
  "self_assessment": {
    "prompt": "Bedøm din læring i dag (1-5)",
    "scale_description": "1=forvirret, 5=fuldstændig forstået"
  }
}`;

  return await callAI(prompt, "reflection");
}

// Main Orchestrator
async function generateMultiPromptAdventure(context: AdventureContext) {
  logInfo('🚀 Starting multi-prompt adventure generation', context);
  
  const results: any = {
    context,
    generatedAt: new Date().toISOString()
  };
  
  try {
    // 1. Master template
    logInfo('📋 Generating master template...');
    results.template = generateMasterTemplate(context);
    
    // 2. Forhistorie  
    logInfo('📖 Generating forhistorie...');
    results.forhistorie = await generateForhistorie(context);
    
    // 3. Fase planning
    logInfo('📅 Generating fase plan...');
    const fasePlanResult = await generateFasePlan(context);
    results.phases = fasePlanResult.phases;
    
    // 4. For hver fase: aktiviteter og billeder
    logInfo('🎯 Generating phase details...');
    results.phaseDetails = [];
    
    for (const phase of results.phases) {
      logInfo(`🔨 Processing phase: ${phase.name}`);
      const phaseDetail: any = { 
        phase,
        generatedAt: new Date().toISOString()
      };
      
      // Aktiviteter baseret på fase
      if (phase.subject === context.subject || phase.subject.includes('Math') || phase.subject.includes('Science')) {
        // Hovedfag - lav quiz
        logInfo(`📝 Generating quiz for ${phase.name}`);
        phaseDetail.quiz = await generateQuiz(phase, context);
      } else {
        // Kreativ/tværfaglig aktivitet
        logInfo(`🎭 Generating scenario for ${phase.name}`);
        phaseDetail.scenario = await generateScenario(phase, context);
      }
      
      // Billeder
      logInfo(`🖼️ Generating images for ${phase.name}`);
      phaseDetail.images = await generateImagePrompts(phase, context);
      
      results.phaseDetails.push(phaseDetail);
    }
    
    // 5. Refleksion
    logInfo('🤔 Generating reflection...');
    results.reflection = await generateReflection(results.phases, context);
    
    logSuccess(`✅ Multi-prompt adventure generation completed with ${results.phases.length} phases`);
    
    return results;
    
  } catch (error) {
    logError('❌ Error in multi-prompt generation', error);
    throw error;
  }
}

// Main request handler
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logInfo('🚀 Starting generate-adventure-multipart function');

    const requestData = await req.json();
    logInfo('📨 Received request data');

    // Extract and map to AdventureContext
    const context: AdventureContext = {
      adventureId: requestData.adventure?.id || `adventure-${Date.now()}`,
      title: requestData.adventure?.title || 'Epic Learning Adventure',
      subject: requestData.adventure?.subject || 'General Learning',
      gradeLevel: requestData.adventure?.gradeLevel || 7,
      interests: requestData.studentProfile?.interests || ['adventure', 'mystery', 'technology'],
      calendarKeywords: requestData.calendarContext?.keywords || ['interactive learning'],
      totalMinutes: requestData.schoolSettings?.lessonDuration || 135,
      studentAbility: requestData.studentProfile?.ability || 'core'
    };

    logInfo('📋 Mapped adventure context', context);

    // Generate multi-prompt adventure
    const adventure = await generateMultiPromptAdventure(context);

    return new Response(JSON.stringify({
      success: true,
      adventure,
      generationType: 'multi-prompt',
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    logError('Error in generate-adventure-multipart', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      generationType: 'multi-prompt-fallback',
      adventure: {
        title: "Adventure Generation Error",
        message: "Der opstod en fejl under generering af adventure. Prøv igen.",
        suggestion: "Tjek dine indstillinger og prøv med en simplere adventure titel."
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});