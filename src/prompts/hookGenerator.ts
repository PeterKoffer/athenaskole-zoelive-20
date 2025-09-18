// Danish Hook Generator for Educational Adventures

export interface HookContext {
  title: string;
  theme: string;
  grade: string;
  subject_hints: string[];
  student_name: string;
  interests: string[];
}

export interface HookResult {
  text: string;
  beats: string[];
  image_prompt: string;
  reading_time_sec: number;
}

export function buildHookSystemPrompt(): string {
  return `Du skriver KUN dansk fortællende prosa til elever (110–140 ord), nutid, sanselig og alderssikker. 
Stemning: håbefuld, eventyrlig, konkret.
Indflet 1–2 faglige hints (mat/sprog/viden) som naturlige detaljer. 
Ingen metatekst, ingen instrukser, ingen punktopstilling, ingen uhyggelige elementer.`;
}

export function buildHookUserPrompt(context: HookContext): string {
  return `Adventure: ${context.title} (${context.grade}. klasse)
Tema: ${context.theme}
Stil: børnevenlig, filmisk, konkrete sanser (lys, lyde, lugte)
Fokus: spor om ${context.subject_hints.join(', ')}
Elev: ${context.student_name}, interesser: ${context.interests.join(', ')}`;
}

export function buildHookWrapperPrompt(): string {
  return `Returnér KUN JSON:
{
  "text": "<din prosa fra pass A>",
  "beats": ["scene1","scene2","scene3"],
  "image_prompt": "<kort billedprompt uden tekst på billedet>",
  "reading_time_sec": 40
}`;
}

export async function generateHook(context: HookContext): Promise<HookResult> {
  // This would normally call OpenAI, but for now return a structured fallback
  return {
    text: `${context.student_name} finder en mystisk note ved skolens hegn. "Dagens udfordring venter," står der skrevet med elegant håndskrift. Solen skinner gennem træerne, og en let brise bærer duften af frisk græs. I det fjerne høres lyden af børns latter fra legepladsen. Hvad mon der gemmer sig bag denne gådefulde besked? En spændende dag med ${context.theme.toLowerCase()} ligger foran dig, fuld af overraskelser og læring.`,
    beats: ["Mystisk note opdaget", "Sanserig beskrivelse af omgivelser", "Invitation til eventyr"],
    image_prompt: `children's storybook gouache — student finding mysterious note by school fence, warm sunlight, inviting atmosphere — age-appropriate — no text overlay — CONSISTENCY_TAG: NELIE-kidbook-gouache-01`,
    reading_time_sec: 40
  };
}