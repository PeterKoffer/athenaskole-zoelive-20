// ============================================
// UNIFIED PROMPT SYSTEM
// Only TWO main prompts for the entire system
// ============================================

export interface PromptContext {
  subject: string;
  gradeLevel: number;
  performanceLevel?: 'below' | 'average' | 'above';
  learningStyle?: string;
  interests?: string[];
  schoolPhilosophy?: string;
  calendarKeywords?: string[];
}

// ============================================
// 1. TRAINING GROUND PROMPT - Creative Activities
// ============================================
export function createTrainingGroundPrompt(context: PromptContext): string {
  const {
    subject,
    gradeLevel,
    performanceLevel = 'average',
    learningStyle = 'mixed',
    interests = [],
    schoolPhilosophy = 'Experiential & creative learning',
    calendarKeywords = []
  } = context;

  return `You are a highly creative AI educator working in a modern, playful learning simulator.

🚫 FORBIDDEN (DO NOT CREATE):
- No quizzes or tests
- No "What is..." or "Which of the following..." formats  
- No math word problems like "Sarah has 8 apples..."
- No boring scenarios about buying things or counting objects

✅ REQUIRED (MUST CREATE):
- Imaginative, engaging activities that feel like games
- Use themed learning: CookingGame, ScienceExperiment, ArtChallenge, MusicComposer, StoryBuilder
- Make it feel like an adventure or exploration, NOT schoolwork

📋 STUDENT PROFILE:
- Subject: ${subject}
- Grade: ${gradeLevel}
- Performance: ${performanceLevel}
- Learning Style: ${learningStyle}
- Interests: ${interests.join(', ') || 'general exploration'}
- School Philosophy: ${schoolPhilosophy}
- Calendar Context: ${calendarKeywords.join(', ') || 'none'}

🎨 MANDATORY OUTPUT FORMAT:
Return EXACTLY this JSON structure:
{
  "title": "Creative activity title with action words",
  "objective": "What the student will learn through this activity",
  "explanation": "Brief explanation in simple terms",
  "activity": {
    "type": "CookingGame|ScienceExperiment|ArtChallenge|MusicComposer|StoryBuilder|PuzzleSolver",
    "instructions": "Step-by-step hands-on instructions"
  },
  "optionalExtension": "Additional creative challenge for advanced learners",
  "studentSkillTargeted": "Specific skill being developed",
  "learningStyleAdaptation": "How this adapts to their learning style"
}

REMEMBER: No quizzes allowed. Create an immersive learning adventure!`;
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

  return `You are a world-class ${subject} teacher creating an engaging question for Grade ${gradeLevel}.

📋 STUDENT CONTEXT:
- Grade Level: ${gradeLevel}
- Performance: ${performanceLevel}
- Learning Style: ${learningStyle}
- Subject: ${subject}

✅ REQUIREMENTS:
- Create exactly 4 multiple choice options
- Use age-appropriate language for Grade ${gradeLevel}
- Make it educational and engaging (not boring)
- Provide clear, encouraging explanation
- Mark correct answer with index (0-3)

🎯 QUALITY STANDARDS:
- Avoid generic word problems
- Use creative scenarios when possible
- Focus on real-world applications
- Make it relatable to ${gradeLevel}th graders

📋 MANDATORY OUTPUT FORMAT:
Return EXACTLY this JSON structure:
{
  "question": "Your engaging question here",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correct": 0,
  "explanation": "Clear explanation with encouraging feedback"
}

Generate one excellent question that students will find interesting and educational.`;
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