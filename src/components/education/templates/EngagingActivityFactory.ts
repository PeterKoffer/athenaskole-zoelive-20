
import { LessonActivity } from '../components/types/LessonTypes';
import { ENGAGING_THEMES } from './StandardLessonTemplate';

/**
 * Factory for creating ENGAGING activities that students love
 * No more boring questions - everything is an adventure!
 */

export interface ActivityGameConfig {
  subject: string;
  concept: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  theme: keyof typeof ENGAGING_THEMES;
  studentLevel: number;
}

export class EngagingActivityFactory {

  /**
   * Create an adventure-style learning game
   */
  static createAdventureGame(config: ActivityGameConfig): LessonActivity {
    const themeData = ENGAGING_THEMES[config.theme];
    const adventures = {
      mathDetective: {
        scenarios: [
          "The Case of the Missing Numbers! Someone stole all the even numbers from the city!",
          "Mystery of the Broken Calculator! Help Detective Numbers fix the mathematical clues!",
          "The Great Number Heist! Track down the mathematical criminals using your skills!"
        ],
        mechanics: "Click on clues, solve mini-puzzles, and catch the mathematical culprits!",
        rewards: ["Detective Badge", "Mystery Solver Certificate", "Math Hero Status"]
      },
      spaceExplorer: {
        scenarios: [
          "Alien planets need your mathematical help to restore their energy crystals!",
          "Navigate through asteroid fields using coordinate calculations!",
          "Help space colonies solve resource distribution problems!"
        ],
        mechanics: "Pilot your ship, collect space crystals by solving problems, upgrade your gear!",
        rewards: ["Space Captain Badge", "Galactic Explorer Medal", "Cosmic Problem Solver"]
      },
      timeAdventurer: {
        scenarios: [
          "Ancient civilizations need help with their mathematical monuments!",
          "Time paradoxes are disrupting history - use math to fix the timeline!",
          "Help historical figures solve the problems of their era!"
        ],
        mechanics: "Travel through time portals, solve era-specific challenges, collect historical artifacts!",
        rewards: ["Time Master Badge", "History Helper Award", "Temporal Problem Solver"]
      },
      mysticalQuest: {
        scenarios: [
          "The magical kingdom's spells are broken! Use math to restore the magic!",
          "Dragons are hoarding all the numbers! Negotiate with mathematical riddles!",
          "The enchanted forest paths are scrambled - use logic to find the way!"
        ],
        mechanics: "Cast math spells, brew knowledge potions, battle problems with wisdom!",
        rewards: ["Wizard Apprentice Badge", "Magic Math Master", "Enchanted Problem Solver"]
      }
    };

    const themeAdventures = adventures[config.theme];
    const randomScenario = themeAdventures.scenarios[Math.floor(Math.random() * themeAdventures.scenarios.length)];

    return {
      id: `adventure-${config.theme}-${Date.now()}`,
      type: 'interactive-game',
      phase: 'interactive-game',
      title: `🎮 ${randomScenario.split('!')[0]}!`,
      duration: 300,
      phaseDescription: 'Epic interactive adventure',
      content: {
        gameType: 'adventure-game',
        scenario: randomScenario,
        mechanics: themeAdventures.mechanics,
        rewards: themeAdventures.rewards,
        difficulty: config.difficulty,
        engagementHooks: [
          "Ready for an epic adventure?",
          "Your mission is about to begin!",
          "The adventure awaits, hero!"
        ],
        interactionStyle: 'click-drag-explore',
        celebrationLevel: 'EPIC'
      }
    };
  }

  /**
   * Create puzzle-quest style activities
   */
  static createPuzzleQuest(config: ActivityGameConfig): LessonActivity {
    const puzzleTypes = {
      1: "Memory Match Quest - Match concepts with their applications!",
      2: "Pattern Detective - Discover the hidden patterns in the magical sequence!",
      3: "Logic Labyrinth - Navigate through the maze of mathematical reasoning!",
      4: "Master Cipher - Decode the ancient mathematical messages!",
      5: "Grand Puzzle Master - Solve the ultimate brain-bending challenge!"
    };

    return {
      id: `puzzle-quest-${Date.now()}`,
      type: 'interactive-game',
      phase: 'interactive-game',
      title: `🧩 ${puzzleTypes[config.difficulty]}`,
      duration: 240,
      phaseDescription: 'Mind-bending puzzle adventure',
      content: {
        gameType: 'puzzle-quest',
        puzzleDescription: puzzleTypes[config.difficulty],
        difficulty: config.difficulty,
        hintSystem: true,
        progressTracking: true,
        multipleApproaches: true,
        celebrationAnimation: true
      }
    };
  }

  /**
   * Create creative builder activities
   */
  static createCreativeBuilder(config: ActivityGameConfig): LessonActivity {
    const buildingProjects = {
      mathDetective: "Build your own Detective Agency with mathematical security systems!",
      spaceExplorer: "Design and construct your dream space station with mathematical precision!",
      timeAdventurer: "Create a time machine using mathematical principles and historical knowledge!",
      mysticalQuest: "Build an enchanted castle with magical mathematical foundations!"
    };

    return {
      id: `creative-builder-${Date.now()}`,
      type: 'creative-exploration',
      phase: 'creative-exploration',
      title: `🏗️ ${buildingProjects[config.theme]}`,
      duration: 300,
      phaseDescription: 'Creative building adventure',
      content: {
        creativeType: 'build',
        buildingProject: buildingProjects[config.theme],
        tools: ['Drag & Drop Builder', 'Color Palette', 'Shape Library', 'Pattern Tools'],
        collaborationFeatures: true,
        shareGallery: true,
        prideFactor: 'MAXIMUM'
      }
    };
  }

  /**
   * Create discovery simulation activities
   */
  static createDiscoverySimulation(config: ActivityGameConfig): LessonActivity {
    return {
      id: `discovery-sim-${Date.now()}`,
      type: 'application',
      phase: 'application',
      title: `🔬 Discovery Lab: Real-World ${config.concept} Adventures!`,
      duration: 360,
      phaseDescription: 'Hands-on discovery experience',
      content: {
        simulationType: 'discovery-lab',
        realWorldConnections: [
          "How professionals use this daily",
          "Cool careers that need this skill",
          "Amazing real-world applications"
        ],
        interactiveElements: [
          "Virtual experiments",
          "Data manipulation tools",
          "Cause-and-effect exploration"
        ],
        discoveryMode: true,
        experimentFreedom: true
      }
    };
  }

  /**
   * Generate a complete engaging lesson
   */
  static generateFullEngagingLesson(config: ActivityGameConfig): LessonActivity[] {
    return [
      // Epic opening with story hook
      {
        id: `epic-opening-${Date.now()}`,
        type: 'introduction',
        phase: 'introduction',
        title: `🚀 Welcome to Your ${config.concept} Adventure!`,
        duration: 120,
        phaseDescription: 'Epic story introduction',
        content: {
          storyHook: `Prepare for an amazing journey into the world of ${config.concept}!`,
          characterIntroduction: ENGAGING_THEMES[config.theme].characterGuide,
          missionBriefing: `Your mission: Master ${config.concept} through epic adventures!`,
          excitementBuilder: "This is going to be AMAZING!"
        }
      },

      // Interactive discovery
      this.createAdventureGame(config),

      // Puzzle challenge
      this.createPuzzleQuest(config),

      // Creative expression
      this.createCreativeBuilder(config),

      // Real-world application
      this.createDiscoverySimulation(config),

      // Epic celebration finale
      {
        id: `epic-finale-${Date.now()}`,
        type: 'summary',
        phase: 'summary',
        title: `🏆 You're Now a ${config.concept} Hero!`,
        duration: 60,
        phaseDescription: 'Epic achievement celebration',
        content: {
          achievementCelebration: `Congratulations! You've mastered ${config.concept} through epic adventures!`,
          heroStatus: "ACHIEVED",
          badgesEarned: ["Adventure Master", "Problem Solver", "Creative Genius"],
          nextQuestTeaser: "Even more amazing adventures await you!"
        }
      }
    ];
  }
}
