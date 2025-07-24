
import { LessonActivity } from '@/components/education/components/types/LessonTypes';
import { DailyLessonConfig } from './dailyLessonGenerator/types';
import { StudentProgressService } from './dailyLessonGenerator/studentProgressService';
import { CurriculumService } from './dailyLessonGenerator/curriculumService';
import { CacheService } from './dailyLessonGenerator/cacheService';
import { calendarService } from './CalendarService';
import { aiContentGenerator } from './content/aiContentGenerator'; // Fixed import path
import learnerProfileService from './learnerProfile/LearnerProfileService';

export class DailyLessonGenerator {
  /**
   * Generate a completely new lesson for the day based on student progress and curriculum
   */
  static async generateDailyLesson(config: DailyLessonConfig): Promise<LessonActivity[]> {
    const { subject, skillArea, userId, gradeLevel, currentDate } = config;
    
    console.log(`🎯 Generating NEW daily lesson for ${subject} - ${currentDate}`);
    
    // Get student's current progress and abilities
    const studentProgress = await StudentProgressService.getStudentProgress(userId, subject, skillArea);
    const learnerProfile = await learnerProfileService.getProfile(userId);
    const activeKeywords = await calendarService.getActiveKeywords(currentDate, gradeLevel, []);
    console.log('📅 Active keywords for lesson:', activeKeywords.join(', '));
    
    // Generate AI-powered curriculum activities using the new prompt template
    const activities = await this.generateAIPoweredActivities(
      subject,
      skillArea,
      gradeLevel,
      studentProgress,
      learnerProfile,
      activeKeywords,
    );
    
    console.log(`✅ Generated ${activities.length} AI-powered activities for ${subject}`);
    return activities;
  }

  /**
   * Generate AI-powered activities using the new prompt template system - ENHANCED FOR ENGAGEMENT
   */
  private static async generateAIPoweredActivities(
    subject: string,
    skillArea: string,
    gradeLevel: number,
    studentProgress: any,
    learnerProfile: any,
    activeKeywords: string[],
  ): Promise<LessonActivity[]> {
    const activities: LessonActivity[] = [];
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const usedQuestions = new Set<string>(); // Track used questions to prevent duplicates

    console.log('🤖 Using ENHANCED AI content generation with creative prompt templates');
    console.log(`🎯 Session ID: ${sessionId} - Generating ENGAGING unique content`);

    // Generate 7 SUPER ENGAGING activities using AI with maximum creativity
    for (let i = 0; i < 7; i++) {
      let attempts = 0;
      let uniqueContent = false;
      
      while (!uniqueContent && attempts < 3) {
        try {
          const aiContent = await aiContentGenerator.generateAdaptiveContent({
            subject,
            skillArea: this.getVariedSkillAreaForIndex(skillArea, i),
            gradeLevel,
            activityType: this.getActivityTypeForIndex(i),
            difficulty: gradeLevel + this.getDifficultyVariation(i),
            learningStyle: learnerProfile?.learning_style_preference || 'mixed',
            studentInterests: learnerProfile?.interests,
            studentAbilities: studentProgress,
            calendarKeywords: activeKeywords,
            estimatedTime: 180,
            metadata: {
              activityIndex: i,
              studentProgress,
              varietyPrompt: this.getEngagingVarietyPrompt(i),
              creativityLevel: Math.floor(i / 2) + 1,
              sessionId,
              uniquenessSeeds: this.getUniquenessSeeds(i, attempts),
              engagementMode: 'maximum',
              storytellingTheme: this.getStorytellingTheme(i),
              interactivityLevel: 'high'
            }
          });

          // Check for uniqueness
          const questionKey = aiContent.question.toLowerCase().trim();
          if (!usedQuestions.has(questionKey)) {
            usedQuestions.add(questionKey);
            uniqueContent = true;
            
            const activity: LessonActivity = {
              id: `${sessionId}-activity-${i}`,
              title: this.generateEngagingActivityTitle(subject, skillArea, i),
              type: this.getEngagingActivityType(i),
              phase: 'interactive',
              duration: 180,
              content: {
                question: aiContent.question,
                options: aiContent.options,
                correctAnswer: aiContent.correct,
                explanation: aiContent.explanation,
                hook: this.generateEngagingHook(i),
                visualCue: this.generateVisualCue(subject, i),
                encouragement: this.generateEncouragement(i)
              },
              subject,
              skillArea,
              phaseDescription: `Activity ${i + 1}: ${skillArea.replace(/_/g, ' ')}`
            };

            activities.push(activity);
            console.log(`✅ Generated UNIQUE AI activity ${i + 1}: ${activity.title}`);
          } else {
            console.log(`🔄 Duplicate detected for activity ${i + 1}, retrying...`);
            attempts++;
          }
        } catch (error) {
          console.error(`❌ Failed to generate AI activity ${i} (attempt ${attempts + 1}):`, error);
          attempts++;
        }
      }
      
      // If we couldn't generate unique content, create fallback
      if (!uniqueContent) {
        const fallbackActivity: LessonActivity = {
          id: `${sessionId}-fallback-${i}`,
          title: `${subject} Challenge ${i + 1}`,
          type: 'quiz',
          phase: 'quiz',
          duration: 180,
          content: {
            question: `Challenge ${i + 1}: What mathematical principle applies here? (Scenario ${i + 1})`,
            options: [
              `Approach A for scenario ${i + 1}`,
              `Approach B for scenario ${i + 1}`,
              `Approach C for scenario ${i + 1}`,
              `Approach D for scenario ${i + 1}`
            ],
            correctAnswer: i % 4,
            explanation: `This scenario helps build understanding of ${subject} concepts through practical application.`
          },
          subject,
          skillArea
        };
        activities.push(fallbackActivity);
        console.log(`⚠️ Using fallback activity ${i + 1}`);
      }
    }

    return activities;
  }

  private static generateActivityTitle(subject: string, skillArea: string, index: number): string {
    const titles = [
      `${subject} Fundamentals`,
      `${skillArea.replace(/_/g, ' ')} Challenge`,
      `Problem Solving in ${subject}`,
      `${subject} Application`,
      `Critical Thinking`,
      `Advanced ${skillArea.replace(/_/g, ' ')}`,
      `${subject} Mastery`
    ];
    return titles[index % titles.length];
  }

  private static getActivityTypeForIndex(index: number): string {
    const types = ['content-delivery', 'interactive-game', 'application', 'problem-solving', 'creative-exercise', 'real-world-application', 'critical-thinking'];
    return types[index % types.length];
  }

  private static getVariedSkillAreaForIndex(baseSkillArea: string, index: number): string {
    if (baseSkillArea === 'general_mathematics') {
      const mathAreas = ['arithmetic', 'problem_solving', 'geometry_basics', 'measurement', 'data_handling', 'patterns', 'number_sense'];
      return mathAreas[index % mathAreas.length];
    }
    return baseSkillArea;
  }

  private static getDifficultyVariation(index: number): number {
    // Slight difficulty variation: -1, 0, +1
    return (index % 3) - 1;
  }

  private static getEngagingVarietyPrompt(index: number): string {
    const prompts = [
      'Create an exciting adventure story with math challenges',
      'Design a fun game scenario with visual elements', 
      'Build a mystery that requires problem-solving',
      'Create a superhero scenario with mathematical powers',
      'Design an exploration mission with calculations',
      'Build a creative challenge with real-world applications',
      'Create an interactive puzzle with storytelling elements'
    ];
    return prompts[index % prompts.length];
  }

  private static getStorytellingTheme(index: number): string {
    const themes = [
      'space_adventure',
      'underwater_exploration',
      'magical_kingdom',
      'superhero_mission',
      'jungle_expedition',
      'time_travel',
      'robot_factory'
    ];
    return themes[index % themes.length];
  }

  private static generateEngagingActivityTitle(subject: string, skillArea: string, index: number): string {
    const titles = [
      `🚀 Space Math Adventure`,
      `🌊 Underwater Challenge`,
      `🏰 Magical Problem Solving`,
      `🦸 Superhero Math Mission`,
      `🌴 Jungle Expedition`,
      `⏰ Time Travel Challenge`,
      `🤖 Robot Factory Puzzle`
    ];
    return titles[index % titles.length];
  }

  private static getEngagingActivityType(index: number): string {
    const types = [
      'adventure_quiz',
      'story_problem',
      'interactive_puzzle',
      'mystery_challenge',
      'creative_game',
      'exploration_task',
      'superhero_mission'
    ];
    return types[index % types.length];
  }

  private static generateEngagingHook(index: number): string {
    const hooks = [
      "🚀 Captain, we need your math skills to navigate through space!",
      "🌊 Dive deep and solve this underwater mystery!",
      "🏰 The magical kingdom needs your problem-solving powers!",
      "🦸 Hero, use your mathematical superpowers to save the day!",
      "🌴 Explorer, can you solve this jungle puzzle?",
      "⏰ Time traveler, calculate your way through history!",
      "🤖 Engineer, help us build the perfect robot!"
    ];
    return hooks[index % hooks.length];
  }

  private static generateVisualCue(subject: string, index: number): string {
    const cues = [
      "🌟 Imagine stars twinkling with numbers",
      "🐠 Picture colorful fish swimming with equations",
      "✨ Visualize magical spells creating math problems",
      "⚡ See lightning bolts carrying mathematical power",
      "🌺 Imagine jungle flowers blooming with solutions",
      "🌀 Picture time spirals filled with calculations",
      "🔧 Visualize gears turning with mathematical precision"
    ];
    return cues[index % cues.length];
  }

  private static generateEncouragement(index: number): string {
    const encouragements = [
      "You're doing amazing! Keep exploring!",
      "Fantastic work, young mathematician!",
      "You're getting stronger with each challenge!",
      "Incredible problem-solving skills!",
      "You're becoming a math superstar!",
      "Outstanding thinking! You've got this!",
      "Brilliant work! You're unstoppable!"
    ];
    return encouragements[index % encouragements.length];
  }

  private static getUniquenessSeeds(index: number, attempt: number): string[] {
    const baseSeeds = [
      `variation-${index}-${attempt}`,
      `timestamp-${Date.now()}`,
      `random-${Math.random().toString(36).substr(2, 9)}`
    ];
    
    const contextualSeeds = [
      'different-character-names',
      'alternative-scenarios',
      'varied-number-sets',
      'unique-situations',
      'diverse-contexts',
      'fresh-perspectives'
    ];
    
    return [...baseSeeds, contextualSeeds[index % contextualSeeds.length]];
  }

  /**
   * Force regenerate lesson (for testing or manual refresh)
   */
  static clearTodaysLesson(userId: string, subject: string, currentDate: string): void {
    CacheService.clearTodaysLesson(userId, subject, currentDate);
  }
}

export const dailyLessonGenerator = DailyLessonGenerator;
