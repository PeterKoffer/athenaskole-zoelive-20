import { LessonRequest } from "./types";

export const PROMPT_VERSION = 2 as const;

export function buildPrompt(req: LessonRequest) {
  // Default subject weights based on UI image
  const DEFAULT_SUBJECT_WEIGHTS: Record<string, number> = {
    mathematics: 7,
    science: 5,
    english: 7,
    history: 4,
    art: 3,
    music: 2,
    'physical education': 3,
    'foreign languages': 4
  };

  // Calculate target duration based on teacher preferences
  const targetDuration = req.teacherPreferences?.lessonDurations?.[req.gradeLevel.toString()] 
    ? Math.round(req.teacherPreferences.lessonDurations[req.gradeLevel.toString()] * 60) // convert hours to minutes
    : 150; // default: 2.5 hours

  // Get subject emphasis from teacher preferences or defaults
  const subjectKey = req.subject.toLowerCase();
  const subjectEmphasis = req.teacherPreferences?.subjectWeights?.[subjectKey] || 
                         DEFAULT_SUBJECT_WEIGHTS[subjectKey] || 5;
  const emphasisText = subjectEmphasis >= 8 ? "høj prioritet" : 
                      subjectEmphasis <= 3 ? "lav prioritet" : "normal prioritet";

  const system = `
Du er en dygtig pædagogisk designer (K-12).
Returner KUN valid JSON, der matcher skemaet:
{
  "title": string,
  "durationMinutes": number,
  "objectives": string[],
  "activities": { "type": string, "timebox": number, "instructions": string }[],
  "materials": string[],
  "reflectionPrompts": string[]
}

VIGTIGT: Target varighed er ${targetDuration} minutter. Tilpas antallet af aktiviteter herefter.
LÆRER PRIORITET: Dette fag har ${emphasisText} (${subjectEmphasis}/10) - tilpas dybde og engagement.
`;

  const user = `
[MODE]: ${req.mode}
[SUBJECT]: ${req.subject}
[GRADE]: ${req.gradeLevel}
[CURRICULUM]: ${req.curriculum}
[STUDENT_ABILITY]: ${req.studentProfile?.ability ?? 'normal'}
[LEARNING_STYLE]: ${req.studentProfile?.learningStyle ?? 'mixed'}
[TARGET_DURATION]: ${targetDuration} minutter
[TEACHER_EMPHASIS]: ${subjectEmphasis}/10 (${emphasisText})

Lav en lektion med ${targetDuration} minutters varighed. 
${subjectEmphasis >= 8 ? 'Gør den ekstra engagerende og dybdegående.' : 
  subjectEmphasis <= 3 ? 'Hold den lettilgængelig og grundlæggende.' : 
  'Balancer engagement og læring passende.'}
`;

  return { system, user };
}