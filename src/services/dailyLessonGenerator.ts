
import { LessonActivity } from '@/components/education/components/types/LessonTypes';
import { DailyLessonConfig } from './dailyLessonGenerator/types';
import { StudentProgressService } from './dailyLessonGenerator/studentProgressService';
import { CurriculumService } from './dailyLessonGenerator/curriculumService';
import { CacheService } from './dailyLessonGenerator/cacheService';
import { calendarService } from './CalendarService';
import { aiContentGenerator } from './content/aiContentGenerator'; // Fixed import path
import learnerProfileService from './learnerProfile/LearnerProfileService';
import { supabase } from '@/integrations/supabase/client';

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
   * Generate AI-powered activities using the new prompt template system
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

    console.log('🤖 Using AI content generation with new prompt template');
    console.log(`🎯 Session ID: ${sessionId} - Generating unique content`);

    // Generate 7 diverse activities using AI with enhanced variety
    for (let i = 0; i < 7; i++) {
      let attempts = 0;
      let uniqueContent = false;
      
      while (!uniqueContent && attempts < 3) {
        try {
          // Use the new Training Ground prompt system via edge function
          const { data: aiContent, error } = await supabase.functions.invoke('generate-adaptive-content', {
            body: {
              activityType: 'training-ground',
              subject,
              gradeLevel,
              learningStyle: learnerProfile?.learning_style_preference || 'multimodal approach',
              interests: learnerProfile?.interests || [],
              studentInterests: learnerProfile?.interests || [],
              studentAbilities: studentProgress?.abilities_assessment || 'mixed ability with both support and challenges',
              teachingPerspective: 'balanced, evidence-based style',
              curriculumStandards: 'broadly accepted topics and skills for that grade',
              lessonDuration: 35,
              subjectWeight: 'medium',
              calendarKeywords: activeKeywords,
              calendarDuration: 'standalone session',
              performanceData: {
                accuracy: studentProgress?.accuracy_rate || 0.75,
                engagement: studentProgress?.engagement_level || 'moderate'
              },
              metadata: {
                activityIndex: i,
                sessionId,
                varietyPrompt: this.getVarietyPrompt(i),
                diversityLevel: Math.floor(i / 2) + 1,
                uniquenessSeeds: this.getUniquenessSeeds(i, attempts)
              }
            }
          });

          if (error) {
            console.error('❌ Training Ground generation error:', error);
            throw error;
          }

          // Check for uniqueness - Training Ground activities have different structure
          const questionKey = aiContent.title?.toLowerCase().trim() || 
                             aiContent.objective?.toLowerCase().trim() || 
                             `activity-${i}`;
          if (!usedQuestions.has(questionKey)) {
            usedQuestions.add(questionKey);
            uniqueContent = true;
            
            const activity: LessonActivity = {
              id: `${sessionId}-activity-${i}`,
              title: aiContent.title || this.generateActivityTitle(subject, skillArea, i),
              type: 'training-ground-activity',
              phase: 'activity',
              duration: 180,
              content: {
                trainingGroundData: {
                  title: aiContent.title || this.generateActivityTitle(subject, skillArea, i),
                  objective: aiContent.objective || `Learn ${subject} concepts`,
                  explanation: aiContent.explanation || `Explore ${subject} through interactive activities`,
                  activity: {
                    type: aiContent.activityType || 'PuzzleSolver',
                    instructions: aiContent.instructions || aiContent.activity?.instructions || 'Complete the learning activity'
                  },
                  assessmentElement: aiContent.assessmentElement,
                  optionalExtension: aiContent.optionalExtension,
                  studentSkillTargeted: aiContent.studentSkillTargeted,
                  learningStyleAdaptation: aiContent.learningStyleAdaptation
                },
                explanation: aiContent.explanation,
                activity: aiContent.activity,
                objective: aiContent.objective,
                assessmentElement: aiContent.assessmentElement
              },
              difficulty: gradeLevel + this.getDifficultyVariation(i),
              metadata: {
                generatedBy: 'training-ground-prompt',
                sessionId,
                activityIndex: i,
                isTrainingGroundActivity: true
              }
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

  private static getVarietyPrompt(index: number): string {
    const prompts = [
      'Use real-world scenarios',
      'Include visual/spatial elements', 
      'Focus on word problems',
      'Incorporate games or puzzles',
      'Use creative storytelling',
      'Apply practical examples',
      'Challenge critical thinking'
    ];
    return prompts[index % prompts.length];
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
