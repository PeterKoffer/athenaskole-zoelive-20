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
  theme: 'adventure' | 'mystery' | 'space' | 'underwater' | 'fantasy' | 'detective' | 'time-travel';
  storyContext: string;
  missionObjectives: string[];
  openingHook: string;
  characterGuide?: string;
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
  gameActivities: Array<{
    type: 'adventure-game' | 'puzzle-quest' | 'creative-builder' | 'exploration-sim';
    title: string;
    scenario: string;
    mechanics: string;
    winCondition: string;
    rewards: string[];
  }>;
  creativeElements: Array<{
    type: 'draw' | 'build' | 'story' | 'design' | 'compose';
    prompt: string;
    tools: string[];
    shareOpportunity: boolean;
  }>;
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

    ...config.discoverySegments.map((segment, index) => ({
      id: `${config.subject}-discovery-${index + 1}`,
      type: 'content-delivery' as const,
      phase: 'content-delivery' as const,
      title: `🔍 ${segment.title}`,
      duration: Math.floor(480 / config.discoverySegments.length),
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
    totalDuration: 1200,
    phases: activities,
    activities,
    estimatedDuration: 1200,
    objectives: config.missionObjectives,
    learningObjectives: config.missionObjectives,
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
  
  if (lesson.phases.some(p => p.content.title || p.content.hook)) {
    score += 25;
  } else {
    improvements.push('Add engaging story theme');
  }
  
  const interactiveCount = lesson.phases.filter(p => 
    p.type === 'interactive-game' || p.content.question
  ).length;
  
  if (interactiveCount >= 3) score += 25;
  else improvements.push('Add more interactive elements');
  
  if (lesson.phases.some(p => p.phase === 'creative-exploration')) {
    score += 25;
  } else {
    improvements.push('Include creative expression activities');
  }
  
  if (lesson.phases.some(p => p.content.achievementsList || p.content.keyTakeaways)) {
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
