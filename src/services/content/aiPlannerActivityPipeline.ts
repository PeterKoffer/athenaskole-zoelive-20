import { invokeFn } from '@/supabase/functionsClient';
import { z } from "zod";

// Zod schemas for validating AI outputs
export const PlannerActivitySlotSchema = z.object({
  slotId: z.string(),
  type: z.enum([
    "diagnostic_mcq",
    "observe_image",
    "data_reading",
    "scenario_choice",
    "short_constructed_response",
    "sort_match",
    "exit_ticket",
    "creative_task",
    "puzzle",
  ] as const),
  targetConcept: z.string(),
  curriculumStandard: z.string().default("")
    .or(z.literal("")).optional(),
  difficulty: z.enum(["easy", "medium", "hard"]),
  timeMin: z.number().int().min(1),
  styleDirectives: z
    .object({
      learningStyleCues: z.array(z.string()).optional(),
      accommodations: z.array(z.string()).optional(),
    })
    .optional(),
});

export const PlannerSceneSchema = z.object({
  id: z.string(),
  beat: z.string(),
  activities: z.array(PlannerActivitySlotSchema),
});

export const PlannerSchema = z.object({
  meta: z.object({
    source: z.string(),
    plannerVersion: z.string(),
    subject: z.string(),
    gradeLevel: z.string(),
    curriculum: z.object({
      framework: z.string().optional(),
      standards: z.array(z.string()).optional(),
      mustIncludeConcepts: z.array(z.string()).optional(),
    }),
    schoolPerspective: z.object({
      teachingApproach: z.string().optional(),
      tone: z.string().optional(),
      constraints: z.array(z.string()).optional(),
    }),
    time: z.object({
      lessonDurationMinutes: z.number().int(),
      calendarKeywords: z.array(z.string()).optional(),
      calendarSpanDays: z.number().int().optional(),
    }),
    teacherPreferences: z.object({
      subjectWeights: z.record(z.number()).optional(),
      assessmentPreference: z.string().optional(),
      mediaPreference: z.string().optional(),
      allowShortClips: z.boolean().optional(),
    }),
    studentGroup: z.object({
      learningStyles: z.array(z.string()).optional(),
      abilityProfile: z.string().optional(),
      readability: z.string().optional(),
      interests: z.array(z.string()).optional(),
      language: z.string().optional(),
      accommodations: z.array(z.string()).optional(),
    }),
  }),
  world: z.object({
    title: z.string(),
    hook: z.string(),
    setting: z.string(),
    tone: z.string(),
    learningObjectives: z.array(z.string()),
  }),
  scenes: z.array(PlannerSceneSchema),
  bonusActivity: PlannerActivitySlotSchema.optional(),
  styleGuide: z
    .object({
      imageStyle: z.string().optional(),
      videoStyle: z.string().optional(),
    })
    .optional(),
  timeBudget: z.object({
    sumPlannedMinutes: z.number(),
    fitsDuration: z.boolean(),
  }),
});

export type Planner = z.infer<typeof PlannerSchema>;
export type PlannerActivitySlot = z.infer<typeof PlannerActivitySlotSchema>;

export const ActivitySchema = z.object({
  slotId: z.string(),
  kind: z.enum([
    "diagnostic_mcq",
    "observe_image",
    "data_reading",
    "scenario_choice",
    "short_constructed_response",
    "sort_match",
    "exit_ticket",
    "creative_task",
    "puzzle",
  ] as const),
  narrative: z.string().optional().default(""),
  question: z.string().optional().default(""),
  stimulus: z
    .object({ type: z.string(), content: z.any() })
    .optional()
    .default({ type: "none", content: "" }),
  options: z.array(z.string()).optional().default([]),
  correctIndex: z.number().int().optional(),
  explanation: z.string().optional().default(""),
  hints: z.array(z.string()).optional().default([]),
  imagePrompt: z.string().optional().default(""),
  videoBeat: z
    .object({ enabled: z.boolean(), beatSheet: z.array(z.string()) })
    .optional(),
  estimatedTimeMin: z.number().int().optional().default(5),
  difficulty: z.enum(["easy", "medium", "hard"]).optional().default("medium"),
  finalDifficulty: z.enum(["easy", "medium", "hard"]).optional().default("medium"),
  skills: z.array(z.string()).optional().default([]),
  curriculumStandard: z.string().optional().default(""),
  targetConcept: z.string().optional().default(""),
  rubric: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional().default([]),
});

export type GeneratedActivity = z.infer<typeof ActivitySchema>;

export type LessonContext = {
  subject: string;
  gradeLevel: string | number;
  curriculum: {
    framework: string;
    standards: string[];
    mustIncludeConcepts: string[];
  };
  schoolPerspective: {
    teachingApproach: string;
    tone: string;
    constraints: string[];
  };
  time: {
    lessonDurationMinutes: number;
    calendarKeywords: string[];
    calendarSpanDays: number;
  };
  teacherPreferences: {
    subjectWeights: Record<string, number>;
    assessmentPreference: string;
    mediaPreference: string;
    allowShortClips: boolean;
  };
  studentGroup: {
    learningStyles: string[];
    abilityProfile: string;
    readability: string;
    interests: string[];
    language: string;
    accommodations: string[];
  };
  adaptivity: {
    difficultyPolicy: string;
    hintPolicy: string;
    fastFinishPolicy: string;
  };
};

function buildPlannerPrompts(context: LessonContext) {
  const systemPrompt = `You are a master learning-experience designer. Plan a single-day interactive adventure lesson.
Must obey all provided context: subject, grade level, curriculum standards, school perspective, teacher preferences, calendar keywords, lesson duration, and student group profile (abilities, learning styles, interests, accommodations).
Balance rigor with fun. Design varied activities (not just reading): MCQ, scenario choices, data reading, short constructed response, sort/drag, reflection, etc.
Allocate time per activity so summed time ≈ lessonDurationMinutes. Include an optional bonus activity if students finish early.
For each activity, embed the explicit curriculum concept/standard targeted.
Output ONLY valid JSON matching the schema below.`;

  const schemaExcerpt = `Schema keys: meta, world, scenes[ { id, beat, activities[ { slotId, type, targetConcept, curriculumStandard, difficulty, timeMin, styleDirectives } ] } ], bonusActivity, styleGuide, timeBudget`;

  const userPrompt = `Use this context to produce the plan. Ensure timeBudget.fitsDuration = true (sum activities equals lessonDurationMinutes ± 1). Target curriculum concepts & standards explicitly per activity. Include a bonusActivity. Respect school constraints, student learning styles, and interests. Keep the tone consistent with schoolPerspective.tone.\n\nContext:\n${JSON.stringify(context)}`;

  return { systemPrompt, userPrompt: `${userPrompt}\n\n${schemaExcerpt}` };
}

function buildActivityPrompts(slot: PlannerActivitySlot, world: Planner["world"], context: LessonContext) {
  const systemPrompt = `You generate student-ready interactive tasks from a slot plan. MUST use: subject, grade level, curriculum standard, school perspective, time budget, student abilities/learning styles/interests, accommodations. Output ONLY JSON matching the schema. Rules: One and only one correct option (if options exist). Provide explanation and at least one hint. Keep reading level ≈ studentGroup.readability. Include imagePrompt (and videoBeat if teacherPreferences.allowShortClips is true). If type is short_constructed_response, include a concise rubric (3 criteria). If adaptivity.difficultyPolicy is adjust_per_activity, tune difficulty to abilityProfile and mark finalDifficulty.`;

  const schemaExcerpt = `Schema keys: slotId, kind, narrative, question, stimulus{type,content}, options[], correctIndex, explanation, hints[], imagePrompt, videoBeat{enabled,beatSheet[]}, estimatedTimeMin, difficulty, finalDifficulty, skills[], curriculumStandard, targetConcept, rubric[], tags[]`;

  const userPrompt = `Generate the activity for this slot using the context and world. Ensure the content aligns to curriculumStandard and targetConcept. Reflect schoolPerspective.teachingApproach and studentGroup.learningStyles. If interests exist, weave them into narrative/stimulus. Respect accommodations (short instructions, optional read-aloud). 

IMPORTANT: Include a "tags" array with 2-4 interest tags from this list that best describe the activity content: ["sports", "music", "art", "cooking", "technology", "nature", "science", "history", "animals", "travel", "gaming", "health", "fashion", "cars", "finance", "mathematics", "languages", "geography", "weather", "space", "robots", "film", "food"].

Output valid JSON only.\n\n${JSON.stringify({ slot, world, context })}`;

  return { systemPrompt, userPrompt: `${userPrompt}\n\n${schemaExcerpt}` };
}

export async function generateLessonPlan(context: LessonContext): Promise<Planner> {
  const { systemPrompt, userPrompt } = buildPlannerPrompts(context);
  const data = await invokeFn('generate-adaptive-content', {
    systemPrompt,
    userPrompt,
    model: 'gpt-4o',
    temperature: 0.4
  });
  
  const raw = typeof data === 'string' ? JSON.parse(data) : data;
  
  // Handle the response format from the edge function
  const responseData = raw.success ? raw.generatedContent : raw;
  
  const parsed = PlannerSchema.safeParse(responseData);
  if (!parsed.success) {
    console.warn('Planner validation failed:', parsed.error.issues);
    throw new Error(`Planner JSON invalid: ${JSON.stringify(parsed.error.issues)}`);
  }
  return parsed.data;
}

export async function generateActivityForSlot(slot: PlannerActivitySlot, world: Planner["world"], context: LessonContext): Promise<GeneratedActivity> {
  const { systemPrompt, userPrompt } = buildActivityPrompts(slot, world, context);
  const data = await invokeFn('generate-adaptive-content', {
    systemPrompt,
    userPrompt,
    model: 'gpt-4o',
    temperature: 0.5
  });
  
  const raw = typeof data === 'string' ? JSON.parse(data) : data;
  
  // Handle the response format from the edge function
  const responseData = raw.success ? raw.generatedContent : raw;
  
  const parsed = ActivitySchema.safeParse(responseData);
  if (!parsed.success) {
    console.warn('Activity validation failed:', parsed.error.issues);
    throw new Error(`Activity JSON invalid: ${JSON.stringify(parsed.error.issues)}`);
  }
  return parsed.data;
}
