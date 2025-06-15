
/**
 * Canonical, extensible lesson template engine for NELIE adaptive tutor.
 * This structure is designed to be robust, easy to extend, and reusable for all K-12 subjects.
 */

// First: import only types needed
import { LessonActivity, SubjectLessonPlan } from '../components/types/LessonTypes';

/**
 * CanonicalLessonConfig:
 * Core configuration shape for any adaptive, themed, story-driven lesson plan.
 */
export interface CanonicalLessonConfig {
  subject: string;
  skillArea: string;
  gradeLevel: number;
  studentName?: string;
  theme: string; // "detective", "space", etc
  storyContext: string;
  openingHook: string;
  missionObjectives: string[];
  characterGuide?: string;
  activities: CanonicalLessonActivityConfig[];
  finale?: CanonicalFinaleConfig;
}

// Each discrete activity/station/phase in the lesson
export interface CanonicalLessonActivityConfig {
  id?: string; // if absent, will be auto-numbered
  type: LessonActivity["type"];
  phase: LessonActivity["phase"];
  title: string;
  duration: number; // seconds
  phaseDescription?: string;
  content: any; // flexible—matches LessonActivity's 'content'
  // Optionally add more for extension!
}

// Finale config (optional epic ending / boss)
export interface CanonicalFinaleConfig {
  title: string;
  description: string;
  type: 'boss-battle' | 'presentation' | 'final-project' | 'epic-quest';
  celebration: string;
}

/**
 * Converts CanonicalLessonConfig to SubjectLessonPlan (NELIE wide type)
 * - Handles id/phase/type assignment & extension hooks.
 */
export function buildCanonicalLesson(config: CanonicalLessonConfig): SubjectLessonPlan {
  // Automate id's if missing, add theme/storyContext to all
  const phases: LessonActivity[] = config.activities.map((act, idx) => ({
    id: act.id ?? `${config.subject}-step-${idx + 1}`,
    type: act.type,
    phase: act.phase,
    title: act.title,
    duration: act.duration,
    phaseDescription: act.phaseDescription,
    content: {
      ...act.content,
      theme: config.theme,
      storyContext: config.storyContext,
      characterGuide: config.characterGuide,
      missionObjectives: config.missionObjectives,
      // Optionally include student's name where relevant
      ...(config.studentName ? { studentName: config.studentName } : {})
    }
  }));

  // Add grand finale if present
  if (config.finale) {
    phases.push({
      id: `${config.subject}-finale`,
      type: 'summary',
      phase: 'summary',
      title: `🏆 ${config.finale.title}`,
      duration: 60,
      phaseDescription: 'Epic celebration and next adventure!',
      content: {
        grandChallenge: config.finale,
        celebration: config.finale.celebration,
        theme: config.theme,
        storyContext: config.storyContext,
        achievementsList: config.missionObjectives,
      }
    });
  }

  return {
    subject: config.subject,
    skillArea: config.skillArea,
    totalDuration: phases.reduce((sum, p) => sum + (p.duration || 0), 0),
    phases,
    learningObjectives: config.missionObjectives,
    prerequisites: [],
    engagementLevel: 'HIGH',
    funFactor: '🎉'
  };
}

/**
 * Sample function to generate a Mathematics lesson using the canonical structure
 * Easy to extend! (Add more phases/activities, or build a "template per subject".)
 */
export function createCanonicalMathematicsLesson(options?: Partial<CanonicalLessonConfig>): SubjectLessonPlan {
  const config: CanonicalLessonConfig = {
    subject: 'mathematics',
    skillArea: 'general_math',
    gradeLevel: 2,
    studentName: options?.studentName ?? 'Math Explorer',
    theme: "mystery",
    storyContext: "Math Adventure Forest",
    openingHook: "A puzzle awaits you in the magic forest—can you solve it before sunset?",
    missionObjectives: [
      "Solve math challenges",
      "Discover number patterns",
      "Become a Math Explorer"
    ],
    characterGuide: "Professor Patterns",
    activities: [
      {
        type: 'introduction',
        phase: 'introduction',
        title: "Welcome to the Math Forest!",
        duration: 120,
        phaseDescription: "Meet your guide and get your supplies.",
        content: {
          hook: "Welcome, young explorer!",
          realWorldExample: "In our forest, every puzzle is a chance to earn a golden acorn.",
          thoughtQuestion: "What's the biggest number you can count to?"
        }
      },
      {
        type: 'content-delivery',
        phase: 'content-delivery',
        title: "The Counting Stream",
        duration: 120,
        phaseDescription: "Counting animals and treasures.",
        content: {
          segments: [{
            concept: "Counting",
            explanation: "Let's count all the ducks in the stream. How many do you see?",
            checkQuestion: {
              question: "How many ducks are there? 🦆🦆🦆🦆",
              options: ['2', '3', '4', '5'],
              correctAnswer: 2,
              explanation: "There are 4 ducks in the stream!"
            }
          }]
        }
      },
      {
        type: 'interactive-game',
        phase: 'interactive-game',
        title: "Puzzle Bridge",
        duration: 150,
        phaseDescription: "Solve a puzzle to cross the bridge.",
        content: {
          question: "What comes next in this pattern? 2, 4, 6, __",
          options: ['7', '8', '9', '10'],
          correctAnswer: 1,
          explanation: "We add 2 each time: 2,4,6,8!",
          gameType: 'problem-solving'
        }
      }
    ],
    finale: {
      title: "You Escaped the Math Forest!",
      description: "Celebrate your adventure and prepare for the next quest.",
      type: 'presentation', // was "celebration", which is not a valid type; changed to "presentation"
      celebration: "You are a true Math Explorer! 🎉"
    }
  };
  // Allow overrides for customization/extensibility
  return buildCanonicalLesson({ ...config, ...options });
}

/**
 * To extend for other subjects:
 * - Make per-subject config generators (like createCanonicalScienceLesson)
 * - Or create a UI to assemble a CanonicalLessonConfig dynamically
 */

/**
 * USAGE:
 * const mathLesson = createCanonicalMathematicsLesson({ studentName: "Katie" });
 * // mathLesson now fits SubjectLessonPlan and is ready for lesson manager!
 */

