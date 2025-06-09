
export interface PromptConfig {
  subject: string;
  skillArea: string;
  difficultyLevel: number;
  previousQuestions: string[];
  diversityPrompt?: string;
  sessionId?: string;
  gradeLevel?: number;
  standardsAlignment?: any;
  uniquenessInstructions?: string;
  forceUnique?: boolean;
}

export function createGradeAlignedPrompt(config: PromptConfig): string {
  console.log('🎯 Creating UNIQUE prompt for subject:', config.subject, 'skillArea:', config.skillArea);
  
  let prompt = '';
  
  const normalizedSubject = normalizeSubjectName(config.subject);
  console.log('🔄 Normalized subject from', config.subject, 'to', normalizedSubject);
  
  // Generate subject-specific prompts with uniqueness emphasis
  if (normalizedSubject === 'english') {
    prompt = createEnglishPrompt();
  } else if (normalizedSubject === 'mathematics') {
    prompt = createMathematicsPrompt(config.skillArea, config.difficultyLevel);
  } else if (normalizedSubject === 'creative_writing') {
    prompt = createCreativeWritingPrompt();
  } else if (normalizedSubject === 'science') {
    prompt = createSciencePrompt();
  } else {
    console.error('⚠️ Unknown subject after normalization:', normalizedSubject, 'original:', config.subject);
    throw new Error(`Unsupported subject: ${config.subject}. Supported subjects are: english, mathematics, creative_writing, science`);
  }

  // Add strong uniqueness requirements
  if (config.previousQuestions.length > 0) {
    prompt += `\n\nCRITICAL UNIQUENESS REQUIREMENTS:

NEVER generate any of these previous questions:
${config.previousQuestions.slice(-20).map((q, i) => `${i + 1}. ${q.substring(0, 150)}...`).join('\n')}

MANDATORY UNIQUENESS RULES:
1. Use COMPLETELY different numbers, names, scenarios, and contexts
2. Create ORIGINAL word problems with unique characters and settings
3. Vary the mathematical operations and problem approaches
4. Use different real-world applications and examples  
5. Ensure the question format and structure is fresh and engaging
6. Make it age-appropriate and educationally valuable

Session ID: ${config.sessionId || 'unknown'}
Force Unique: ${config.forceUnique ? 'TRUE' : 'FALSE'}

${config.uniquenessInstructions || ''}`;
  }

  // Add diversity prompt if provided
  if (config.diversityPrompt) {
    prompt += `\n\nDIVERSITY INSTRUCTION: ${config.diversityPrompt}`;
  }

  console.log('📝 Final UNIQUE prompt created for:', normalizedSubject);
  return prompt;
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

  const normalized = subjectMap[subject.toLowerCase()] || subject.toLowerCase();
  console.log('🔍 Subject mapping:', subject, '->', normalized);
  return normalized;
}

function createEnglishPrompt(): string {
  return `Generate a UNIQUE English reading comprehension question suitable for elementary students.

UNIQUENESS REQUIREMENTS:
- Use original sentences and scenarios never used before
- Create fresh vocabulary and grammar exercises
- Vary reading comprehension approaches and contexts
- Use creative characters, settings, and situations

Return ONLY a valid JSON object with this exact structure:
{
  "question": "Read this NEW sentence: 'The brave knight rescued the magical dragon from the enchanted tower.' What did the knight do?",
  "options": ["fought", "rescued", "captured", "ignored"],
  "correct": 1,
  "explanation": "The sentence clearly states 'The brave knight rescued the magical dragon', so the correct answer is 'rescued'.",
  "learningObjectives": ["Reading comprehension", "Verb identification", "Story understanding"],
  "estimatedTime": 30
}

Make sure:
- The question uses COMPLETELY original content and scenarios
- Focus on reading comprehension, vocabulary, or grammar with fresh examples
- There are exactly 4 unique options
- The "correct" field is the index (0, 1, 2, or 3) of the correct answer
- The explanation clearly shows the reasoning
- Return ONLY the JSON, no markdown formatting or code blocks`;
}

function createMathematicsPrompt(skillArea: string, difficultyLevel: number): string {
  return `Generate a COMPLETELY UNIQUE mathematics question about ${skillArea} suitable for elementary students (difficulty level ${difficultyLevel}).

UNIQUENESS REQUIREMENTS:
- Use ORIGINAL numbers, scenarios, and contexts never used before
- Create fresh word problems with unique characters and settings
- Vary mathematical operations and problem types  
- Use creative real-world applications and examples
- Ensure engaging and age-appropriate content

Return ONLY a valid JSON object with this exact structure:
{
  "question": "At the magical bakery, Chef Luna made 24 enchanted cupcakes. She gave 8 to the fairy customers and 6 to the dragon visitors. How many cupcakes does she have left?",
  "options": ["8", "10", "12", "14"],
  "correct": 1,
  "explanation": "Chef Luna started with 24 cupcakes. She gave away 8 + 6 = 14 cupcakes. So 24 - 14 = 10 cupcakes remain.",
  "learningObjectives": ["Multi-step subtraction", "Addition within subtraction problems", "Word problem solving"],
  "estimatedTime": 30
}

Make sure:
- The question uses COMPLETELY original scenarios, numbers, and contexts
- Focus on mathematics with fresh, creative examples
- There are exactly 4 unique options
- The "correct" field is the index (0, 1, 2, or 3) of the correct answer
- The explanation clearly shows how to solve the problem step by step
- Return ONLY the JSON, no markdown formatting or code blocks`;
}

function createCreativeWritingPrompt(): string {
  return `Generate a UNIQUE creative writing exercise suitable for elementary students.

UNIQUENESS REQUIREMENTS:
- Use completely original story starters and scenarios
- Create fresh creative prompts with unique characters and settings
- Vary creative writing approaches and imagination exercises
- Use engaging and inspiring content that sparks creativity

Return ONLY a valid JSON object with this exact structure:
{
  "question": "Complete this ORIGINAL story starter: 'In the floating city above the clouds, young inventor Maya discovered a music box that could...'",
  "options": ["make time move backwards", "bring drawings to life", "translate any language", "control the weather"],
  "correct": 1,
  "explanation": "Any of these options could work creatively, but 'bring drawings to life' creates amazing story possibilities and visual imagination opportunities.",
  "learningObjectives": ["Creative thinking", "Story development", "Character creation", "Imaginative writing"],
  "estimatedTime": 30
}

Make sure:
- The question uses COMPLETELY original creative scenarios and prompts
- Encourages creativity and imagination with fresh examples
- There are exactly 4 unique creative options
- The "correct" field is the index (0, 1, 2, or 3) of the most interesting creative choice
- The explanation shows why this choice works well for storytelling
- Return ONLY the JSON, no markdown formatting or code blocks`;
}

function createSciencePrompt(): string {
  return `Generate a UNIQUE science discovery question suitable for elementary students.

UNIQUENESS REQUIREMENTS:
- Use original scientific scenarios and examples never used before
- Create fresh experiments and discovery opportunities
- Vary scientific concepts and exploration approaches
- Use engaging real-world applications and creative examples

Return ONLY a valid JSON object with this exact structure:
{
  "question": "Young scientist Alex notices that ice cubes melt faster on a black plate than on a white plate in the sun. Why does this happen?",
  "options": ["Black absorbs more heat", "White reflects cold", "Ice prefers white surfaces", "The sun likes black better"],
  "correct": 0,
  "explanation": "Black surfaces absorb more heat from sunlight than white surfaces, which reflect most light. This extra heat makes the ice melt faster on the black plate.",
  "learningObjectives": ["Heat absorption", "Color and light interaction", "Scientific observation", "Cause and effect"],
  "estimatedTime": 30
}

Make sure:
- The question uses COMPLETELY original scientific scenarios and examples
- Focus on scientific concepts with fresh, creative examples
- There are exactly 4 unique options
- The "correct" field is the index (0, 1, 2, or 3) of the correct answer
- The explanation includes clear scientific reasoning
- Return ONLY the JSON, no markdown formatting or code blocks`;
}
