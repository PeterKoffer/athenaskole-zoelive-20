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

  return `You are a world-class ${subject} teacher creating a lesson for a Grade ${gradeLevel} student. Develop a lesson aligned with ${curriculumStandards} and incorporate the school's ${finalTeachingPerspective} approach. The lesson should be designed for about ${lessonDuration} minutes of learning. Since ${subject} is a ${subjectWeight} priority subject in our curriculum, adjust the depth accordingly. ${calendarKeywords.length > 0 ? `Consider the context of ${calendarKeywords.join(', ')} over the next ${calendarDuration} in the lesson content.` : ''} Tailor the material to the student's skill level – ${finalStudentAbilities}, providing support or extension as needed. Use a ${learningStyle} approach and connect to the student's interest in ${finalStudentInterests.join(', ')} to make the lesson engaging. Include interactive activities or a game, and end with a brief quiz or test to assess understanding.

🚫 FORBIDDEN (DO NOT CREATE):
- No traditional quizzes or tests as the main activity
- No "What is..." or "Which of the following..." formats as primary content
- No boring word problems like "Sarah has 8 apples..."
- No generic scenarios about buying things or counting objects

✅ REQUIRED (MUST CREATE):
- Imaginative, engaging activities that feel like games
- Use themed learning: CookingGame, ScienceExperiment, ArtChallenge, MusicComposer, StoryBuilder, PuzzleSolver
- Make it feel like an adventure or exploration, NOT traditional schoolwork
- Include at least one interactive activity and a brief assessment element

🎨 MANDATORY OUTPUT FORMAT:
Return EXACTLY this JSON structure:
{
  "title": "Creative activity title with action words",
  "objective": "What the student will learn through this activity",
  "explanation": "Brief explanation in simple terms for Grade ${gradeLevel}",
  "activity": {
    "type": "CookingGame|ScienceExperiment|ArtChallenge|MusicComposer|StoryBuilder|PuzzleSolver",
    "instructions": "Step-by-step hands-on instructions adapted for ${learningStyle} learners"
  },
  "optionalExtension": "Additional creative challenge for advanced learners",
  "studentSkillTargeted": "Specific ${subject} skill being developed",
  "learningStyleAdaptation": "How this specifically adapts to ${learningStyle} learning preferences",
  "assessmentElement": "Brief interactive way to check understanding (not a traditional quiz)"
}

REMEMBER: Create an immersive learning adventure that incorporates all the contextual parameters provided!`;
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