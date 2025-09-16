import { LessonRequest } from "./types";
import { buildDailyUniversePromptV3, PromptCtx, PROMPT_VERSION_V3 } from "./prompts/dailyUniverse.v3";
import { normalizeSubject } from "@/utils/subjects";


export const PROMPT_VERSION = PROMPT_VERSION_V3;

export async function buildPrompt(req: LessonRequest) {
  // Import services for dynamic data
  const { calendarService } = await import('../services/CalendarService');
  
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

  // Map grade level to band - supports both US (K-12) and European (0-10 + high school) systems
  const gradeBand = (() => {
    // European system: 0-10 classes + high school
    if (req.gradeLevel === 0) return "0-2" as const; // Early years
    if (req.gradeLevel <= 2) return "0-2" as const;  // Early primary
    if (req.gradeLevel <= 5) return "3-5" as const;  // Primary
    if (req.gradeLevel <= 8) return "6-8" as const;  // Lower secondary
    if (req.gradeLevel <= 10) return "9-10" as const; // Upper secondary
    return "11-12" as const; // High school / Upper secondary
  })();

  // Fetch dynamic calendar keywords
  const currentDate = new Date().toISOString().split('T')[0];
  const calendarKeywords = await calendarService.getActiveKeywords(currentDate, req.gradeLevel, []);
  
  // Extract student interests from profile
  const studentInterests = req.studentProfile?.interests || [];

  // Get calendar context from request or use fetched keywords as fallback  
  const finalCalendarKeywords = req.calendarContext?.keywords || calendarKeywords;
  const calendarDuration = req.calendarContext?.duration || (req.mode === "daily" ? "daily session" : "training module");

  // Build calendar window for context
  const now = new Date();
  const startISO = now.toISOString();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + (req.mode === "daily" ? 1 : 30)); // daily or training mode
  const endISO = endDate.toISOString();

  // Build ability profile - ensure it's always defined
  const abilityProfile = {
    readingLevel: req.studentProfile?.ability === "above" ? "above" : 
                 req.studentProfile?.ability === "below" ? "below" : "on",
    scaffolding: req.studentProfile?.ability === "below",
    stretchGoals: req.studentProfile?.ability === "above"
  } as const;

  // Build v3 prompt context with all signals
  const promptCtx: PromptCtx = {
    subject: normalizedSubject,
    gradeBand,
    plannerMinutes: targetDuration,
    timeScope: req.mode === "daily" ? "day" : "season",
    studentInterests,
    subjectWeights,
    teachingPerspective: req.teacherPreferences?.teachingPerspective || "project_based",
    learningStyle: (req.studentProfile?.learningStyle as any) || "visual",
    ability: abilityProfile,
    calendarKeywords: finalCalendarKeywords,
    calendarWindow: { startISO, endISO },
    curriculum: {
      standards: [req.curriculum]
    },
    classId: req.classId
  };

  console.log('🎯 All parameters now active for lesson generation:', {
    '✅ Subject': normalizedSubject,
    '✅ Grade Level': `Class ${req.gradeLevel} (${gradeBand}) - European: 0-10 classes + high school`,
    '✅ Curriculum': req.curriculum,
    '✅ Teaching Perspective': promptCtx.teachingPerspective,
    '✅ Lesson Duration': `${targetDuration} minutes`,
    '✅ Subject Weights': `${Object.keys(subjectWeights).length} subjects configured`,
    '✅ Calendar Keywords': finalCalendarKeywords.length > 0 ? finalCalendarKeywords.join(', ') : 'None active',
    '✅ Calendar Duration': calendarDuration,
    '✅ Student Abilities': `${abilityProfile.readingLevel} level, scaffolding: ${abilityProfile.scaffolding}`,
    '✅ Learning Style': promptCtx.learningStyle,
    '✅ Student Interests': studentInterests.length > 0 ? studentInterests.join(', ') : 'None specified'
  });

  return await buildDailyUniversePromptV3(promptCtx);
}