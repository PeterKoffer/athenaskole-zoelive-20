
import { LessonActivity } from '../components/types/LessonTypes';

export interface EngagingActivityConfig {
  subject: string;
  skillArea: string;
  activityType: 'game' | 'challenge' | 'exploration' | 'simulation';
  duration: number;
  gradeLevel: number;
}

export const createEngagingActivity = (config: EngagingActivityConfig): LessonActivity => {
  const { subject, skillArea, activityType, duration, gradeLevel } = config;
  const activityId = `engaging_${activityType}_${Date.now()}`;

  switch (activityType) {
    case 'game':
      return createGameActivity(activityId, subject, skillArea, duration, gradeLevel);
    case 'challenge':
      return createChallengeActivity(activityId, subject, skillArea, duration, gradeLevel);
    case 'exploration':
      return createExplorationActivity(activityId, subject, skillArea, duration, gradeLevel);
    case 'simulation':
      return createSimulationActivity(activityId, subject, skillArea, duration, gradeLevel);
    default:
      return createGameActivity(activityId, subject, skillArea, duration, gradeLevel);
  }
};

const createGameActivity = (
  id: string,
  subject: string,
  skillArea: string,
  duration: number,
  gradeLevel: number
): LessonActivity => {
  return {
    id,
    type: 'interactive-game',
    phase: 'interactive-game',
    title: `${skillArea} Adventure Game`,
    duration,
    phaseDescription: `Interactive ${skillArea} game experience`,
    metadata: {
      subject,
      skillArea,
      gradeLevel,
      activityType: 'game'
    },
    content: {
      question: `Ready to play the ${skillArea} adventure game?`,
      options: ['Start Adventure!', 'Learn Rules First', 'Choose Difficulty', 'Practice Mode'],
      correctAnswer: 0,
      explanation: 'Great choice! Let\'s begin your adventure!',
      gameElements: {
        theme: `${skillArea} Adventure`,
        points: 0,
        level: 1,
        challenges: [`Master ${skillArea} basics`, `Apply ${skillArea} skills`, `Solve complex problems`]
      }
    }
  };
};

const createChallengeActivity = (
  id: string,
  subject: string,
  skillArea: string,
  duration: number,
  gradeLevel: number
): LessonActivity => {
  return {
    id,
    type: 'interactive-game',
    phase: 'interactive-game',
    title: `${skillArea} Challenge`,
    duration,
    phaseDescription: `Challenging ${skillArea} problem-solving activity`,
    metadata: {
      subject,
      skillArea,
      gradeLevel,
      activityType: 'challenge'
    },
    content: {
      question: `Are you ready for the ultimate ${skillArea} challenge?`,
      options: ['Bring it on!', 'I need hints', 'Start easy', 'Show examples'],
      correctAnswer: 0,
      explanation: 'Excellent! Your confidence will help you succeed!',
      challengeElements: {
        difficulty: gradeLevel <= 3 ? 'Easy' : gradeLevel <= 6 ? 'Medium' : 'Hard',
        timeLimit: duration,
        hints: [
          `Think about ${skillArea} fundamentals`,
          `Break the problem into smaller parts`,
          `Remember what you learned earlier`
        ]
      }
    }
  };
};

const createExplorationActivity = (
  id: string,
  subject: string,
  skillArea: string,
  duration: number,
  gradeLevel: number
): LessonActivity => {
  return {
    id,
    type: 'creative-exploration',
    phase: 'creative-exploration',
    title: `Explore ${skillArea}`,
    duration,
    phaseDescription: `Creative exploration of ${skillArea} concepts`,
    metadata: {
      subject,
      skillArea,
      gradeLevel,
      activityType: 'exploration'
    },
    content: {
      creativePrompt: `Let's explore the fascinating world of ${skillArea}! What discoveries can you make?`,
      explorationTask: `Investigate how ${skillArea} works in different situations`,
      whatIfScenario: `What if ${skillArea} worked differently? How would that change things?`,
      explorationElements: {
        discoveryPoints: ['Observation', 'Experimentation', 'Analysis', 'Conclusion'],
        tools: ['Virtual tools', 'Interactive models', 'Guided questions'],
        outcomes: [`Understand ${skillArea} better`, `See real-world applications`, `Make connections`]
      }
    }
  };
};

const createSimulationActivity = (
  id: string,
  subject: string,
  skillArea: string,
  duration: number,
  gradeLevel: number
): LessonActivity => {
  return {
    id,
    type: 'simulation',
    phase: 'application',
    title: `${skillArea} Simulation`,
    duration,
    phaseDescription: `Realistic simulation of ${skillArea} applications`,
    metadata: {
      subject,
      skillArea,
      gradeLevel,
      activityType: 'simulation'
    },
    content: {
      scenario: `You're in a realistic situation where you need to use ${skillArea}`,
      task: `Apply your ${skillArea} knowledge to solve real-world problems`,
      simulationElements: {
        environment: `Realistic ${skillArea} setting`,
        tools: ['Professional tools', 'Real data', 'Authentic challenges'],
        objectives: [`Complete the simulation`, `Apply knowledge correctly`, `Learn from experience`],
        feedback: 'Real-time feedback on your decisions'
      }
    }
  };
};

export const createEngagingQuiz = (
  subject: string,
  skillArea: string,
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }>,
  gradeLevel: number = 6
): LessonActivity => {
  const quizId = `engaging_quiz_${Date.now()}`;

  return {
    id: quizId,
    type: 'quiz',
    phase: 'interactive-game',
    title: `${skillArea} Knowledge Quiz`,
    duration: questions.length * 60, // 1 minute per question
    phaseDescription: `Interactive quiz on ${skillArea} concepts`,
    metadata: {
      subject,
      skillArea,
      gradeLevel,
      questionCount: questions.length
    },
    content: {
      questions,
      quizSettings: {
        showProgress: true,
        allowRetry: true,
        showExplanations: true,
        randomizeQuestions: false
      }
    }
  };
};

export const createStoryBasedActivity = (
  subject: string,
  skillArea: string,
  story: string,
  challenges: string[],
  gradeLevel: number = 6
): LessonActivity => {
  const storyId = `story_activity_${Date.now()}`;

  return {
    id: storyId,
    type: 'interactive-game',
    phase: 'application',
    title: `${skillArea} Story Adventure`,
    duration: 480, // 8 minutes
    phaseDescription: `Story-based learning adventure for ${skillArea}`,
    metadata: {
      subject,
      skillArea,
      gradeLevel,
      activityType: 'story'
    },
    content: {
      story,
      storyElements: {
        setting: `A world where ${skillArea} is essential`,
        characters: ['You (the hero)', 'Wise guide', 'Helpful friends'],
        plot: `Use ${skillArea} to overcome challenges and succeed`,
        challenges
      }
    }
  };
};
