
import { LessonActivity } from '@/components/education/components/types/LessonTypes';
import { CurriculumFocusArea } from './types';

export class ActivityContentGenerator {
  static async createCurriculumActivity(
    lessonId: string,
    activityIndex: number,
    subject: string,
    skillArea: string,
    focusArea: CurriculumFocusArea,
    gradeLevel: number,
    studentProgress: any,
    activityType: string
  ): Promise<LessonActivity> {
    
    const activity: LessonActivity = {
      id: `${lessonId}_activity_${activityIndex}`,
      type: activityType as any,
      phase: activityType as any,
      title: `${focusArea.name} Activity`,
      duration: 180,
      phaseDescription: focusArea.description,
      metadata: {
        subject,
        skillArea,
        gradeLevel,
        concept: focusArea.name
      },
      content: {
        text: `Let's explore ${focusArea.name} for Grade ${gradeLevel}!`,
        question: `What do you know about ${focusArea.concepts[0]}?`,
        options: ['A lot', 'Some', 'A little', 'Nothing yet'],
        correct: 0,
        explanation: `Great! Let's learn more about ${focusArea.concepts[0]}.`
      }
    };

    return activity;
  }
}
