import { LessonRequest } from "./types";

export const PROMPT_VERSION = 2 as const;

export function buildPrompt(req: LessonRequest) {
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
`;

  const user = `
[MODE]: ${req.mode}
[SUBJECT]: ${req.subject}
[GRADE]: ${req.gradeLevel}
[CURRICULUM]: ${req.curriculum}
[STUDENT_ABILITY]: ${req.studentProfile?.ability ?? 'normal'}
[LEARNING_STYLE]: ${req.studentProfile?.learningStyle ?? 'mixed'}

Lav en lektion (120-180 min for daily / 30-60 min for training) med aktiviteter, materialer og refleksionsspørgsmål.
`;

  return { system, user };
}