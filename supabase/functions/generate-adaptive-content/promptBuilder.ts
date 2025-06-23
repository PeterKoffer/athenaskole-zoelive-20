export interface PromptConfig {
  subject: string;
  skillArea: string;
  difficultyLevel: number;
  previousQuestions: string[];
  diversityPrompt?: string;
  sessionId?: string;
  gradeLevel?: number;
  standardsAlignment?: Record<string, unknown>;
  uniquenessInstructions?: string;
  forceUnique?: boolean;
  questionContext?: {
    teachingStyle?: string;
    teachingPerspective?: {
      style?: string;
      approach?: string;
      emphasis?: string;
      scaffolding?: string;
    }
  }
}

export function createGradeAlignedPrompt(config: PromptConfig): string {
  console.log('🎯 Creating GRADE-ALIGNED prompt with teaching perspective for:', config.subject, 'Grade:', config.gradeLevel);

  let prompt = '';

  const normalizedSubject = normalizeSubjectName(config.subject);
  console.log('🔄 Normalized subject from', config.subject, 'to', normalizedSubject);

  // Add grade-level alignment section
  const gradeAlignment = createGradeLevelAlignment(config.gradeLevel || 5);
  const teachingPerspectivePrompt = createTeachingPerspectivePrompt(config);

  if (normalizedSubject === 'english') {
    prompt = createEnglishPrompt(config.gradeLevel);
  } else if (normalizedSubject === 'mathematics') {
    prompt = createMathematicsPrompt(config.skillArea, config.difficultyLevel, config.gradeLevel);
  } else if (normalizedSubject === 'creative_writing') {
    prompt = createCreativeWritingPrompt(config.gradeLevel);
  } else if (normalizedSubject === 'science') {
    prompt = createSciencePrompt(config.gradeLevel);
  } else {
    console.error('⚠️ Unknown subject after normalization:', normalizedSubject, 'original:', config.subject);
    throw new Error(`Unsupported subject: ${config.subject}. Supported subjects are: english, mathematics, creative_writing, science`);
  }

  // Add grade alignment and teaching perspective
  prompt += `\n\n${gradeAlignment}`;
  prompt += `\n\n${teachingPerspectivePrompt}`;

  // Enhanced uniqueness requirements with grade context
  if (config.previousQuestions.length > 0) {
    const recentQuestions = config.previousQuestions.slice(-25);
    const timestamp = Date.now();

    prompt += `\n\nCRITICAL GRADE ${config.gradeLevel || 5} UNIQUENESS REQUIREMENTS:

🎓 GRADE-LEVEL REQUIREMENTS:
- Content MUST be appropriate for Grade ${config.gradeLevel || 5} students
- Use vocabulary and concepts suitable for ${getAgeGroup(config.gradeLevel || 5)}
- Align with ${getCognitiveDevelopmentLevel(config.gradeLevel || 5)} thinking
- Match ${getConceptualComplexityLevel(config.gradeLevel || 5)} complexity

🚫 FORBIDDEN - NEVER generate these or similar questions:
${recentQuestions.map((q, i) => `${i + 1}. ${q.substring(0, 200)}...`).join('\n')}

✅ MANDATORY REQUIREMENTS:
1. Grade ${

