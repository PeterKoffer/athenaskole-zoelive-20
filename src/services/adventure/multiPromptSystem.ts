// Multi-Prompt Adventure Generation System
// Opdeler stor prompt i mindre, fokuserede delprompts for bedre kvalitet

export interface AdventureContext {
  adventureId: string;
  title: string;
  subject: string;
  gradeLevel: number;
  interests: string[];
  calendarKeywords: string[];
  totalMinutes: number;
  studentAbility: 'remedial' | 'core' | 'stretch';
}

export interface PhaseInfo {
  id: string;
  name: string;
  subject: string;
  targetMinutes: number;
  objective: string;
  order: number;
}

export interface ActivityOutput {
  type: 'quiz' | 'mini-game' | 'scenario' | 'writing' | 'reflection';
  content: any;
  estimatedMinutes: number;
  adaptiveVersions?: {
    remedial: any;
    core: any;
    stretch: any;
  };
}

// 1. Master Skabelon Generator
export function generateMasterTemplate(context: AdventureContext) {
  return {
    totalMinutes: context.totalMinutes,
    phaseCount: Math.ceil(context.totalMinutes / 35), // ~35 min per fase
    structure: 'intro → learning → practice → integration → reflection',
    timeAllocation: {
      intro: 0.15,
      learning: 0.35,
      practice: 0.30,
      integration: 0.15,
      reflection: 0.05
    }
  };
}

// 2. Forhistorie Generator Prompt
export function createForhistoriePrompt(context: AdventureContext): string {
  return `Skriv en fængende forhistorie til adventure "${context.title}" for ${context.gradeLevel}. klasse.

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
}

// 3. Fase Planner Prompt  
export function createFasePlannerPrompt(context: AdventureContext): string {
  const template = generateMasterTemplate(context);
  
  return `Plan ${template.phaseCount} faser for adventure "${context.title}" (${context.totalMinutes} min total).

KONTEKST:
- Hovedfag: ${context.subject}
- Klassetrin: ${context.gradeLevel}
- Elevinteresser: ${context.interests.join(', ')}
- Kalender: ${context.calendarKeywords.join(', ')}

FASE STRUKTUR (følg denne rækkefølge):
1. Intro & Hook (${Math.round(context.totalMinutes * 0.15)} min)
2. Læring & Opdagelse (${Math.round(context.totalMinutes * 0.35)} min) 
3. Praktisk Anvendelse (${Math.round(context.totalMinutes * 0.30)} min)
4. Integration & Kreativitet (${Math.round(context.totalMinutes * 0.15)} min)
5. Refleksion & Afslutning (${Math.round(context.totalMinutes * 0.05)} min)

RETURNER JSON array:
[
  {
    "id": "phase-1",
    "name": "Fase navn",
    "subject": "Primært fag",
    "targetMinutes": antal_minutter,
    "objective": "Hvad eleven skal opnå",
    "order": 1
  }
]`;
}

// 4. Narrativ Wrapper Prompt
export function createNarrativWrapperPrompt(phase: PhaseInfo, context: AdventureContext): string {
  return `Skriv narrativ wrapper for fase "${phase.name}" i adventure "${context.title}".

FASE INFO:
- Mål: ${phase.objective}
- Fag: ${phase.subject}
- Varighed: ${phase.targetMinutes} min
- Position: Fase ${phase.order} af adventure

KRAV:
- Max 100 ord
- Forbinder forrige fase med denne
- Bygger spænding op
- Integrerer ${phase.subject} naturligt i historien
- Motiverer eleven til at engagere sig

RETURNER JSON:
{
  "narrative": "Fortællende tekst...",
  "transition": "Hvordan vi kom fra forrige fase",
  "motivation": "Hvorfor eleven skal være interesseret nu"
}`;
}

// 5. Quiz Builder Prompt
export function createQuizBuilderPrompt(phase: PhaseInfo, context: AdventureContext): string {
  return `Lav quiz til fase "${phase.name}" for ${context.gradeLevel}. klasse.

FAGLIGT FOKUS: ${phase.subject}
MÅL: ${phase.objective}
TID: ${phase.targetMinutes} min (så 5-8 spørgsmål)

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
  "core": { "questions": [...] },
  "stretch": { "questions": [...] }
}`;
}

// 6. Mini-game Builder Prompt
export function createMinigameBuilderPrompt(phase: PhaseInfo, context: AdventureContext): string {
  return `Design mini-game for fase "${phase.name}" i adventure "${context.title}".

KRAV:
- Fag: ${phase.subject}
- Klassetrin: ${context.gradeLevel}
- Tid: Max ${Math.round(phase.targetMinutes * 0.4)} min
- Elevinteresser: ${context.interests.join(', ')}

GAME TYPER (vælg den bedste):
- Simulation (fx budgetspil, eksperiment)
- Puslespil (fx ordne rækkefølge, match koncepter)
- Bygge-udfordring (fx design løsning)
- Rolle-spil (fx forhandling, interview)

RETURNER JSON:
{
  "game_type": "Type af spil",
  "title": "Spil titel",
  "rules": "Kort beskrivelse af regler",
  "success_criteria": "Hvornår har eleven 'vundet'",
  "materials": ["Liste over nødvendige elementer"],
  "learning_goal": "Hvad lærer eleven gennem spillet"
}`;
}

// 7. Scenarie Builder Prompt
export function createScenarioBuilderPrompt(phase: PhaseInfo, context: AdventureContext): string {
  return `Lav beslutningsscenarie for fase "${phase.name}".

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
}

// 8. Refleksions Generator Prompt
export function createReflectionPrompt(allPhases: PhaseInfo[], context: AdventureContext): string {
  const subjects = [...new Set(allPhases.map(p => p.subject))];
  
  return `Lav refleksionsspørgsmål for afslutning af adventure "${context.title}".

DÆKKET I DAG:
- Fag: ${subjects.join(', ')}
- Hovedmål: ${allPhases.map(p => p.objective).join('; ')}
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
}

// 9. Exit Ticket Generator Prompt
export function createExitTicketPrompt(context: AdventureContext): string {
  return `Lav exit ticket for adventure "${context.title}".

FORMÅL:
- Dokumenter dagens læring
- Quick check af forståelse
- Motivation for næste gang

KRAV:
- Max 2 min at udfylde
- 1 viden-spørgsmål
- 1 anvendelses-spørgsmål  
- 1 følelse/motivation-spørgsmål

RETURNER JSON:
{
  "knowledge_check": {
    "question": "Hurtig viden test",
    "format": "multiple_choice | short_answer | scale"
  },
  "application_check": {
    "question": "Hvordan vil du bruge dette?",
    "format": "open_text"
  },
  "engagement_check": {
    "question": "Hvor spændende var dagens adventure?",
    "format": "1-5_scale",
    "follow_up": "Hvad var det fedeste?"
  }
}`;
}

// 10. Image Prompt Writer
export function createImagePromptWriter(phase: PhaseInfo, context: AdventureContext): string {
  return `Lav billede-prompts for fase "${phase.name}" i adventure "${context.title}".

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
    "style": "illustration | photo-realistic | cartoon",
    "mood": "energetic | focused | collaborative"
  },
  "activity_image": {
    "prompt": "Billede der viser aktiviteten",
    "style": "illustration | photo-realistic | cartoon", 
    "mood": "engaging | educational | fun"
  }
}`;
}

// 11. Validator Prompt
export function createValidatorPrompt(adventureData: any, context: AdventureContext): string {
  return `Valider dette complete adventure mod kvalitetskriterier.

ADVENTURE DATA: ${JSON.stringify(adventureData, null, 2)}

ORIGINAL KRAV:
- Titel: ${context.title}
- Fag: ${context.subject}
- Klassetrin: ${context.gradeLevel}
- Tid: ${context.totalMinutes} min
- Interesser: ${context.interests.join(', ')}

VALIDERINGSPUNKTER:
1. Alders-egnethed (sprog, kompleksitet, emner)
2. Faglig dækning (pensum, dybde, progression)
3. Tids-realisme (kan gennemføres i tid)
4. Adventure sammenhæng (hænger historien sammen?)
5. Engagement faktorer (vil eleven være interesseret?)

RETURNER JSON:
{
  "age_appropriate": { "score": 1-10, "notes": "Kommentarer" },
  "curriculum_coverage": { "score": 1-10, "notes": "Faglig kvalitet" },
  "time_realistic": { "score": 1-10, "notes": "Tidsplanlægning" },
  "story_coherence": { "score": 1-10, "notes": "Narrativ kvalitet" },
  "engagement_factor": { "score": 1-10, "notes": "Hvor fængende er det" },
  "overall_recommendation": "approve | revise | reject",
  "improvement_suggestions": ["Konkrete forbedringsforslag"]
}`;
}

// Orchestrator Function der kalder alle prompts i rækkefølge
export class AdventureOrchestrator {
  async generateMultiPromptAdventure(context: AdventureContext): Promise<any> {
    const results: any = {};
    
    // 1. Master template
    results.template = generateMasterTemplate(context);
    
    // 2. Forhistorie  
    const forhistoriePrompt = createForhistoriePrompt(context);
    results.forhistorie = await this.callAI(forhistoriePrompt);
    
    // 3. Fase planning
    const fasePlanPrompt = createFasePlannerPrompt(context);
    results.phases = await this.callAI(fasePlanPrompt);
    
    // 4. For hver fase: narrativ + aktiviteter
    results.phaseDetails = [];
    for (const phase of results.phases) {
      const phaseDetail: any = { phase };
      
      // Narrativ wrapper
      const narrativPrompt = createNarrativWrapperPrompt(phase, context);
      phaseDetail.narrative = await this.callAI(narrativPrompt);
      
      // Aktiviteter baseret på fase type
      if (phase.subject === context.subject) {
        // Hovedfag - lav quiz
        const quizPrompt = createQuizBuilderPrompt(phase, context);
        phaseDetail.quiz = await this.callAI(quizPrompt);
      } else {
        // Kreativ/tværfaglig aktivitet
        const scenarioPrompt = createScenarioBuilderPrompt(phase, context);
        phaseDetail.scenario = await this.callAI(scenarioPrompt);
      }
      
      // Billeder
      const imagePrompt = createImagePromptWriter(phase, context);
      phaseDetail.images = await this.callAI(imagePrompt);
      
      results.phaseDetails.push(phaseDetail);
    }
    
    // 5. Refleksion
    const reflectionPrompt = createReflectionPrompt(results.phases, context);
    results.reflection = await this.callAI(reflectionPrompt);
    
    // 6. Exit ticket
    const exitPrompt = createExitTicketPrompt(context);
    results.exitTicket = await this.callAI(exitPrompt);
    
    // 7. Validation
    const validationPrompt = createValidatorPrompt(results, context);
    results.validation = await this.callAI(validationPrompt);
    
    return results;
  }
  
  private async callAI(prompt: string): Promise<any> {
    // Dette skal implementeres med dit OpenAI/Anthropic API kald
    // Returner JSON response baseret på prompt
    throw new Error("AI calling not implemented yet");
  }
}