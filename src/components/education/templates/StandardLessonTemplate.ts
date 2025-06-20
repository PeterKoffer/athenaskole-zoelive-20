
import { LessonActivity, SubjectLessonPlan } from '../components/types/LessonTypes';

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
        text: config.storyContext,
        title: config.characterGuide || 'Your Guide'
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
        segments: [{
          title: segment.title,
          concept: segment.concept,
          explanation: segment.interactiveExplanation
        }],
        question: segment.quickChallenge.instruction,
        options: segment.quickChallenge.options,
        correctAnswer: Array.isArray(segment.quickChallenge.correctAnswer) 
          ? segment.quickChallenge.correctAnswer[0] 
          : segment.quickChallenge.correctAnswer,
        explanation: segment.quickChallenge.celebration
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
        scenario: config.gameActivities[0]?.scenario || 'Epic game scenario',
        question: config.gameActivities[0]?.winCondition || 'Complete the challenge!',
        text: config.gameActivities[0]?.mechanics || 'Game mechanics',
        options: config.gameActivities[0]?.rewards || ['Great job!', 'Excellent!', 'Amazing!', 'Fantastic!'],
        correctAnswer: 0
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
        creativePrompt: config.creativeElements[0]?.prompt || 'Create something amazing!',
        text: config.creativeElements[0]?.tools?.join(', ') || 'Creative tools available'
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
        keyTakeaways: config.missionObjectives,
        achievementsList: config.missionObjectives,
        text: config.grandChallenge.celebration
      }
    }
  ];

  return {
    subject: config.subject,
    skillArea: config.skillArea,
    gradeLevel: config.gradeLevel,
    estimatedDuration: 1200, // 20 minutes
    objectives: config.missionObjectives,
    activities,
    difficulty: config.gradeLevel <= 3 ? 1 : config.gradeLevel <= 6 ? 2 : config.gradeLevel <= 9 ? 3 : 4,
    prerequisites: [],
    assessmentCriteria: ['Understanding of concepts', 'Application of knowledge'],
    extensions: ['Practice exercises']
  };
}

/**
 * Pre-built engaging themes for quick lesson creation
 */
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

/**
 * Quality checker to ensure lessons meet engagement standards
 */
export function validateEngagingLesson(lesson: SubjectLessonPlan): {
  qualityScore: number;
  engagementLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'MAXIMUM';
  improvements: string[];
  isReadyForStudents: boolean;
} {
  let score = 0;
  const improvements: string[] = [];
  
  // Check for story/theme integration
  if (lesson.activities.some(p => p.content.title || p.content.hook)) {
    score += 25;
  } else {
    improvements.push('Add engaging story theme');
  }
  
  // Check for interactive elements
  const interactiveCount = lesson.activities.filter(p => 
    p.type === 'interactive-game' || p.content.question
  ).length;
  
  if (interactiveCount >= 3) score += 25;
  else improvements.push('Add more interactive elements');
  
  // Check for creative opportunities  
  if (lesson.activities.some(p => p.phase === 'creative-exploration')) {
    score += 25;
  } else {
    improvements.push('Include creative expression activities');
  }
  
  // Check for celebration/rewards
  if (lesson.activities.some(p => p.content.achievementsList || p.content.keyTakeaways)) {
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
