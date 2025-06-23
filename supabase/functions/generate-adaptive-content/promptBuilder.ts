
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
1. Grade ${config.gradeLevel || 5} appropriate vocabulary and concepts
2. COMPLETELY different scenarios, numbers, and contexts
3. Unique problem types and formats
4. Age-appropriate real-world examples
5. Engaging and educational content
6. Original mathematical operations (if applicable)

RESPONSE FORMAT (JSON):
{
  "question": "Grade ${config.gradeLevel || 5} appropriate question text",
  "options": ["A", "B", "C", "D"],
  "correct": 0,
  "explanation": "Age-appropriate explanation"
}`;
  }

  return prompt;
}

function normalizeSubjectName(subject: string): string {
  const normalized = subject.toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z_]/g, '');
  
  // Map common variations
  const mappings: Record<string, string> = {
    'math': 'mathematics',
    'maths': 'mathematics',
    'writing': 'creative_writing',
    'english_language_arts': 'english',
    'ela': 'english',
    'language_arts': 'english'
  };
  
  return mappings[normalized] || normalized;
}

function createGradeLevelAlignment(gradeLevel: number): string {
  return `
GRADE ${gradeLevel} EDUCATIONAL ALIGNMENT:

Age Group: ${getAgeGroup(gradeLevel)}
Cognitive Level: ${getCognitiveDevelopmentLevel(gradeLevel)}
Complexity Level: ${getConceptualComplexityLevel(gradeLevel)}

GRADE ${gradeLevel} REQUIREMENTS:
- Vocabulary appropriate for ${gradeLevel}th grade reading level
- Concepts aligned with grade ${gradeLevel} curriculum standards
- Problem complexity suitable for ${getAgeGroup(gradeLevel)}
- Examples relevant to ${gradeLevel}th grade experiences
`;
}

function createTeachingPerspectivePrompt(config: PromptConfig): string {
  const perspective = config.questionContext?.teachingPerspective;
  if (!perspective) {
    return `
TEACHING APPROACH:
- Use encouraging, supportive language
- Provide clear, step-by-step explanations
- Include real-world examples students can relate to
`;
  }

  return `
PERSONALIZED TEACHING PERSPECTIVE:
Style: ${perspective.style || 'supportive'}
Approach: ${perspective.approach || 'step-by-step'}
Emphasis: ${perspective.emphasis || 'understanding'}
Scaffolding: ${perspective.scaffolding || 'guided practice'}

Apply this teaching style to the question generation and explanation.
`;
}

function createEnglishPrompt(gradeLevel?: number): string {
  const grade = gradeLevel || 5;
  return `Generate a Grade ${grade} English Language Arts question focusing on reading comprehension, vocabulary, or grammar appropriate for ${getAgeGroup(grade)}.`;
}

function createMathematicsPrompt(skillArea: string, difficultyLevel: number, gradeLevel?: number): string {
  const grade = gradeLevel || 5;
  return `Generate a Grade ${grade} mathematics question in ${skillArea} with difficulty level ${difficultyLevel}/5, appropriate for ${getAgeGroup(grade)}.`;
}

function createCreativeWritingPrompt(gradeLevel?: number): string {
  const grade = gradeLevel || 5;
  return `Generate a Grade ${grade} creative writing prompt or question appropriate for ${getAgeGroup(grade)}.`;
}

function createSciencePrompt(gradeLevel?: number): string {
  const grade = gradeLevel || 5;
  return `Generate a Grade ${grade} science question appropriate for ${getAgeGroup(grade)}.`;
}

function getAgeGroup(gradeLevel: number): string {
  if (gradeLevel <= 2) return 'early elementary (ages 5-7)';
  if (gradeLevel <= 5) return 'elementary (ages 8-11)';
  if (gradeLevel <= 8) return 'middle school (ages 12-14)';
  return 'high school (ages 15-18)';
}

function getCognitiveDevelopmentLevel(gradeLevel: number): string {
  if (gradeLevel <= 2) return 'concrete operational (early)';
  if (gradeLevel <= 5) return 'concrete operational';
  if (gradeLevel <= 8) return 'transitional to formal operational';
  return 'formal operational';
}

function getConceptualComplexityLevel(gradeLevel: number): string {
  if (gradeLevel <= 2) return 'basic concrete concepts';
  if (gradeLevel <= 5) return 'concrete concepts with some abstraction';
  if (gradeLevel <= 8) return 'abstract concepts with concrete examples';
  return 'complex abstract concepts';
}
