import { LessonRequest } from "./types";
import { buildDailyUniversePromptV3, PromptCtx, PROMPT_VERSION_V3 } from "./prompts/dailyUniverse.v3";
import { normalizeSubject } from "@/utils/subjects";


export const PROMPT_VERSION = PROMPT_VERSION_V3;

export async function buildPrompt(req: LessonRequest) {
  // Default subject weights based on UI image
  const DEFAULT_SUBJECT_WEIGHTS: Record<string, number> = {
    Mathematics: 7,
    Science: 5,
    English: 7,
    "Social Studies": 4,
    Arts: 3,
    Music: 2,
    PE: 3,
    "Foreign Language": 4,
    Technology: 5,
    "Computer Science": 4,
    Civics: 4,
    "Life Skills": 3
  };

  // Normalize subject and get weights
  const normalizedSubject = normalizeSubject(req.subject);
  const subjectWeights = { ...DEFAULT_SUBJECT_WEIGHTS, ...(req.teacherPreferences?.subjectWeights || {}) };
  
  // Calculate target duration based on teacher preferences
  const targetDuration = req.teacherPreferences?.lessonDurations?.[req.gradeLevel.toString()] 
    ? Math.round(req.teacherPreferences.lessonDurations[req.gradeLevel.toString()] * 60) // convert hours to minutes
    : 150; // default: 2.5 hours

  // Map grade level to band
  const gradeBand = req.gradeLevel <= 2 ? "K-2" as const :
                   req.gradeLevel <= 5 ? "3-5" as const :
                   req.gradeLevel <= 8 ? "6-8" as const :
                   req.gradeLevel <= 10 ? "9-10" as const : "11-12" as const;

  // Build v3 prompt context with all signals
  const promptCtx: PromptCtx = {
    subject: normalizedSubject,
    gradeBand,
    plannerMinutes: targetDuration,
    timeScope: req.mode === "daily" ? "day" : "season",
    studentInterests: [], // TODO: wire from student profile
    subjectWeights,
    teachingPerspective: req.teacherPreferences?.teachingPerspective || "project_based",
    learningStyle: (req.studentProfile?.learningStyle as any) || "visual",
    ability: {
      readingLevel: req.studentProfile?.ability === "above" ? "above" : 
                   req.studentProfile?.ability === "below" ? "below" : "on",
      scaffolding: req.studentProfile?.ability === "below",
      stretchGoals: req.studentProfile?.ability === "above"
    },
    calendarKeywords: [], // TODO: wire from calendar service
    curriculum: {
      standards: [req.curriculum]
    },
    // Include classId for educational context (TODO: add to LessonRequest type)
    classId: undefined
  };

  return await buildDailyUniversePromptV3(promptCtx);
}