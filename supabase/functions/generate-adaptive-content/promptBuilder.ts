
export interface PromptConfig {
  subject: string;
  skillArea: string;
  difficultyLevel: number;
  previousQuestions: string[];
  diversityPrompt?: string;
  sessionId?: number;
  gradeLevel?: number;
  standardsAlignment?: any;
}

export function createGradeAlignedPrompt(config: PromptConfig): string {
  console.log('🎯 Creating prompt for subject:', config.subject, 'skillArea:', config.skillArea);
  
  let prompt = '';
  
  // Map subject names to ensure proper handling
  const normalizedSubject = normalizeSubjectName(config.subject);
  console.log('🔄 Normalized subject from', config.subject, 'to', normalizedSubject);
  
  // Generate subject-specific prompts
  if (normalizedSubject === 'english') {
    prompt = createEnglishPrompt();
  } else if (normalizedSubject === 'mathematics') {
    prompt = createMathematicsPrompt(config.skillArea, config.difficultyLevel);
  } else if (normalizedSubject === 'creative_writing') {
    prompt = createCreativeWritingPrompt();
  } else if (normalizedSubject === 'science') {
    prompt = createSciencePrompt();
  } else {
    // This should never happen now with proper subject normalization
    console.error('⚠️ Unknown subject after normalization:', normalizedSubject, 'original:', config.subject);
    throw new Error(`Unsupported subject: ${config.subject}. Supported subjects are: english, mathematics, creative_writing, science`);
  }

  if (config.previousQuestions.length > 0) {
    prompt += `\n\nIMPORTANT: Do NOT generate any of these previous questions:\n${config.previousQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}

Create a completely different ${normalizedSubject} question that hasn't been asked before.`;
  }

  console.log('📝 Final prompt created for:', normalizedSubject);
  return prompt;
}

function normalizeSubjectName(subject: string): string {
  // Handle different variations of subject names
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
  return `Generate an English reading comprehension question suitable for elementary students.

Return ONLY a valid JSON object with this exact structure:
{
  "question": "Read this sentence: 'The cat sat on the mat.' What did the cat do?",
  "options": ["ran", "jumped", "sat", "flew"],
  "correct": 2,
  "explanation": "The sentence clearly states 'The cat sat on the mat', so the correct answer is 'sat'.",
  "learningObjectives": ["Reading comprehension", "Verb identification"],
  "estimatedTime": 30
}

Make sure:
- The question focuses on reading comprehension, vocabulary, or grammar
- There are exactly 4 options
- The "correct" field is the index (0, 1, 2, or 3) of the correct answer
- The explanation clearly shows the reasoning
- Return ONLY the JSON, no markdown formatting or code blocks`;
}

function createMathematicsPrompt(skillArea: string, difficultyLevel: number): string {
  return `Generate a mathematics question about ${skillArea} suitable for elementary students (difficulty level ${difficultyLevel}).

Return ONLY a valid JSON object with this exact structure:
{
  "question": "What is 1/2 + 1/4?",
  "options": ["1/6", "2/6", "3/4", "3/6"],
  "correct": 2,
  "explanation": "To add fractions, find a common denominator. 1/2 = 2/4, so 2/4 + 1/4 = 3/4",
  "learningObjectives": ["Adding fractions with different denominators", "Finding common denominators"],
  "estimatedTime": 30
}

Make sure:
- The question is about mathematics (arithmetic, fractions, geometry, etc.)
- There are exactly 4 options
- The "correct" field is the index (0, 1, 2, or 3) of the correct answer
- The explanation clearly shows how to solve the problem
- Return ONLY the JSON, no markdown formatting or code blocks`;
}

function createCreativeWritingPrompt(): string {
  return `Generate a creative writing exercise suitable for elementary students.

Return ONLY a valid JSON object with this exact structure:
{
  "question": "Complete this story starter: 'Once upon a time, in a magical forest, there lived a small dragon who...'",
  "options": ["could not fly", "loved to sing", "was afraid of fire", "collected shiny rocks"],
  "correct": 1,
  "explanation": "Any of these options could work creatively, but 'loved to sing' creates an interesting contrast and story opportunity.",
  "learningObjectives": ["Creative thinking", "Story development", "Character creation"],
  "estimatedTime": 30
}

Make sure:
- The question encourages creativity and imagination
- There are exactly 4 options
- The "correct" field is the index (0, 1, 2, or 3) of the most interesting creative choice
- The explanation shows why this choice works well for storytelling
- Return ONLY the JSON, no markdown formatting or code blocks`;
}

function createSciencePrompt(): string {
  return `Generate a science discovery question suitable for elementary students.

Return ONLY a valid JSON object with this exact structure:
{
  "question": "What happens when you mix baking soda and vinegar?",
  "options": ["Nothing happens", "It gets hot", "It fizzes and bubbles", "It changes color"],
  "correct": 2,
  "explanation": "When baking soda (a base) mixes with vinegar (an acid), they react to create carbon dioxide gas, which causes fizzing and bubbling.",
  "learningObjectives": ["Chemical reactions", "Acids and bases", "Observation skills"],
  "estimatedTime": 30
}

Make sure:
- The question focuses on scientific concepts, experiments, or natural phenomena
- There are exactly 4 options
- The "correct" field is the index (0, 1, 2, or 3) of the correct answer
- The explanation includes the scientific reasoning
- Return ONLY the JSON, no markdown formatting or code blocks`;
}
