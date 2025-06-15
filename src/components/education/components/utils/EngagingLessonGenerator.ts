
import { LessonActivity } from '../types/LessonTypes';
import { EngagingActivityFactory } from '../../templates/EngagingActivityFactory';
import { ENGAGING_THEMES } from '../../templates/StandardLessonTemplate';

/**
 * Generate ENGAGING lessons that transform boring education into adventures!
 */
export class EngagingLessonGenerator {
  
  /**
   * Generate a full engaging lesson for any subject
   */
  static generateEngagingLesson(
    subject: string,
    skillArea: string,
    gradeLevel: number,
    studentName?: string
  ): LessonActivity[] {
    // Pick a theme based on subject
    const theme = this.selectThemeForSubject(subject);
    const themeData = ENGAGING_THEMES[theme];
    
    const config = {
      subject,
      concept: skillArea,
      difficulty: Math.min(Math.max(gradeLevel, 1), 5) as 1 | 2 | 3 | 4 | 5,
      theme,
      studentLevel: gradeLevel
    };

    // Generate a complete engaging lesson
    return EngagingActivityFactory.generateFullEngagingLesson(config);
  }

  /**
   * Select the best theme based on subject
   */
  private static selectThemeForSubject(subject: string): keyof typeof ENGAGING_THEMES {
    const subjectThemes: Record<string, keyof typeof ENGAGING_THEMES> = {
      'mathematics': 'mathDetective',
      'math': 'mathDetective',
      'science': 'spaceExplorer',
      'history': 'timeAdventurer',
      'english': 'mysticalQuest',
      'language': 'mysticalQuest',
      'art': 'mysticalQuest',
      'music': 'mysticalQuest'
    };

    return subjectThemes[subject.toLowerCase()] || 'spaceExplorer';
  }

  /**
   * Generate subject-specific engaging activities
   */
  static generateMathAdventure(gradeLevel: number): LessonActivity[] {
    const config = {
      subject: 'mathematics',
      concept: 'Number Detective Work',
      difficulty: Math.min(Math.max(gradeLevel, 1), 5) as 1 | 2 | 3 | 4 | 5,
      theme: 'mathDetective' as const,
      studentLevel: gradeLevel
    };

    return [
      // Epic Detective Opening
      {
        id: 'math-detective-opening',
        type: 'introduction',
        phase: 'introduction',
        title: '🕵️ Welcome to Math Detective Academy!',
        duration: 180,
        phaseDescription: 'Become a mathematical detective',
        content: {
          storyHook: "Detective Numbers needs your help! Mathematical mysteries are happening all over the city, and only a brilliant student like you can solve them!",
          characterIntroduction: "Detective Numbers",
          missionBriefing: "Your mission: Solve numerical mysteries using your incredible math skills!",
          excitementBuilder: "This is going to be the most epic math adventure ever!"
        }
      },

      // Adventure Game 1
      EngagingActivityFactory.createAdventureGame({
        ...config,
        concept: 'The Case of Missing Numbers'
      }),

      // Puzzle Quest
      EngagingActivityFactory.createPuzzleQuest({
        ...config,
        concept: 'Pattern Mystery Challenge'
      }),

      // Creative Builder
      EngagingActivityFactory.createCreativeBuilder({
        ...config,
        concept: 'Detective Agency Builder'
      }),

      // Grand Finale
      {
        id: 'math-detective-finale',
        type: 'summary',
        phase: 'summary',
        title: '🏆 Math Detective Badge Earned!',
        duration: 120,
        phaseDescription: 'Celebrate your mathematical detective skills',
        content: {
          achievementCelebration: "Congratulations, Detective! You've solved every mathematical mystery with incredible skill!",
          heroStatus: "MATH DETECTIVE ACHIEVED",
          badgesEarned: ["Master Detective", "Number Sleuth", "Math Hero"],
          nextQuestTeaser: "Even more mysterious math cases await your brilliant detective work!"
        }
      }
    ];
  }

  /**
   * Generate engaging science adventures
   */
  static generateScienceExploration(gradeLevel: number): LessonActivity[] {
    const config = {
      subject: 'science',
      concept: 'Galactic Science Discovery',
      difficulty: Math.min(Math.max(gradeLevel, 1), 5) as 1 | 2 | 3 | 4 | 5,
      theme: 'spaceExplorer' as const,
      studentLevel: gradeLevel
    };

    return EngagingActivityFactory.generateFullEngagingLesson(config);
  }

  /**
   * Quality assessment - ensure lessons meet engagement standards
   */
  static assessLessonQuality(activities: LessonActivity[]): {
    engagementScore: number;
    funFactor: number;  
    interactivityLevel: number;
    isAwesome: boolean;
  } {
    let engagementScore = 0;
    let funFactor = 0;
    let interactivityLevel = 0;

    activities.forEach(activity => {
      // Check for story elements
      if (activity.content.storyHook || activity.content.scenario) {
        engagementScore += 20;
      }

      // Check for games and adventures
      if (activity.title.includes('Adventure') || activity.title.includes('Quest')) {
        funFactor += 25;
      }

      // Check for interactivity
      if (activity.content.gameType || activity.content.puzzleDescription) {
        interactivityLevel += 20;
      }

      // Check for celebrations
      if (activity.content.celebration || activity.content.achievementCelebration) {
        funFactor += 15;
      }
    });

    const maxPossible = activities.length * 20;
    engagementScore = Math.min((engagementScore / maxPossible) * 100, 100);
    funFactor = Math.min(funFactor, 100);
    interactivityLevel = Math.min(interactivityLevel, 100);

    return {
      engagementScore,
      funFactor,
      interactivityLevel,
      isAwesome: engagementScore >= 80 && funFactor >= 70 && interactivityLevel >= 70
    };
  }
}
