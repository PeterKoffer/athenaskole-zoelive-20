
import { LessonActivity } from '@/components/education/components/types/LessonTypes';
import { DailyLessonConfig } from './dailyLessonGenerator/types';
import { StudentProgressService } from './dailyLessonGenerator/studentProgressService';
import { CurriculumService } from './dailyLessonGenerator/curriculumService';
import { CacheService } from './dailyLessonGenerator/cacheService';
import { calendarService } from '../CalendarService';
import { aiContentGenerator } from '../content/aiContentGenerator';
import learnerProfileService from '../learnerProfile/LearnerProfileService';

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
    const lessonId = `lesson-${Date.now()}`;

    console.log('🤖 Using AI content generation with new prompt template');

    // Generate 7 diverse activities using AI
    for (let i = 0; i < 7; i++) {
      try {
        const aiContent = await aiContentGenerator.generateAdaptiveContent({
          subject,
          skillArea,
          gradeLevel,
          activityType: this.getActivityTypeForIndex(i),
          difficulty: gradeLevel,
          learningStyle: learnerProfile?.learning_style_preference || 'mixed',
          studentInterests: learnerProfile?.interests,
          studentAbilities: studentProgress,
          calendarKeywords: activeKeywords,
          metadata: {
            activityIndex: i,
            studentProgress
          }
        });

        const activity: LessonActivity = {
          id: `${lessonId}-activity-${i}`,
          title: this.generateActivityTitle(subject, skillArea, i),
          type: 'quiz',
          phase: 'quiz',
          duration: 180,
          content: {
            question: aiContent.question,
            options: aiContent.options,
            correctAnswer: aiContent.correct,
            explanation: aiContent.explanation
          },
          subject,
          skillArea,
          phaseDescription: `Activity ${i + 1}: ${skillArea.replace(/_/g, ' ')}`
        };

        activities.push(activity);
        console.log(`✅ Generated AI activity ${i + 1}: ${activity.title}`);
      } catch (error) {
        console.error(`❌ Failed to generate AI activity ${i}:`, error);
        // Fallback to basic activity
        const fallbackActivity: LessonActivity = {
          id: `${lessonId}-fallback-${i}`,
          title: `${subject} Challenge ${i + 1}`,
          type: 'quiz',
          phase: 'quiz',
          duration: 180,
          content: {
            question: `What is an important concept in ${subject}?`,
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            correctAnswer: 0,
            explanation: `This helps build understanding in ${subject}.`
          },
          subject,
          skillArea
        };
        activities.push(fallbackActivity);
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
    const types = ['content-delivery', 'interactive-game', 'application', 'interactive-game', 'content-delivery', 'interactive-game', 'application'];
    return types[index % types.length];
  }

  /**
   * Force regenerate lesson (for testing or manual refresh)
   */
  static clearTodaysLesson(userId: string, subject: string, currentDate: string): void {
    CacheService.clearTodaysLesson(userId, subject, currentDate);
  }
}

export const dailyLessonGenerator = DailyLessonGenerator;
