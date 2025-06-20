import { LessonActivity, SubjectLessonPlan } from '../types/LessonTypes';

/**
 * ENGAGING 20-MINUTE LESSON STRUCTURE
 * Transform boring lessons into interactive adventures!
 */

export interface EngagingLessonConfig {
  subject: string;
  skillArea: string;
  gradeLevel: number;
  studentName?: string;
  
  // Story/Theme wrapper (makes everything more engaging)
  theme: 'adventure' | 'mystery' | 'space' | 'underwater' | 'fantasy' | 'detective' | 'time-travel';
  storyContext: string; // "You're a detective solving math mysteries!"
  
  // Learning objectives (but disguised as mission objectives)
  missionObjectives: string[];
  
  // Engagement hooks
  openingHook: string;
  characterGuide?: string; // "Detective Numbers will help you!"
  
  // Interactive content segments
  discoverySegments: Array<{
    title: string;
    concept: string;
    interactiveExplanation: string;
    quickChallenge: {
      type: 'drag-drop' | 'click-reveal' | 'mini-puzzle' | 'matching';
      instruction: string;
      options: string[];
      correctAnswer: number | number[];
      celebration: string;
    };
  }>;
  
  // Main game activities (the fun stuff!)
  gameActivities: Array<{
    type: 'adventure-game' | 'puzzle-quest' | 'creative-builder' | 'exploration-sim';
    title: string;
    scenario: string;
    mechanics: string; // How the game works
    winCondition: string;
    rewards: string[];
  }>;
  
  // Creative expression opportunities
  creativeElements: Array<{
    type: 'draw' | 'build' | 'story' | 'design' | 'compose';
    prompt: string;
    tools: string[];
    shareOpportunity: boolean;
  }>;
  
  // Epic finale
  grandChallenge: {
    title: string;
    description: string;
    type: 'boss-battle' | 'final-project' | 'presentation' | 'epic-quest';
    celebration: string;
  };
}

/**
 * Creates an ENGAGING lesson that students actually want to participate in
 */
export function createEngagingLesson(config: EngagingLessonConfig): SubjectLessonPlan {
  const activities: LessonActivity[] = [
    // 1. EPIC OPENING (3 min) - Hook them immediately!
    {
      id: `${config.subject}-epic-opening`,
      type: 'introduction',
      phase: 'introduction',
      title: `🚀 Welcome to ${config.storyContext}`,
      duration: 180,
      phaseDescription: 'Epic adventure begins!',
      metadata: {
        subject: config.subject,
        skillArea: config.skillArea
      },
      content: {
        hook: config.openingHook,
        storyContext: config.storyContext,
        theme: config.theme,
        characterGuide: config.characterGuide,
        missionBriefing: `Your mission: ${config.missionObjectives.join(', ')}`,
        excitementLevel: 'MAXIMUM!'
      }
    },

    // 2. DISCOVERY ADVENTURES (8 min total) - Interactive learning segments
    ...config.discoverySegments.map((segment, index) => ({
      id: `${config.subject}-discovery-${index + 1}`,
      type: 'content-delivery' as const,
      phase: 'content-delivery' as const,
      title: `🔍 ${segment.title}`,
      duration: Math.floor(480 / config.discoverySegments.length), // 8 min total
      phaseDescription: 'Interactive discovery with instant challenges',
      metadata: {
        subject: config.subject,
        skillArea: config.skillArea
      },
      content: {
        concept: segment.concept,
        interactiveExplanation: segment.interactiveExplanation,
        quickChallenge: segment.quickChallenge,
        engagementType: 'discovery-adventure',
        celebrationReady: true,
        segments: [{
          title: segment.title,
          concept: segment.concept,
          explanation: segment.interactiveExplanation,
          checkQuestion: {
            question: segment.quickChallenge.instruction,
            options: segment.quickChallenge.options,
            correctAnswer: typeof segment.quickChallenge.correctAnswer === 'number' ? segment.quickChallenge.correctAnswer : segment.quickChallenge.correctAnswer[0],
            explanation: segment.quickChallenge.celebration
          }
        }]
      }
    })),

    // 3. MAIN GAME EVENT (5 min) - The big fun activity!
    {
      id: `${config.subject}-main-game`,
      type: 'interactive-game',
      phase: 'interactive-game',
      title: `🎮 ${config.gameActivities[0]?.title || 'Epic Challenge'}`,
      duration: 300,
      phaseDescription: 'Major interactive game experience',
      metadata: {
        subject: config.subject,
        skillArea: config.skillArea
      },
      content: {
        question: `Ready for the ${config.gameActivities[0]?.title || 'Epic Challenge'}?`,
        options: ['Let\'s do it!', 'I\'m ready!', 'Bring it on!', 'Game time!'],
        correctAnswer: 0,
        explanation: config.gameActivities[0]?.rewards?.[0] || 'Amazing job!',
        gameType: config.gameActivities[0]?.type || 'adventure-game',
        scenario: config.gameActivities[0]?.scenario,
        mechanics: config.gameActivities[0]?.mechanics,
        winCondition: config.gameActivities[0]?.winCondition,
        rewards: config.gameActivities[0]?.rewards,
        epicnessLevel: 'LEGENDARY'
      }
    },

    // 4. CREATIVE EXPRESSION (3 min) - Let them create!
    {
      id: `${config.subject}-creative-time`,
      type: 'creative-exploration',
      phase: 'creative-exploration',
      title: `🎨 Create Your ${config.creativeElements[0]?.type || 'Masterpiece'}`,
      duration: 180,
      phaseDescription: 'Express learning through creativity',
      metadata: {
        subject: config.subject,
        skillArea: config.skillArea
      },
      content: {
        creativeType: config.creativeElements[0]?.type,
        creativePrompt: config.creativeElements[0]?.prompt,
        whatIfScenario: `What if you could ${config.creativeElements[0]?.prompt}`,
        explorationTask: `Create using: ${config.creativeElements[0]?.tools?.join(', ')}`,
        text: config.creativeElements[0]?.prompt,
        tools: config.creativeElements[0]?.tools,
        shareOpportunity: config.creativeElements[0]?.shareOpportunity,
        inspirationBoost: 'You are AMAZING at this!'
      }
    },

    // 5. GRAND FINALE (1 min) - Epic celebration!
    {
      id: `${config.subject}-grand-finale`,
      type: 'summary',
      phase: 'summary',
      title: `🏆 ${config.grandChallenge.title}`,
      duration: 60,
      phaseDescription: 'Celebrate achievements and set up next adventure',
      metadata: {
        subject: config.subject,
        skillArea: config.skillArea
      },
      content: {
        grandChallenge: config.grandChallenge,
        achievementsList: config.missionObjectives,
        celebration: config.grandChallenge.celebration,
        nextTopicSuggestion: 'Your next mission awaits...',
        text: config.grandChallenge.description,
        keyTakeaways: config.missionObjectives,
        heroStatus: 'ACHIEVED!'
      }
    }
  ];

  return {
    subject: config.subject,
    skillArea: config.skillArea,
    totalDuration: 1200, // 20 minutes
    phases: activities,
    learningObjectives: config.missionObjectives,
    prerequisites: [],
    engagementLevel: 'MAXIMUM',
    funFactor: '🚀🎮🎨🏆'
  };
}

export const ENGAGING_THEMES = {
  mathDetective: {
    theme: 'detective' as const,
    storyContext: "Math Detective Academy - Solve numerical mysteries!",
    characterGuide: "Detective Numbers",
    openingHook: "A mathematical mystery needs solving! Are you ready, Detective?",
    celebrationStyle: "Case closed! Mystery solved!"
  },
  
  spaceExplorer: {
    theme: 'space' as const,
    storyContext: "Galactic Space Academy - Explore the universe through learning!",
    characterGuide: "Captain Cosmos",
    openingHook: "Mission Control to Space Cadet! Ready for an interstellar adventure?",
    celebrationStyle: "Mission accomplished, Space Hero!"
  },
  
  timeAdventurer: {
    theme: 'time-travel' as const,
    storyContext: "Time Academy - Journey through history while learning!",
    characterGuide: "Professor Timekeeper",
    openingHook: "The Time Machine is ready! Which era shall we explore today?",
    celebrationStyle: "Time mission complete! History hero status achieved!"
  },
  
  mysticalQuest: {
    theme: 'fantasy' as const,
    storyContext: "Enchanted Learning Realm - Magic happens when you learn!",
    characterGuide: "Wizard Wisdombeard",
    openingHook: "Welcome to the magical realm where knowledge becomes power!",
    celebrationStyle: "Quest completed! You've earned your wisdom crystals!"
  }
};

export function validateEngagingLesson(lesson: SubjectLessonPlan): {
  qualityScore: number;
  engagementLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'MAXIMUM';
  improvements: string[];
  isReadyForStudents: boolean;
} {
  let score = 0;
  const improvements: string[] = [];
  
  // Check for story/theme integration
  if (lesson.phases.some(p => p.content.theme || p.content.storyContext)) {
    score += 25;
  } else {
    improvements.push('Add engaging story theme');
  }
  
  // Check for interactive elements
  const interactiveCount = lesson.phases.filter(p => 
    p.type === 'interactive-game' || p.content.quickChallenge
  ).length;
  
  if (interactiveCount >= 3) score += 25;
  else improvements.push('Add more interactive elements');
  
  // Check for creative opportunities  
  if (lesson.phases.some(p => p.phase === 'creative-exploration')) {
    score += 25;
  } else {
    improvements.push('Include creative expression activities');
  }
  
  // Check for celebration/rewards
  if (lesson.phases.some(p => p.content.celebration || p.content.rewards)) {
    score += 25;
  } else {
    improvements.push('Add celebrations and rewards');
  }
  
  const engagementLevel = score >= 90 ? 'MAXIMUM' : 
                         score >= 70 ? 'HIGH' : 
                         score >= 50 ? 'MEDIUM' : 'LOW';
  
  return {
    qualityScore: score,
    engagementLevel,
    improvements,
    isReadyForStudents: score >= 70
  };
}

export interface StandardLessonConfig {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateStandardLesson(lesson: SubjectLessonPlan): StandardLessonConfig {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check total duration (should be ~20 minutes = 1200 seconds)
  if (lesson.totalDuration < 1000 || lesson.totalDuration > 1400) {
    errors.push(`Total duration ${lesson.totalDuration}s is outside target range (1000-1400s)`);
  }
  
  // Check required phases
  const requiredPhases = ['introduction', 'content-delivery', 'interactive-game', 'application', 'creative-exploration', 'summary'];
  const lessonPhases = lesson.phases.map(p => p.phase);
  
  for (const required of requiredPhases) {
    if (!lessonPhases.includes(required)) {
      errors.push(`Missing required phase: ${required}`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}
