// 12-Step Adventure Generation Pipeline with Digital-Only Materials
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

// Digital-only AI call
async function callOpenAI(system: string, user: string, maxTokens = 1500): Promise<{text: string; usage?: any}> {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIApiKey) {
    logError('OpenAI API key not configured');
    throw new Error('OpenAI API key not configured');
  }

  logInfo(`🤖 Calling OpenAI (max_tokens: ${maxTokens})...`);

  try {
    const requestBody = {
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user }
      ],
      max_tokens: maxTokens,
      temperature: 0.3,
      response_format: { type: "json_object" }
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
      logError(`OpenAI API error: ${response.status}`, errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content?.trim() ?? "";
    const usage = data.usage;
    
    logSuccess('✅ OpenAI response received');
    return { text, usage };

  } catch (error) {
    logError('Error calling OpenAI', error);
    throw error;
  }
}

// P0 - System prompt (used for all calls)
const SYSTEM_PROMPT = `Du er didaktisk chefkonsulent for faget "{subject}" og klassetrin "{gradeBand}".
Sprog: {language}. Du må KUN svare med gyldig JSON, uden markdown og uden øvrig tekst.
Tider angives i minutter. Materialer skal være realistiske for en normal skole.

POLICY_DIGITAL_ONLY:
Alt arbejde skal kunne gennemføres 100% på en computer/tablet (skærm). 
"Materials" må KUN indeholde digitale ressourcer (apps, websites, skabeloner, filer) eller indbyggede enhedsfunktioner (fx kamera, mikrofon, skærmoptagelse, web-timer). 
Forbudt: fysiske materialer (papir, saks, lim, tusch, whiteboard, LEGO, målebånd, lineal, batterier, snor, papirclips, osv.). 
Hvis en aktivitet typisk ville bruge fysiske ting, SKAL du foreslå en digital erstatning (fx måling via billedanalyse, virtuel simulator, interaktivt værktøj, formular/skabelon).
Alle opgaver, scripts og vurderinger skal kunne løses på skærmen uden nødvendigt fysisk udstyr.

Alle checkpoints/succeskriterier skal være observerbare og målbare.
Returnér KUN JSON – hvis du ikke kan opfylde kravet, returnér {"error":"..."}.`;

// P1 - Metadata & Framework
async function generateMetadata(context: any) {
  const system = SYSTEM_PROMPT
    .replace('{subject}', context.subject)
    .replace('{gradeBand}', context.gradeBand)
    .replace('{language}', context.language);

  const user = `Generér rammesætning for et Adventure.
Alle "materials_global" skal følge POLICY_DIGITAL_ONLY og derfor KUN være digitale ressourcer eller indbyggede enhedsfunktioner.

Returnér JSON med: bigIdea (1 sætning), essentialQuestion (1 spørgsmål),
vocabulary (5–10 begreber), standards (2–4 relevante standarder), materials_global (liste).

Input: ${JSON.stringify(context)}

OUTPUT JSON schema:
{
  "bigIdea": "string",
  "essentialQuestion": "string", 
  "vocabulary": ["string", "..."],
  "standards": ["string", "..."],
  "materials_global": ["string", "..."]
}`;

  const { text } = await callOpenAI(system, user, 800);
  return JSON.parse(text);
}

// P2 - Phase Plan (12 steps)
async function generatePhaseplan(context: any, metadata: any) {
  const system = SYSTEM_PROMPT
    .replace('{subject}', context.subject)
    .replace('{gradeBand}', context.gradeBand)
    .replace('{language}', context.language);

  const user = `Skab en 12-trins faseplan for undervisningen, der samlet ca. matcher ${context.duration_minutes} minutter (±10%).
For hvert stage gælder POLICY_DIGITAL_ONLY: "materials" må KUN være digitale ressourcer eller indbyggede enhedsfunktioner. 
Hvis en naturlig aktivitet typisk er analog, skal du give en konkret digital erstatning.

Trin og rækkefølge (ID og navn skal være præcist som her):
1-hook, 2-goals, 3-diagnose, 4-mini, 5-guided, 6-create, 7-cfu, 8-share, 9-reflect, 10-diff, 11-assess, 12-home.

Metadata: ${JSON.stringify(metadata)}
Context: ${JSON.stringify(context)}

OUTPUT JSON schema:
{
  "stages": [
    {
      "id": "1-hook",
      "name": "Hook",
      "time_min": 5,
      "objective": "string",
      "teacher_script": "string",
      "student_tasks": ["string","..."],
      "materials": ["string","..."],
      "checkpoints": ["string","..."],
      "differentiation": { "scaffold": ["string","..."], "extend": ["string","..."] },
      "assessment": { "type":"string", "success":"string" },
      "outputs": ["string","..."]
    }
  ]
}`;

  const { text } = await callOpenAI(system, user, 2000);
  return JSON.parse(text);
}

// P3 - Mini-lesson (elaborate step 4)
async function generateMiniLesson(context: any, stages: any) {
  const system = SYSTEM_PROMPT
    .replace('{subject}', context.subject)
    .replace('{gradeBand}', context.gradeBand)
    .replace('{language}', context.language);

  const user = `Forbedr trin "4-mini" med: explanation (kort faglig gennemgang),
modelled_example (trinvis lærer-eksempel),
misconceptions (3 typiske misforståelser + korrektion).
Sørg for, at "modelled_example" er gennemførbar på skærm alene, og at evt. visualiseringer/skitser laves i digitale værktøjer (fx tegneværktøj, præsentation, online whiteboard).

Stages: ${JSON.stringify(stages)}

OUTPUT JSON schema:
{
  "stage_id": "4-mini",
  "explanation": "string",
  "modelled_example": ["trin 1", "trin 2", "..."],
  "misconceptions": [
    { "misconception":"string", "correction":"string" },
    { "misconception":"string", "correction":"string" },
    { "misconception":"string", "correction":"string" }
  ]
}`;

  const { text } = await callOpenAI(system, user, 1000);
  return JSON.parse(text);
}

// P4 - Guided Practice (elaborate step 5)
async function generateGuidedPractice(context: any, stages: any) {
  const system = SYSTEM_PROMPT
    .replace('{subject}', context.subject)
    .replace('{gradeBand}', context.gradeBand)
    .replace('{language}', context.language);

  const user = `Uddyb trin "5-guided" i formatet I-do → We-do → You-do.
"I-do/We-do/You-do" skal kunne udføres på skærm (skærmdeling, delt dokument, online whiteboard, formular/skabelon). 
Tjekspørgsmål besvares i et digitalt format (fx afkrydsning/tekstfelt).
Inkludér 3–5 tjekspørgsmål og forventede svar.

Stages: ${JSON.stringify(stages)}

OUTPUT JSON schema:
{
  "stage_id": "5-guided",
  "sequence": {
    "i_do": ["trin","..."],
    "we_do": ["trin","..."],
    "you_do": ["trin","..."]
  },
  "checks": [
    { "q":"string", "expected":"string" },
    { "q":"string", "expected":"string" }
  ]
}`;

  const { text } = await callOpenAI(system, user, 1000);
  return JSON.parse(text);
}

// P5 - Create/Investigate (elaborate step 6)
async function generateCreateStep(context: any, stages: any) {
  const system = SYSTEM_PROMPT
    .replace('{subject}', context.subject)
    .replace('{gradeBand}', context.gradeBand)
    .replace('{language}', context.language);

  const user = `Uddyb trin "6-create" som undersøgelse/projekt:
"project_brief" og "data_sheet" skal være 100% digitale (formularer, skabeloner, regneark). 
"Sikkerhed" nævnes kun hvis relevant for brug af kamera/mikrofon/skærmoptagelse; ingen fysiske værktøjer. 
"team_roles" beskriver samarbejde i delte dokumenter/boards.

Stages: ${JSON.stringify(stages)}

OUTPUT JSON schema:
{
  "stage_id":"6-create",
  "project_brief":"string",
  "safety": ["string","..."],
  "data_sheet": ["felt1","felt2","..."],
  "success_criteria": ["string","..."],
  "team_roles": [
    {"role":"string","responsibility":"string"},
    {"role":"string","responsibility":"string"}
  ]
}`;

  const { text } = await callOpenAI(system, user, 1000);
  return JSON.parse(text);
}

// P6 - Check for Understanding (elaborate step 7)
async function generateCFU(context: any, stages: any) {
  const system = SYSTEM_PROMPT
    .replace('{subject}', context.subject)
    .replace('{gradeBand}', context.gradeBand)
    .replace('{language}', context.language);

  const user = `Lav 6–10 hurtige CFU-spørgsmål (enkelt-svar). Angiv korrekt svar kort.
Spørgsmål besvares i et digitalt format (quiz, formular, klikbare svar).

Stages: ${JSON.stringify(stages)}

OUTPUT JSON schema:
{
  "stage_id":"7-cfu",
  "items":[
    {"q":"string","answer":"string"},
    {"q":"string","answer":"string"}
  ]
}`;

  const { text } = await callOpenAI(system, user, 800);
  return JSON.parse(text);
}

// P7 - Share & Feedback (elaborate step 8)
async function generateShareFeedback(context: any, stages: any) {
  const system = SYSTEM_PROMPT
    .replace('{subject}', context.subject)
    .replace('{gradeBand}', context.gradeBand)
    .replace('{language}', context.language);

  const user = `Design en struktur for deling og peer-feedback:
Deling og feedback sker via skærm (delte præsentationer, optaget demo, link til produkt) og en digital feedback-protokol (kommentarer/tjekliste-skema).

Stages: ${JSON.stringify(stages)}

OUTPUT JSON schema:
{
  "stage_id":"8-share",
  "presentation_structure":["trin","..."],
  "feedback_protocol":"string",
  "criteria":["string","..."]
}`;

  const { text } = await callOpenAI(system, user, 800);
  return JSON.parse(text);
}

// P8 - Reflection (elaborate step 9)
async function generateReflection(context: any, stages: any) {
  const system = SYSTEM_PROMPT
    .replace('{subject}', context.subject)
    .replace('{gradeBand}', context.gradeBand)
    .replace('{language}', context.language);

  const user = `Lav 5 refleksionsspørgsmål (forskellige kognitive niveauer) + selvevaluering med 5-punkts Likert.
Refleksion skrives/indtales digitalt (tekstfelt, lydoptagelse, kort video).

Stages: ${JSON.stringify(stages)}

OUTPUT JSON schema:
{
  "stage_id":"9-reflect",
  "prompts":["string","..."],
  "self_eval": { "prompt":"string", "scale":["1","2","3","4","5"] }
}`;

  const { text } = await callOpenAI(system, user, 800);
  return JSON.parse(text);
}

// P9 - Differentiation (elaborate step 10)
async function generateDifferentiation(context: any, stages: any) {
  const system = SYSTEM_PROMPT
    .replace('{subject}', context.subject)
    .replace('{gradeBand}', context.gradeBand)
    .replace('{language}', context.language);

  const user = `Uddyb differentiering:
Alle stilladser/udfordringer skal have digitale alternativer (læse-/lytningstilpasninger, skabeloner, diktering, oversættelse, mm.).

Stages: ${JSON.stringify(stages)}

OUTPUT JSON schema:
{
  "stage_id":"10-diff",
  "scaffold":["string","..."],
  "extend":["string","..."],
  "grouping":["string","..."]
}`;

  const { text } = await callOpenAI(system, user, 800);
  return JSON.parse(text);
}

// P10 - Assessment & Rubric (elaborate step 11)
async function generateAssessment(context: any, stages: any) {
  const system = SYSTEM_PROMPT
    .replace('{subject}', context.subject)
    .replace('{gradeBand}', context.gradeBand)
    .replace('{language}', context.language);

  const user = `Skab en summativ opgave + rubrik (2–4 kriterier × 3 niveauer: Fremragende, God, På vej).
Summativ opgave afleveres digitalt (fil/link). Rubrik anvendes i et digitalt vurderingsark.
Tilføj 1–2 eksempelbesvarelser (kort).

Stages: ${JSON.stringify(stages)}

OUTPUT JSON schema:
{
  "stage_id":"11-assess",
  "task":"string",
  "rubric":[
    {
      "criterion":"string",
      "levels":[
        {"name":"Fremragende","desc":"string"},
        {"name":"God","desc":"string"},
        {"name":"På vej","desc":"string"}
      ]
    }
  ],
  "exemplars": ["string","..."]
}`;

  const { text } = await callOpenAI(system, user, 1200);
  return JSON.parse(text);
}

// P11 - Quiz & Handouts
async function generateQuizHandouts(context: any, stages: any) {
  const system = SYSTEM_PROMPT
    .replace('{subject}', context.subject)
    .replace('{gradeBand}', context.gradeBand)
    .replace('{language}', context.language);

  const user = `Lav 5–8 MC-spørgsmål (1 korrekt svar, angiv index for correct), 1 enkelt arbejdsark (felter som labels),
og 1 lærernote (tips, faldgruber, timing).
Quiz og arbejdsark leveres som digitale elementer (valgspørgsmål med answer_index, udfyldelige felter). 
"Lærer-note" beskriver digitale workflows (fx hvordan man udleverer og indsamler links).

Stages: ${JSON.stringify(stages)}

OUTPUT JSON schema:
{
  "quiz":[
    {"q":"string","choices":["a","b","c","d"],"answer_index": 2},
    {"q":"string","choices":["a","b","c","d"],"answer_index": 0}
  ],
  "worksheet": {
    "title":"string",
    "fields":["felt1","felt2","..."]
  },
  "teacher_notes": ["tip","faldgrube","timing-hint"]
}`;

  const { text } = await callOpenAI(system, user, 1200);
  return JSON.parse(text);
}

// P12 - Home/Parents Summary (elaborate step 12)
async function generateParentSummary(context: any, stages: any) {
  const system = SYSTEM_PROMPT
    .replace('{subject}', context.subject)
    .replace('{gradeBand}', context.gradeBand)
    .replace('{language}', context.language);

  const user = `Skriv en forældre-opsummering i 3–5 korte linjer, uden jargon, plus 3 "spørg derhjemme"-forslag.
Forslag til hjemmearbejde skal kunne løses på skærm alene (ingen indkøb eller analoge materialer).

Stages: ${JSON.stringify(stages)}

OUTPUT JSON schema:
{
  "parent_summary":"string",
  "ask_at_home":["string","string","string"]
}`;

  const { text } = await callOpenAI(system, user, 600);
  return JSON.parse(text);
}

// Assemble final Adventure JSON
function assembleAdventure(context: any, results: any) {
  const metadata = results.metadata;
  const phaseplan = results.phaseplan;
  
  // Merge all elaborations into stages
  const stages = phaseplan.stages.map((stage: any) => {
    const stageId = stage.id;
    
    // Add elaborations based on stage ID
    if (stageId === "4-mini" && results.miniLesson) {
      return { ...stage, ...results.miniLesson };
    }
    if (stageId === "5-guided" && results.guidedPractice) {
      return { ...stage, ...results.guidedPractice };
    }
    if (stageId === "6-create" && results.createStep) {
      return { ...stage, ...results.createStep };
    }
    if (stageId === "7-cfu" && results.cfu) {
      return { ...stage, ...results.cfu };
    }
    if (stageId === "8-share" && results.shareFeedback) {
      return { ...stage, ...results.shareFeedback };
    }
    if (stageId === "9-reflect" && results.reflection) {
      return { ...stage, ...results.reflection };
    }
    if (stageId === "10-diff" && results.differentiation) {
      return { ...stage, ...results.differentiation };
    }
    if (stageId === "11-assess" && results.assessment) {
      return { ...stage, ...results.assessment };
    }
    
    return stage;
  });

  return {
    adventure: {
      title: context.title,
      subject: context.subject,
      gradeBand: context.gradeBand,
      bigIdea: metadata.bigIdea,
      essentialQuestion: metadata.essentialQuestion,
      vocabulary: metadata.vocabulary,
      standards: metadata.standards,
      duration_minutes: context.duration_minutes,
      materials_global: metadata.materials_global,
      stages: stages,
      summative: results.assessment || {},
      quiz: results.quizHandouts?.quiz || [],
      worksheet: results.quizHandouts?.worksheet || {},
      teacher_notes: results.quizHandouts?.teacher_notes || [],
      parent_summary: results.parentSummary?.parent_summary || "",
      ask_at_home: results.parentSummary?.ask_at_home || []
    }
  };
}

// Main generation function
async function generateAdventure(context: any) {
  logInfo('Starting 12-step Adventure generation with digital-only materials');
  
  const results: any = {};
  
  try {
    // P1 - Metadata & Framework
    logInfo('Step 1: Generating metadata...');
    results.metadata = await generateMetadata(context);
    
    // P2 - Phase Plan (12 steps)
    logInfo('Step 2: Generating phase plan...');
    results.phaseplan = await generatePhaseplan(context, results.metadata);
    
    // P3 - Mini-lesson (step 4)
    logInfo('Step 3: Elaborating mini-lesson...');
    results.miniLesson = await generateMiniLesson(context, results.phaseplan.stages);
    
    // P4 - Guided Practice (step 5)
    logInfo('Step 4: Elaborating guided practice...');
    results.guidedPractice = await generateGuidedPractice(context, results.phaseplan.stages);
    
    // P5 - Create/Investigate (step 6)
    logInfo('Step 5: Elaborating create step...');
    results.createStep = await generateCreateStep(context, results.phaseplan.stages);
    
    // P6 - Check for Understanding (step 7)
    logInfo('Step 6: Generating CFU...');
    results.cfu = await generateCFU(context, results.phaseplan.stages);
    
    // P7 - Share & Feedback (step 8)
    logInfo('Step 7: Generating share & feedback...');
    results.shareFeedback = await generateShareFeedback(context, results.phaseplan.stages);
    
    // P8 - Reflection (step 9)
    logInfo('Step 8: Generating reflection...');
    results.reflection = await generateReflection(context, results.phaseplan.stages);
    
    // P9 - Differentiation (step 10)
    logInfo('Step 9: Generating differentiation...');
    results.differentiation = await generateDifferentiation(context, results.phaseplan.stages);
    
    // P10 - Assessment & Rubric (step 11)
    logInfo('Step 10: Generating assessment...');
    results.assessment = await generateAssessment(context, results.phaseplan.stages);
    
    // P11 - Quiz & Handouts
    logInfo('Step 11: Generating quiz & handouts...');
    results.quizHandouts = await generateQuizHandouts(context, results.phaseplan.stages);
    
    // P12 - Home/Parents Summary (step 12)
    logInfo('Step 12: Generating parent summary...');
    results.parentSummary = await generateParentSummary(context, results.phaseplan.stages);
    
    // Assemble final Adventure
    logInfo('Assembling final Adventure JSON...');
    const adventure = assembleAdventure(context, results);
    
    logSuccess('✅ 12-step Adventure generation completed');
    return adventure;
    
  } catch (error) {
    logError('Error in Adventure generation pipeline:', error);
    
    // Return error JSON as specified
    return {
      error: `Adventure generation failed: ${error.message}`,
      step_failed: Object.keys(results).length + 1,
      completed_steps: Object.keys(results)
    };
  }
}

// Main serve function
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const requestData = await req.json();
    logInfo('Adventure generation request received:', requestData);

    // Extract context with defaults
    const context = {
      title: requestData.title || 'Læringseventyr',
      subject: requestData.subject || 'Science',
      gradeBand: requestData.gradeBand || '6-8',
      duration_minutes: requestData.duration_minutes || 75,
      language: requestData.language || 'da-DK',
      constraints: requestData.constraints || {
        class_size: 24,
        room_type: 'almindeligt klasselokale',
        devices: 'computer/tablet per elev',
        budget: 'lav',
        special_needs: ['ELL', 'SPS']
      }
    };

    // Generate the complete adventure
    const adventure = await generateAdventure(context);

    return new Response(JSON.stringify(adventure), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    logError('Request processing error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to process request',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});