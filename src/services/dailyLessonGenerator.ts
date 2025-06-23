
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
    console.log('📋 Lesson config:', config);
    
    try {
      // Check if we have a lesson for today
      const existingLesson = CacheService.getTodaysLesson(userId, subject, currentDate);
      if (existingLesson && existingLesson.length > 0) {
        console.log('📚 Found existing lesson for today, using cached version');
        return existingLesson;
      }

      console.log('🔄 No cached lesson found, generating new lesson...');

      // Get student's current progress and abilities
      const studentProgress = await StudentProgressService.getStudentProgress(userId, subject, skillArea);
      console.log('📊 Student progress loaded:', studentProgress);
      
      // Generate curriculum-aligned activities based on student's current level
      const activities = await this.generateCurriculumBasedActivities(
        subject,
        skillArea,
        gradeLevel,
        studentProgress
      );

      console.log(`✅ Generated ${activities.length} new activities`);

      // Cache the lesson for today
      CacheService.cacheTodaysLesson(userId, subject, currentDate, activities);
      
      console.log(`✅ Generated and cached ${activities.length} new activities for ${subject}`);
      return activities;
      
    } catch (error) {
      console.error('❌ Error generating daily lesson:', error);
      
      // Return fallback activities if generation fails
      const fallbackActivities = this.generateFallbackLesson(subject, skillArea, gradeLevel);
      console.log(`🆘 Using ${fallbackActivities.length} fallback activities`);
      return fallbackActivities;
    }
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
    console.log('🏗️ Starting curriculum-based activity generation...');
    
    const activities: LessonActivity[] = [];
    const lessonId = `lesson-${Date.now()}`;

    // Determine skill focus based on weaknesses and grade level
    const focusAreas = CurriculumService.determineFocusAreas(subject, gradeLevel, studentProgress);
    console.log('🎯 Focus areas determined:', focusAreas.map(f => f.name));
    
    // Generate 6-8 activities for a complete lesson (20-25 minutes)
    for (let i = 0; i < 7; i++) {
      const activityType = this.getActivityTypeForIndex(i);
      const focusArea = focusAreas[i % focusAreas.length];
      
      console.log(`📝 Generating activity ${i + 1}: ${activityType} for ${focusArea.name}`);
      
      try {
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
        console.log(`✅ Activity ${i + 1} created: ${activity.title}`);
        
      } catch (error) {
        console.error(`❌ Failed to create activity ${i + 1}:`, error);
        
        // Add a simple fallback activity
        const fallbackActivity: LessonActivity = {
          id: `${lessonId}_fallback_${i}`,
          type: 'content-delivery',
          phase: 'content-delivery',
          title: `${subject} Practice ${i + 1}`,
          duration: 180,
          phaseDescription: `Practice activity for ${skillArea}`,
          metadata: { subject, skillArea, gradeLevel },
          content: {
            text: `Let's practice ${skillArea} concepts!`,
            question: 'Are you ready to learn?',
            options: ['Yes!', 'Let\'s go!', 'Ready!', 'Excited!'],
            correct: 0,
            explanation: 'Great attitude! Let\'s begin.'
          }
        };
        activities.push(fallbackActivity);
      }
    }

    console.log(`🏁 Generated ${activities.length} curriculum-based activities`);
    return activities;
  }

  private static getActivityTypeForIndex(index: number): string {
    const types = ['content-delivery', 'interactive-game', 'application', 'interactive-game', 'content-delivery', 'interactive-game', 'application'];
    return types[index % types.length];
  }

  private static generateFallbackLesson(subject: string, skillArea: string, gradeLevel: number): LessonActivity[] {
    console.log('🆘 Generating fallback lesson...');
    
    const fallbackActivities: LessonActivity[] = [];
    const lessonId = `fallback-${Date.now()}`;
    
    for (let i = 0; i < 5; i++) {
      const activity: LessonActivity = {
        id: `${lessonId}_fallback_${i}`,
        type: 'content-delivery',
        phase: 'content-delivery',
        title: `${subject} Lesson ${i + 1}`,
        duration: 240,
        phaseDescription: `Grade ${gradeLevel} ${subject} content`,
        metadata: { subject, skillArea, gradeLevel },
        content: {
          text: `Welcome to your Grade ${gradeLevel} ${subject} lesson! Today we'll explore ${skillArea}.`,
          question: `What interests you most about ${subject}?`,
          options: [
            'Learning new concepts',
            'Solving problems',
            'Understanding how things work',
            'All of the above!'
          ],
          correct: 3,
          explanation: `Excellent! ${subject} has many fascinating aspects to explore.`
        }
      };
      fallbackActivities.push(activity);
    }
    
    console.log(`🆘 Generated ${fallbackActivities.length} fallback activities`);
    return fallbackActivities;
  }

  /**
   * Force regenerate lesson (for testing or manual refresh)
   */
  static clearTodaysLesson(userId: string, subject: string, currentDate: string): void {
    console.log(`🗑️ Clearing today's lesson for ${subject}`);
    CacheService.clearTodaysLesson(userId, subject, currentDate);
  }
}

export const dailyLessonGenerator = DailyLessonGenerator;
