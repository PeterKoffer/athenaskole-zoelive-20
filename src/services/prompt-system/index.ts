// ============================================
// UNIFIED PROMPT SYSTEM
// Only TWO main prompts for the entire system
// ============================================

export interface PromptContext {
  // Core parameters
  subject: string;
  gradeLevel: number;
  
  // Extended Training Ground parameters
  curriculumStandards?: string;
  teachingPerspective?: string;
  lessonDuration?: number; // in minutes
  subjectWeight?: 'high' | 'medium' | 'low';
  calendarKeywords?: string[];
  calendarDuration?: string;
  studentAbilities?: string;
  learningStyle?: string;
  studentInterests?: string[];
  
  // Legacy support
  performanceLevel?: 'below' | 'average' | 'above';
  interests?: string[];
  schoolPhilosophy?: string;
}

// ============================================
// 1. TRAINING GROUND PROMPT - Creative Activities
// ============================================
export function createTrainingGroundPrompt(context: PromptContext): string {
  // Extract all 12 parameters with fallbacks as specified
  const {
    subject,
    gradeLevel,
    curriculumStandards = 'broadly accepted topics and skills for that grade',
    teachingPerspective = 'balanced, evidence-based style',
    lessonDuration = 35, // 30-45 minute fallback
    subjectWeight = 'medium',
    calendarKeywords = [],
    calendarDuration = 'standalone session',
    studentAbilities = 'mixed ability with both support and challenges',
    learningStyle = 'multimodal approach',
    studentInterests = [],
    
    // Legacy support mappings
    performanceLevel,
    interests = [],
    schoolPhilosophy
  } = context;

  // Map legacy fields to new system
  const finalTeachingPerspective = teachingPerspective || schoolPhilosophy || 'balanced, evidence-based style';
  const finalStudentInterests = studentInterests.length > 0 ? studentInterests : 
    (interests.length > 0 ? interests : ['generally relatable examples']);
  const finalStudentAbilities = studentAbilities || 
    (performanceLevel ? `${performanceLevel} grade level performance` : 'mixed ability with both support and challenges');

  // Compose contextual descriptions for the interactive adventure
  const keywordText = calendarKeywords.length > 0
    ? `the context of ${calendarKeywords.join(', ')} over the next ${calendarDuration}`
    : 'general, timeless examples appropriate for any time of year';
  const interestText = finalStudentInterests.length > 0
    ? finalStudentInterests.join(', ')
    : "the student's general interests";
  const abilityAdaptation = finalStudentAbilities;
  const learningStyleAdaptation = learningStyle;

  return `You are a world-class ${subject} teacher and imaginative storyteller creating an immersive, game-like lesson for a Grade ${gradeLevel} student.
The lesson must align fully with ${curriculumStandards} and follow the school's ${finalTeachingPerspective} teaching approach.

Design a dynamic, interactive learning adventure lasting about ${lessonDuration} minutes.
${subject} is a ${subjectWeight} priority in our curriculum, so adjust depth accordingly.
Incorporate ${keywordText} and adapt to the student's level — ${abilityAdaptation} — and preferred learning style — ${learningStyleAdaptation}.
Incorporate their personal interests: ${interestText}.

The adventure must have:
1) An exciting opening scenario that hooks the student immediately — they are solving a mystery, helping someone, exploring a strange world, or repairing a crisis.
2) Multiple stages or “scenes”, each with:
   - A short chunk of story (very concise).
   - An activity or challenge directly tied to ${subject}.
   - Clear instructions for the activity.
3) A variety of challenge types (not just multiple choice). Include a mix of:
   - multipleChoice, fillBlank, puzzle, matching, sequencing, experiment, creativeTask
4) Pacing that fills the whole ${lessonDuration} minutes — provide OPTIONAL "bonusMissions" so faster students stay engaged, while slower students can still reach the ending.
5) A satisfying conclusion that rewards the student.

Return ONLY JSON in this exact schema (no extra prose):

{
  "title": "string",
  "scenario": "string",
  "stages": [
    {
      "story": "string",
      "activityType": "multipleChoice | fillBlank | puzzle | matching | sequencing | experiment | creativeTask",
      "activity": {
        "question": "string",
        "options": ["string", "string", "string", "string"],
        "correct": 0,
        "expectedAnswer": "string",
        "rubric": "string",
        "explanation": "string"
      },
      "imagePrompts": [
        "string (describe an image to generate for this scene or concept)",
        "string"
      ]
    }
  ],
  "bonusMissions": [
    {
      "story": "string",
      "activityType": "multipleChoice | fillBlank | puzzle | matching | sequencing | experiment | creativeTask",
      "activity": { "question": "string", "options": [], "expectedAnswer": "string", "rubric": "string", "explanation": "string" },
      "imagePrompts": ["string"]
    }
  ],
  "objectives": ["string", "string"],
  "estimatedTime": ${lessonDuration}
}

Rules:
- Keep story chunks short and energetic.
- Each stage must include exactly one activity.
- Activities must directly teach or practice ${subject} content aligned with ${curriculumStandards}.
- Use ${abilityAdaptation} and ${learningStyleAdaptation} to tailor wording and supports.
- Use ${interestText} for light theming (names, settings, examples).
- Provide 1–3 imagePrompts per stage for visuals (scenes, diagrams, characters).
- Ensure exactly ONE correct answer for multipleChoice. Provide ` + "`expectedAnswer`" + ` for non-MC activities.
- Do NOT include any text outside the JSON.`;
}

// ============================================
// 2. DAILY LESSON PROMPT - Educational Questions
// ============================================
export function createDailyLessonPrompt(context: PromptContext): string {
  const {
    subject,
    gradeLevel,
    performanceLevel = 'average',
    learningStyle = 'mixed'
  } = context;

  return `You are a world-class ${subject} teacher and imaginative storyteller creating an immersive, game-like lesson for Grade ${gradeLevel}.

Design a dynamic, interactive learning adventure lasting about 35 minutes.
Use age-appropriate language and adapt to the student's performance level (${performanceLevel}) and learning style (${learningStyle}).

Return ONLY JSON in this exact schema (no extra prose):
{
  "title": "string",
  "scenario": "string",
  "stages": [
    {
      "story": "string",
      "activityType": "multipleChoice | fillBlank | puzzle | matching | sequencing | experiment | creativeTask",
      "activity": {
        "question": "string",
        "options": ["string", "string", "string", "string"],
        "correct": 0,
        "expectedAnswer": "string",
        "rubric": "string",
        "explanation": "string"
      },
      "imagePrompts": [
        "string (describe an image to generate for this scene or concept)",
        "string"
      ]
    }
  ],
  "bonusMissions": [
    {
      "story": "string",
      "activityType": "multipleChoice | fillBlank | puzzle | matching | sequencing | experiment | creativeTask",
      "activity": { "question": "string", "options": [], "expectedAnswer": "string", "rubric": "string", "explanation": "string" },
      "imagePrompts": ["string"]
    }
  ],
  "objectives": ["string", "string"],
  "estimatedTime": 35
}

Rules:
- Keep story chunks short and energetic.
- Each stage must include exactly one activity.
- Activities must directly teach or practice ${subject} content suitable for Grade ${gradeLevel}.
- Tailor wording and supports to ${performanceLevel} performance and ${learningStyle} learning style.
- Provide 1–3 imagePrompts per stage for visuals.
- Ensure exactly ONE correct answer for multipleChoice. Provide ` + "`expectedAnswer`" + ` for non-MC activities.
- Do NOT include any text outside the JSON.`;
}

// ============================================
// PROMPT SELECTOR
// ============================================
export function getPromptForContext(
  type: 'training-ground' | 'daily-lesson',
  context: PromptContext
): string {
  switch (type) {
    case 'training-ground':
      return createTrainingGroundPrompt(context);
    case 'daily-lesson':
      return createDailyLessonPrompt(context);
    default:
      throw new Error(`Unknown prompt type: ${type}`);
  }
}