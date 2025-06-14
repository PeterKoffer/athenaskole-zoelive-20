
import { LessonActivity } from '@/components/education/components/types/LessonTypes';
import { SubjectQuestionService } from './subjectQuestionService';

export interface DynamicContentRequest {
  subject: string;
  skillArea: string;
  gradeLevel: number;
  timeElapsed: number;
  currentScore: number;
  correctStreak: number;
  usedQuestionIds: string[];
  targetDuration: number; // in minutes
}

export class DynamicLessonExtender {
  /**
   * Generate additional content to extend lesson to target duration
   */
  static async generateExtensionContent(request: DynamicContentRequest): Promise<LessonActivity[]> {
    const { subject, skillArea, gradeLevel, timeElapsed, targetDuration, usedQuestionIds } = request;
    
    // Calculate how much more time we need to fill (in minutes)
    const remainingTime = targetDuration - Math.floor(timeElapsed / 60);
    
    if (remainingTime <= 2) {
      console.log('🎯 Lesson close to target duration, no extension needed');
      return [];
    }

    console.log(`🔄 Generating extension content for ${remainingTime} more minutes`);
    
    // Generate 3-4 activities per remaining 5-minute block
    const activitiesNeeded = Math.max(2, Math.floor(remainingTime / 2));
    const newActivities: LessonActivity[] = [];

    for (let i = 0; i < activitiesNeeded; i++) {
      const activityType = this.getActivityTypeForExtension(i);
      
      if (activityType === 'interactive-game') {
        // Generate subject-specific question
        const questionTemplate = await SubjectQuestionService.getRandomQuestionForSubject(
          subject, 
          skillArea, 
          usedQuestionIds
        );

        if (questionTemplate) {
          const activity = this.createQuestionActivity(questionTemplate, i);
          newActivities.push(activity);
        }
      } else {
        // Generate other activity types
        const activity = this.createContentActivity(subject, skillArea, activityType, i, gradeLevel);
        newActivities.push(activity);
      }
    }

    console.log(`✅ Generated ${newActivities.length} extension activities`);
    return newActivities;
  }

  private static getActivityTypeForExtension(index: number): string {
    const types = ['interactive-game', 'content-delivery', 'interactive-game', 'application'];
    return types[index % types.length];
  }

  private static createQuestionActivity(questionTemplate: any, index: number): LessonActivity {
    return {
      id: `extension-question-${Date.now()}-${index}`,
      title: `${questionTemplate.subject} Challenge ${index + 1}`,
      type: 'activity',
      phase: 'interactive-game',
      duration: 180, // 3 minutes
      content: {
        question: questionTemplate.question_template,
        options: questionTemplate.options_template,
        correctAnswer: questionTemplate.correct_answer,
        explanation: questionTemplate.explanation_template
      },
      metadata: {
        subject: questionTemplate.subject,
        skillArea: questionTemplate.skill_area,
        difficultyLevel: questionTemplate.difficulty_level,
        templateId: questionTemplate.id,
        isExtension: true
      }
    };
  }

  private static createContentActivity(
    subject: string, 
    skillArea: string, 
    activityType: string, 
    index: number,
    gradeLevel: number
  ): LessonActivity {
    const timestamp = Date.now();
    
    if (activityType === 'content-delivery') {
      return {
        id: `extension-content-${timestamp}-${index}`,
        title: `${subject} Deep Dive ${index + 1}`,
        type: 'content-delivery',
        phase: 'content-delivery',
        duration: 240, // 4 minutes
        content: {
          text: `Let's explore another important concept in ${subject}. This builds on what we've learned so far.`,
          segments: [{
            explanation: `Here's an interesting way to think about ${skillArea.replace(/_/g, ' ')} at your grade level.`,
            examples: [
              `Example: This relates to your everyday life`,
              `Think about: How this applies to real situations`
            ]
          }]
        },
        metadata: {
          isExtension: true,
          gradeLevel
        }
      };
    }

    return {
      id: `extension-application-${timestamp}-${index}`,
      title: `Apply Your ${subject} Skills ${index + 1}`,
      type: 'application',
      phase: 'application',
      duration: 300, // 5 minutes
      content: {
        scenario: `Let's apply what we've learned in a practical way!`,
        task: `Use your ${subject} knowledge to solve this real-world problem.`,
        guidance: "Take your time and think through each step."
      },
      metadata: {
        isExtension: true,
        gradeLevel
      }
    };
  }

  /**
   * Check if lesson needs extension based on time and engagement
   */
  static shouldExtendLesson(
    timeElapsed: number, 
    targetDuration: number, 
    engagementLevel: number,
    activitiesCompleted: number
  ): boolean {
    const minutesElapsed = Math.floor(timeElapsed / 60);
    const remainingTime = targetDuration - minutesElapsed;
    
    // Extend if we have more than 3 minutes left and student is engaged
    return remainingTime > 3 && engagementLevel > 60 && activitiesCompleted > 2;
  }
}
