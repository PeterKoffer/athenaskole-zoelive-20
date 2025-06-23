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
1. Grade ${config.gradeLevel || 5} appropriate language and concepts
2. Teaching perspective alignment (see above requirements)
3. COMPLETELY different scenarios, numbers, and contexts
4. Age-appropriate real-world applications
5. Standards-aligned content for the grade level
6. Vocabulary suitable for grade level
7. Cognitive load appropriate for age group
8. Cultural sensitivity and inclusivity
9. Engaging and motivating content
10. Clear learning objectives

Session: ${config.sessionId || timestamp}
Grade Level: ${config.gradeLevel || 5}
Teaching Style: ${config.questionContext?.teachingStyle || 'mixed'}`;
  }

  if (config.diversityPrompt) {
    prompt += `\n\nGRADE-APPROPRIATE DIVERSITY: ${config.diversityPrompt} (adapted for Grade ${config.gradeLevel || 5})`;
  }

  console.log('📝 Final GRADE-ALIGNED prompt created for Grade', config.gradeLevel || 5, normalizedSubject);
  return prompt;
}

function createGradeLevelAlignment(gradeLevel: number): string {
  return `
🎓 GRADE ${gradeLevel} ALIGNMENT REQUIREMENTS:

Age Group: ${getAgeGroup(gradeLevel)}
Cognitive Level: ${getCognitiveDevelopmentLevel(gradeLevel)}
Vocabulary: ${getVocabularyLevel(gradeLevel)}
Complexity: ${getConceptualComplexityLevel(gradeLevel)}

ESSENTIAL GRADE ${gradeLevel} GUIDELINES:
- Use age-appropriate language and examples
- Match cognitive development expectations
- Include grade-level appropriate challenges
- Connect to grade-level curriculum standards
- Use familiar contexts and scenarios for this age group
- Ensure mathematical/conceptual difficulty matches grade expectations
`;
}

function createTeachingPerspectivePrompt(config: PromptConfig): string {
  const perspective = config.questionContext?.teachingPerspective;
  if (!perspective) return '';

  let prompt = `
🎨 TEACHING PERSPECTIVE INTEGRATION:

Learning Style: ${perspective.style}
Teaching Approach: ${perspective.approach}
Content Emphasis: ${perspective.emphasis}
Scaffolding Level: ${perspective.scaffolding}

PERSPECTIVE-SPECIFIC REQUIREMENTS:
`;

  // Add style-specific requirements
  switch (perspective.style) {
    case 'visual':
      prompt += '- Include visual descriptions, spatial relationships, charts, or diagrams\n';
      prompt += '- Use imagery and visual patterns in explanations\n';
      break;
    case 'kinesthetic':
      prompt += '- Include hands-on activities and physical manipulation scenarios\n';
      prompt += '- Use real-world activities involving movement or building\n';
      break;
    case 'auditory':
      prompt += '- Include sound-based examples, rhythmic patterns, or music references\n';
      prompt += '- Use verbal instruction patterns and audio-related scenarios\n';
      break;
    case 'reading-writing':
      prompt += '- Focus on text-based learning and written comprehension\n';
      prompt += '- Include reading and writing activities in scenarios\n';
      break;
    case 'mixed':
      prompt += '- Combine visual, auditory, kinesthetic, and reading elements\n';
      prompt += '- Use multi-sensory approaches in the question design\n';
      break;
  }

  // Add approach-specific requirements
  switch (perspective.approach) {
    case 'constructivist':
      prompt += '- Encourage discovery and exploration through open-ended elements\n';
      prompt += '- Build on prior knowledge and encourage critical thinking\n';
      break;
    case 'behaviorist':
      prompt += '- Provide clear step-by-step instructions and immediate feedback\n';
      prompt += '- Use structured learning patterns with reinforcement\n';
      break;
    case 'cognitive':
      prompt += '- Focus on problem-solving strategies and mental processes\n';
      prompt += '- Encourage metacognitive thinking about learning\n';
      break;
    case 'humanistic':
      prompt += '- Use encouraging, confidence-building language\n';
      prompt += '- Consider emotional aspects and personal growth\n';
      break;
  }

  return prompt;
}

function getAgeGroup(gradeLevel: number): string {
  if (gradeLevel <= 2) return 'Early Elementary (Ages 5-7)';
  if (gradeLevel <= 5) return 'Elementary (Ages 8-11)';  
  if (gradeLevel <= 8) return 'Middle School (Ages 12-14)';
  return 'High School (Ages 15-18)';
}

function getCognitiveDevelopmentLevel(gradeLevel: number): string {
  if (gradeLevel <= 2) return 'Concrete Operational - Early Stage';
  if (gradeLevel <= 5) return 'Concrete Operational';
  if (gradeLevel <= 8) return 'Transitional to Formal Operational';
  return 'Formal Operational';
}

function getVocabularyLevel(gradeLevel: number): string {
  if (gradeLevel <= 2) return 'Simple, everyday vocabulary';
  if (gradeLevel <= 5) return 'Grade-level vocabulary with basic academic terms';
  if (gradeLevel <= 8) return 'Academic vocabulary with content-specific terms';
  return 'Advanced academic and specialized vocabulary';
}

function getConceptualComplexityLevel(gradeLevel: number): string {
  if (gradeLevel <= 2) return 'Single concepts with concrete examples';
  if (gradeLevel <= 5) return 'Multiple related concepts with some abstraction';
  if (gradeLevel <= 8) return 'Complex relationships and abstract thinking';
  return 'Highly abstract and interconnected concepts';
}

function normalizeSubjectName(subject: string): string {
  const subjectMap: { [key: string]: string } = {
    'english': 'english',
    'english_reading': 'english',
    'reading': 'english',
    'mathematics': 'mathematics',
    'math': 'mathematics',
    'maths': 'mathematics',
    'creative_writing': 'creative_writing',
    'creative': 'creative_writing',
    'writing': 'creative_writing',
    'science': 'science',
    'science_discovery': 'science',
    'discovery': 'science'
  };

  const normalized = subjectMap[subject.toLowerCase()] ||`

