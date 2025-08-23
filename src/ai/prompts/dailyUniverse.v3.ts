import { getEffectiveEduContext } from "@/services/edu/effectiveContext";
import { loadStudentProfileEdu, loadTeacherOverrides, loadClassOverrides } from "@/services/edu/loadOverrides";
import { EduContext } from "@/services/edu/locale";

export type TeachingPerspective =
  | "project_based" | "knowledge_first" | "skills_first"
  | "explicit_instruction" | "inquiry" | "inclusion_universal_design";

export type LearningStyle = "visual" | "auditory" | "reading_writing" | "kinesthetic";

export type AbilityProfile = {
  readingLevel?: "below"|"on"|"above";
  numeracyLevel?: "below"|"on"|"above";
  scaffolding?: boolean;            // generate supports
  stretchGoals?: boolean;           // add extensions
};

export type PromptCtx = {
  // Core lesson parameters
  subject: string;
  gradeBand: "K-2"|"3-5"|"6-8"|"9-10"|"11-12";
  plannerMinutes: number;
  timeScope: "day"|"season"|"year";
  studentInterests: string[];
  
  // New curriculum signals
  subjectWeights?: Record<string, number>; // all 12 subjects
  teachingPerspective?: TeachingPerspective;
  learningStyle?: LearningStyle;
  ability?: AbilityProfile;
  calendarKeywords?: string[];
  calendarWindow?: { startISO: string; endISO: string };
  
  // Existing context
  locale?: "en"|"da";
  country?: string;
  curriculum?: {
    standards?: string[];
    targets?: string[];
  };
  seed?: string;
  lastSeeds?: string[];
  
  // Class identifier for educational context
  classId?: string;
  
  // Educational localization context (deprecated in favor of effective context)
  edu?: EduContext;
};

export async function buildDailyUniversePromptV3(ctx: PromptCtx): Promise<{ system: string; user: string }> {
  const [studentProfile, teacherOverrides, classOverrides] = await Promise.all([
    loadStudentProfileEdu(),
    loadTeacherOverrides(),
    loadClassOverrides(ctx.classId),
  ]);

  const edu = getEffectiveEduContext({
    studentProfile,
    teacherOverrides,
    classOverrides,
    cacheKey: `edu:${ctx.classId ?? "no-class"}`,
  });

  const {
    subject,
    gradeBand,
    plannerMinutes,
    subjectWeights = {},
    teachingPerspective = "project_based",
    learningStyle = "visual",
    ability = {},
    calendarKeywords = [],
    calendarWindow,
    studentInterests = [],
    curriculum = {}
  } = ctx;

  const system = `
You are an expert K-12 curriculum designer. Generate a daily learning universe that integrates all educational signals.

COUNTRY & LOCALE (TEACHER-LED):
- Country: ${edu.countryCode}
- Curriculum: ${edu.curriculumCode}
- Language: ${edu.language}
- Locale: ${edu.locale}
- Units: ${edu.measurement} (always use ${edu.measurement} units)
- Currency: ${edu.currencyCode} (use symbol ${edu.currencySymbol})
- Timezone: ${edu.timezone}

STRICT RULE:
- If any ambiguity arises, follow TEACHER choices above (class/teacher overrides) rather than student defaults.

REQUIREMENTS:
- Use native conventions (spelling, examples, measurements, currency).
- Align activities to ${edu.curriculumCode}.
- Write in ${edu.language}. Avoid mixing languages unless explicitly told.
- Prefer context relevant to ${edu.countryCode} (history/civics examples can be local). International content is welcome but keep native framing.

Return ONLY valid JSON matching this schema:
{
  "title": string,
  "theme": string,
  "durationMinutes": number,
  "storylineIntro": string,
  "activities": [
    {
      "type": string,
      "title": string,
      "timeMinutes": number,
      "instructions": string,
      "materials": string[],
      "skillFocus": string,
      "curriculumStandard": string
    }
  ],
  "crossCurricularConnections": string[],
  "personalization": {
    "teachingPerspective": string,
    "learningStyle": string,
    "abilityDecisions": string[],
    "calendarHooksUsed": string[],
    "crossCurricularHooks": string[]
  }
}

CRITICAL RULES:
- Total duration MUST equal ${plannerMinutes} minutes
- Adapt ALL content for ${gradeBand} grade level
- Align to teacher/school settings:
  • Teaching perspective: ${teachingPerspective}  
  • Learning style emphasis: ${learningStyle}  
  • Ability profile: ${JSON.stringify(ability)}
- Reflect calendar: keywords ${JSON.stringify(calendarKeywords)}
  within ${JSON.stringify(calendarWindow || {})}.
- If cross-curricular hooks help engagement, bias toward heavier weights in:
  ${JSON.stringify(subjectWeights)} while keeping core subject = ${subject}.
`;

  const user = `
[CORE SUBJECT]: ${subject}
[GRADE BAND]: ${gradeBand}
[DURATION]: ${plannerMinutes} minutes
[TEACHING APPROACH]: ${teachingPerspective}
[LEARNING STYLE]: ${learningStyle}
[ABILITY ADAPTATIONS]: ${JSON.stringify(ability)}
[CALENDAR CONTEXT]: ${calendarKeywords.join(', ')} (${calendarWindow?.startISO || 'current'} to ${calendarWindow?.endISO || 'current'})
[STUDENT INTERESTS]: ${studentInterests.join(', ')}
[SUBJECT WEIGHTS]: ${JSON.stringify(subjectWeights)}
[CURRICULUM]: ${curriculum.standards?.join('; ') || 'Standard curriculum'}
[LOCALIZATION]: ${edu.countryCode} | ${edu.language} | ${edu.measurement} units | ${edu.currencySymbol}

Generate an engaging ${plannerMinutes}-minute learning experience that:
1. Centers on ${subject} but connects to high-priority subjects from teacher weights
2. Uses ${teachingPerspective} pedagogy 
3. Emphasizes ${learningStyle} learning modalities
4. Includes appropriate scaffolding/extensions based on ability profile
5. Weaves in calendar keywords naturally
6. Maintains student engagement through their interests

Make it memorable and educationally rigorous.
`;

  return { system, user };
}

export const PROMPT_VERSION_V3 = 3 as const;
