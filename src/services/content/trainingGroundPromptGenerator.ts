export interface TrainingGroundConfig {
  subject: string;
  gradeLevel?: string;
  curriculumStandards?: string;
  teachingPerspective?: string;
  lessonDurationMinutes?: number;
  subjectWeight?: 'high' | 'medium' | 'low';
  calendarKeywords?: string[];
  calendarDuration?: string;
  studentAbilities?: 'below' | 'average' | 'above';
  learningStyle?: 'visual' | 'auditory' | 'kinesthetic' | 'reading/writing' | 'mixed';
  studentInterests?: string[];
}

export interface PromptResult {
  prompt: string;
  metadata: {
    fallbacksUsed: string[];
    parametersSource: Record<string, string>;
    adaptations: string[];
  };
}

/**
 * Universal Training Ground prompt generator with intelligent fallbacks
 * Consolidates all prompt generation logic into one maintainable system
 */
export function generateTrainingGroundPrompt(config: TrainingGroundConfig): PromptResult {
  const fallbacks: string[] = [];
  const source: Record<string, string> = {};
  const adaptations: string[] = [];

  function use<T>(value: T | undefined, fallback: T, key: keyof TrainingGroundConfig, fallbackReason: string): T {
    if (value === undefined || value === null || (Array.isArray(value) && value.length === 0)) {
      fallbacks.push(`${key}: ${fallbackReason}`);
      source[key as string] = 'fallback';
      return fallback;
    }
    source[key as string] = 'provided';
    return value;
  }

  // Apply intelligent fallbacks
  const subject = use(config.subject, 'General Studies', 'subject', 'No subject provided');
  const gradeLevel = use(config.gradeLevel, 'middle school', 'gradeLevel', 'No grade level specified');
  const curriculum = use(config.curriculumStandards, 'internationally accepted standards', 'curriculumStandards', 'No curriculum alignment provided');
  const perspective = use(config.teachingPerspective, 'balanced, evidence-based pedagogy', 'teachingPerspective', 'No teaching perspective specified');
  const duration = use(config.lessonDurationMinutes, 30, 'lessonDurationMinutes', 'No duration specified');
  const weight = use(config.subjectWeight, 'medium', 'subjectWeight', 'No subject priority specified');
  const keywords = use(config.calendarKeywords, [], 'calendarKeywords', 'No calendar context provided');
  const calDuration = use(config.calendarDuration, 'this week', 'calendarDuration', 'No calendar timeframe specified');
  const ability = use(config.studentAbilities, 'average', 'studentAbilities', 'No ability assessment provided');
  const style = use(config.learningStyle, 'mixed', 'learningStyle', 'No learning style preference specified');
  const interests = use(config.studentInterests, [], 'studentInterests', 'No student interests provided');

  // Track adaptations made
  if (style !== 'mixed') {
    adaptations.push(`Adapted for ${style} learning style`);
  }
  if (ability !== 'average') {
    adaptations.push(`Difficulty adjusted for ${ability} ability learner`);
  }
  if (interests.length > 0) {
    adaptations.push(`Incorporated student interests: ${interests.join(', ')}`);
  }
  if (keywords.length > 0) {
    adaptations.push(`Added seasonal/calendar context: ${keywords.join(', ')}`);
  }

  // Build contextual content
  const keywordText = keywords.length > 0
    ? `Consider the context of ${keywords.join(', ')} over the next ${calDuration} in the lesson content.`
    : 'Use general, timeless examples appropriate for any time of year.';

  const interestText = interests.length > 0
    ? `Connect to the student's interests in ${interests.join(', ')} to make the lesson engaging.`
    : 'Use broadly relatable examples that appeal to students of this age group.';

  const learningStyleAdaptation = getLearningStyleGuidance(style);
  const abilityAdaptation = getAbilityLevelGuidance(ability);

  // Generate the complete prompt
  const prompt = `You are a world-class ${subject} teacher creating a lesson for a ${gradeLevel} student. Develop a lesson aligned with ${curriculum} and incorporate the school's ${perspective} approach. The lesson should be designed for about ${duration} minutes of learning. Since ${subject} is a ${weight} priority subject in our curriculum, adjust the depth accordingly. ${keywordText} Tailor the material to the student's skill level – ${abilityAdaptation}, providing support or extension as needed. ${learningStyleAdaptation} ${interestText} Include interactive activities or a game, and end with a brief quiz or test to assess understanding.

CRITICAL INSTRUCTIONS:
1. Calculate the correct answer step by step before creating options
2. Make sure the "correct" field matches the index of the mathematically correct answer
3. Double-check your math before finalizing
4. There must be EXACTLY ONE correct answer - no equivalent options (like 1/2 and 2/4)
5. All wrong answers must be clearly incorrect

Return ONLY a valid JSON object with this exact structure:
{
  "question": "Your question here",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correct": 0,
  "explanation": "Clear explanation why the answer is correct",
  "learningObjectives": ["Learning objective 1", "Learning objective 2"],
  "estimatedTime": ${duration}
}

Requirements:
- The "correct" field should be the index (0-3) of the correct answer
- Make exactly 4 multiple choice options
- Ensure the correct answer is actually correct mathematically
- Make wrong answers plausible but clearly incorrect
- Use age-appropriate language for ${gradeLevel}
- Include step-by-step explanation
- VERIFY: The option at index "correct" must be the mathematically correct answer`;

  return {
    prompt,
    metadata: {
      fallbacksUsed: fallbacks,
      parametersSource: source,
      adaptations,
    }
  };
}

/**
 * Subject-specific wrapper function for easy integration
 */
export function generatePromptForSubject(subject: string, context: Partial<TrainingGroundConfig>): PromptResult {
  return generateTrainingGroundPrompt({
    ...context,
    subject
  });
}

/**
 * Build context from app data sources
 */
export function buildContextFromAppData(
  learnerProfile?: any,
  teacherSettings?: any,
  calendarData?: any,
  schoolConfig?: any
): Partial<TrainingGroundConfig> {
  return {
    gradeLevel: learnerProfile?.grade_level?.toString(),
    learningStyle: learnerProfile?.learning_style_preference || 'mixed',
    studentInterests: learnerProfile?.interests || [],
    studentAbilities: determineAbilityLevel(learnerProfile?.performance_data),
    teachingPerspective: teacherSettings?.teaching_approach || schoolConfig?.pedagogy,
    curriculumStandards: teacherSettings?.curriculum_alignment || schoolConfig?.standards,
    calendarKeywords: calendarData?.active_themes || [],
    calendarDuration: calendarData?.current_unit_duration || 'this week',
    subjectWeight: teacherSettings?.subject_priorities?.[0] || 'medium'
  };
}

// Helper functions
function getLearningStyleGuidance(style: string): string {
  switch (style) {
    case 'visual':
      return 'Use a visual approach with diagrams, charts, and spatial reasoning in word problems.';
    case 'auditory':
      return 'Use an auditory approach with rhythmic patterns, word problems with dialogue, and sound-based contexts.';
    case 'kinesthetic':
      return 'Use a kinesthetic approach with hands-on scenarios, movement-based problems, and physical activities.';
    case 'reading/writing':
      return 'Use a reading/writing approach with text-based explanations, written exercises, and vocabulary building.';
    default:
      return 'Use a multi-modal approach that combines visual, auditory, and kinesthetic elements.';
  }
}

function getAbilityLevelGuidance(ability: string): string {
  switch (ability) {
    case 'below':
      return 'student performing below grade level - provide extra scaffolding, simpler vocabulary, and step-by-step guidance';
    case 'above':
      return 'student performing above grade level - provide advanced challenges, complex scenarios, and extension activities';
    default:
      return 'student performing at grade level - provide standard complexity with appropriate support';
  }
}

function determineAbilityLevel(performanceData?: any): 'below' | 'average' | 'above' {
  if (!performanceData?.accuracy) return 'average';
  
  const accuracy = performanceData.accuracy;
  if (accuracy < 0.7) return 'below';
  if (accuracy > 0.85) return 'above';
  return 'average';
}