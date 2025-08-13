import { LessonRequest } from "./types";

export const PROMPT_VERSION = 2 as const;

export function buildPrompt(req: LessonRequest) {
  // Calculate target duration based on teacher preferences
  const targetDuration = req.teacherPreferences?.lessonDurations?.[req.gradeLevel.toString()] 
    ? Math.round(req.teacherPreferences.lessonDurations[req.gradeLevel.toString()] * 60) // convert hours to minutes
    : req.mode === "daily" ? 150 : 45; // default: 2.5h for daily, 45min for training

  // Get subject emphasis from teacher preferences
  const subjectEmphasis = req.teacherPreferences?.subjectWeights?.[req.subject] || 5;
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