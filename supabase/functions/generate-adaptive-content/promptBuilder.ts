
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
  console.log('🎯 Creating ENHANCED UNIQUE prompt for subject:', config.subject, 'skillArea:', config.skillArea);
  
  let prompt = '';
  
  const normalizedSubject = normalizeSubjectName(config.subject);
  console.log('🔄 Normalized subject from', config.subject, 'to', normalizedSubject);
  
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

  // Enhanced uniqueness requirements with stronger prevention
  if (config.previousQuestions.length > 0) {
    const recentQuestions = config.previousQuestions.slice(-25);
    const timestamp = Date.now();
    
    prompt += `\n\nCRITICAL UNIQUENESS REQUIREMENTS (Session ${config.sessionId || timestamp}):

🚫 ABSOLUTELY FORBIDDEN - NEVER generate these exact or similar questions:
${recentQuestions.map((q, i) => `${i + 1}. ${q.substring(0, 200)}...`).join('\n')}

✅ MANDATORY UNIQUENESS RULES:
1. Use COMPLETELY different numbers, names, scenarios, and contexts
2. Create ORIGINAL word problems with unique characters and settings  
3. Vary the mathematical operations and problem approaches
4. Use different real-world applications and examples
5. Ensure the question format and structure is fresh and engaging
6. Make it age-appropriate and educationally valuable
7. Use unique mathematical combinations and story elements
8. Avoid any similarity to previously used questions
9. Generate creative scenarios that haven't been used before
10. Ensure educational value while maintaining uniqueness

UNIQUENESS VERIFICATION:
- Question must be 100% original and different from all previous questions
- Use unique numerical values, character names, and story contexts
- Ensure no conceptual overlap with recent questions
- Create fresh educational scenarios

Timestamp: ${timestamp}
Session ID: ${config.sessionId || 'unknown'}
Force Unique: ${config.forceUnique ? 'TRUE' : 'FALSE'}
Previous Questions Count: ${config.previousQuestions.length}

${config.uniquenessInstructions || 'Generate completely original content that has never been used before.'}`;
  }

  if (config.diversityPrompt) {
    prompt += `\n\nDIVERSITY INSTRUCTION: ${config.diversityPrompt}`;
  }

  console.log('📝 Final ENHANCED UNIQUE prompt created for:', normalizedSubject);
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
  const uniqueTimestamp = Date.now();
  return `Generate a COMPLETELY UNIQUE English reading comprehension question suitable for elementary students.

CRITICAL UNIQUENESS REQUIREMENTS:
- Use 100% original sentences and scenarios never used before
- Create fresh vocabulary and grammar exercises with unique content
- Vary reading comprehension approaches and contexts significantly
- Use creative characters, settings, and situations that are completely new
- Ensure no similarity to any previous English questions
- Generate unique story elements and educational content

TIMESTAMP: ${uniqueTimestamp}

Return ONLY a valid JSON object with this exact structure:
{
  "question": "Read this COMPLETELY NEW sentence: 'The clever scientist discovered a hidden rainbow beneath the frozen waterfall.' What did the scientist find?",
  "options": ["rainbow", "waterfall", "scientist", "ice"],
  "correct": 0,
  "explanation": "The sentence clearly states 'The clever scientist discovered a hidden rainbow beneath the frozen waterfall', so the correct answer is 'rainbow'.",
  "learningObjectives": ["Reading comprehension", "Detail identification", "Story understanding"],
  "estimatedTime": 30
}

Make sure:
- The question uses COMPLETELY original content and scenarios never used before
- Focus on reading comprehension, vocabulary, or grammar with 100% fresh examples
- There are exactly 4 unique options that haven't been used before
- The "correct" field is the index (0, 1, 2, or 3) of the correct answer
- The explanation clearly shows the reasoning with unique content
- Return ONLY the JSON, no markdown formatting or code blocks`;
}

function createMathematicsPrompt(skillArea: string, difficultyLevel: number): string {
  const uniqueTimestamp = Date.now();
  return `Generate a COMPLETELY UNIQUE mathematics question about ${skillArea} suitable for elementary students (difficulty level ${difficultyLevel}).

CRITICAL UNIQUENESS REQUIREMENTS:
- Use 100% ORIGINAL numbers, scenarios, and contexts never used before
- Create completely fresh word problems with unique characters and settings
- Vary mathematical operations and problem types significantly  
- Use creative real-world applications and examples that are completely new
- Ensure engaging and age-appropriate content that's never been generated
- Generate unique numerical combinations and story contexts
- Avoid any mathematical scenarios that have been used previously

TIMESTAMP: ${uniqueTimestamp}

Return ONLY a valid JSON object with this exact structure:
{
  "question": "At the mystical garden, Botanist Aria planted 37 magical flower seeds. After the first moon, 19 seeds sprouted. After the second moon, 12 more seeds sprouted. How many seeds have sprouted in total?",
  "options": ["29", "31", "33", "35"],
  "correct": 1,
  "explanation": "Aria had 19 seeds sprout after the first moon and 12 more after the second moon. So 19 + 12 = 31 seeds sprouted in total.",
  "learningObjectives": ["Multi-step addition", "Sequential problem solving", "Word problem comprehension"],
  "estimatedTime": 30
}

Make sure:
- The question uses COMPLETELY original scenarios, numbers, and contexts never used before
- Focus on mathematics with 100% fresh, creative examples and unique numerical values
- There are exactly 4 unique options with numbers that haven't been used in this combination
- The "correct" field is the index (0, 1, 2, or 3) of the correct answer
- The explanation clearly shows how to solve the problem step by step with unique content
- Return ONLY the JSON, no markdown formatting or code blocks`;
}

function createCreativeWritingPrompt(): string {
  const uniqueTimestamp = Date.now();
  return `Generate a COMPLETELY UNIQUE creative writing exercise suitable for elementary students.

CRITICAL UNIQUENESS REQUIREMENTS:
- Use 100% original story starters and scenarios never used before
- Create completely fresh creative prompts with unique characters and settings
- Vary creative writing approaches and imagination exercises significantly
- Use engaging and inspiring content that sparks creativity with new concepts
- Generate unique creative scenarios that haven't been explored before

TIMESTAMP: ${uniqueTimestamp}

Return ONLY a valid JSON object with this exact structure:
{
  "question": "Complete this COMPLETELY ORIGINAL story starter: 'In the crystal caves beneath the singing mountains, young archaeologist Kai discovered a telescope that could...'",
  "options": ["see into people's dreams", "reveal hidden treasure maps", "show the future of plants", "translate animal thoughts"],
  "correct": 2,
  "explanation": "Any of these options could work creatively, but 'show the future of plants' creates unique storytelling possibilities and connects science with imagination in an original way.",
  "learningObjectives": ["Creative thinking", "Story development", "Character creation", "Imaginative writing"],
  "estimatedTime": 30
}

Make sure:
- The question uses COMPLETELY original creative scenarios and prompts never used before
- Encourages creativity and imagination with 100% fresh examples and concepts
- There are exactly 4 unique creative options that haven't been explored before
- The "correct" field is the index (0, 1, 2, or 3) of the most interesting creative choice
- The explanation shows why this choice works well for storytelling with unique reasoning
- Return ONLY the JSON, no markdown formatting or code blocks`;
}

function createSciencePrompt(): string {
  const uniqueTimestamp = Date.now();
  return `Generate a COMPLETELY UNIQUE science discovery question suitable for elementary students.

CRITICAL UNIQUENESS REQUIREMENTS:
- Use 100% original scientific scenarios and examples never used before
- Create completely fresh experiments and discovery opportunities
- Vary scientific concepts and exploration approaches significantly
- Use engaging real-world applications and creative examples that are completely new
- Generate unique scientific scenarios that haven't been explored before

TIMESTAMP: ${uniqueTimestamp}

Return ONLY a valid JSON object with this exact structure:
{
  "question": "Young scientist Maya notices that her grandmother's wooden spoon stays cool while the metal spoon gets hot when left in soup. Why does this happen?",
  "options": ["Wood is a better heat insulator", "Metal hates hot liquids", "Wood absorbs cold air", "Metal conducts electricity better"],
  "correct": 0,
  "explanation": "Wood is a much better heat insulator than metal, so it doesn't conduct heat as well. This means the wooden spoon stays cooler while the metal spoon conducts heat from the soup and becomes hot.",
  "learningObjectives": ["Heat conduction", "Material properties", "Scientific observation", "Thermal insulation"],
  "estimatedTime": 30
}

Make sure:
- The question uses COMPLETELY original scientific scenarios and examples never used before
- Focus on scientific concepts with 100% fresh, creative examples and unique situations
- There are exactly 4 unique options with scientific concepts that haven't been combined this way
- The "correct" field is the index (0, 1, 2, or 3) of the correct answer
- The explanation includes clear scientific reasoning with original content
- Return ONLY the JSON, no markdown formatting or code blocks`;
}
