
import { LessonActivity } from '@/components/education/components/types/LessonTypes';
import { DailyLessonConfig } from './dailyLessonGenerator/types';
import { StudentProgressService } from './dailyLessonGenerator/studentProgressService';
import { CurriculumService } from './dailyLessonGenerator/curriculumService';
import { ActivityContentGenerator } from './dailyLessonGenerator/activityContentGenerator';
import { CacheService } from './dailyLessonGenerator/cacheService';

export class DailyLessonGenerator {
  /**
   * Generate a completely new lesson for the day based on student progress and curriculum
   */
  static async generateDailyLesson(config: DailyLessonConfig): Promise<LessonActivity[]> {
    const { subject, skillArea, userId, gradeLevel, currentDate } = config;
    
    console.log(`🎯 Generating NEW daily lesson for ${subject} - ${currentDate}`);
    
    // Check if we have a lesson for today
    const existingLesson = CacheService.getTodaysLesson(userId, subject, currentDate);
    if (existingLesson) {
      console.log('📚 Found existing lesson for today, using cached version');
      return existingLesson;
    }

    // Get student's current progress and abilities
    const studentProgress = await StudentProgressService.getStudentProgress(userId, subject, skillArea);
    
    // Generate curriculum-aligned activities based on student's current level
    const activities = await this.generateCurriculumBasedActivities(
      subject,
      skillArea,
      gradeLevel,
      studentProgress
    );

    // Cache the lesson for today
    CacheService.cacheTodaysLesson(userId, subject, currentDate, activities);
    
    console.log(`✅ Generated ${activities.length} new activities for ${subject}`);
    return activities;
  }

  /**
   * Generate curriculum-based activities tailored to student's level
   */
  private static async generateCurriculumBasedActivities(
    subject: string,
    skillArea: string,
    gradeLevel: number,
    studentProgress: any
  ): Promise<LessonActivity[]> {
    const activities: LessonActivity[] = [];
    const lessonId = `lesson-${Date.now()}`;

    // Determine skill focus based on weaknesses and grade level
    const focusAreas = CurriculumService.determineFocusAreas(subject, gradeLevel, studentProgress);
    
    // Generate multiple activities for a complete lesson
    for (let i = 0; i < 7; i++) {
      const activityType = this.getActivityTypeForIndex(i);
      const focusArea = focusAreas[i % focusAreas.length];
      
      const activity = await ActivityContentGenerator.createCurriculumActivity(
        lessonId,
        i,
        subject,
        skillArea,
        focusArea,
        gradeLevel,
        studentProgress,
        activityType
      );
      
      activities.push(activity);
    }

    return activities;
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
