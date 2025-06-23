import { LessonActivity } from '@/components/education/components/types/LessonTypes';

interface QuestionData {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  subject: string;
  skillArea: string;
  difficultyLevel: number;
  templateId: string;
}

interface ContentData {
  concept: string;
  explanation: string;
  gradeLevel: number;
  checkQuestion: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  };
}

interface ApplicationData {
  scenario: string;
  task: string;
  guidance: string;
  gradeLevel: number;
}

export class DynamicLessonExtender {
  private baseDuration = 180;
  private variance = 60;
  private maxActivities = 5;

  constructor() {}

  shouldExtendLesson(
    timeElapsed: number,
    score: number,
    correctStreak: number,
    engagementLevel: number
  ): boolean {
    const minimumTime = 600;
    const highEngagement = engagementLevel > 75;
    const goodPerformance = score > 5 && correctStreak > 3;

    return timeElapsed > minimumTime && highEngagement && goodPerformance;
  }

  extendLesson(
    existingActivities: LessonActivity[],
    questionData: QuestionData,
    contentData: ContentData,
    applicationData: ApplicationData
  ): LessonActivity[] {
    if (existingActivities.length >= this.maxActivities) {
      console.warn('Max dynamic activities reached.');
      return existingActivities;
    }

    const activityCount = existingActivities.length + 1;
    const newQuestionActivity = this.createQuestionActivity(questionData, activityCount);
    const newContentActivity = this.createContentActivity(contentData, activityCount);
    const newApplicationActivity = this.createApplicationActivity(applicationData, activityCount);

    return [...existingActivities, newQuestionActivity, newContentActivity, newApplicationActivity];
  }

  calculateDynamicDuration(): number {
    const randomVariance = Math.floor(Math.random() * (2 * this.variance + 1)) - this.variance;
    return this.baseDuration + randomVariance;
  }

  private createQuestionActivity(questionData: any, activityCount: number): LessonActivity {
    return {
      id: `dynamic_question_${Date.now()}_${activityCount}`,
      title: `Problem Solving Challenge ${activityCount}`,
      type: 'interactive-game',
      phase: 'interactive-game',
      duration: this.calculateDynamicDuration(),
      phaseDescription: `Dynamic interactive question ${activityCount}`,
      content: {
        question: questionData.question,
        options: questionData.options,
        correctAnswer: questionData.correctAnswer,
        explanation: questionData.explanation
      },
      metadata: {
        subject: questionData.subject,
        skillArea: questionData.skillArea,
        difficultyLevel: questionData.difficultyLevel,
        templateId: questionData.templateId,
        isExtension: true
      }
    };
  }

  private createContentActivity(contentData: any, activityCount: number): LessonActivity {
    return {
      id: `dynamic_content_${Date.now()}_${activityCount}`,
      title: `Learning Segment ${activityCount}`,
      type: 'content-delivery',
      phase: 'content-delivery',
      duration: this.calculateDynamicDuration(),
      phaseDescription: `Dynamic content delivery segment ${activityCount}`,
      content: {
        text: contentData.explanation,
        segments: [{
          concept: contentData.concept,
          explanation: contentData.explanation,
          checkQuestion: {
            question: contentData.checkQuestion.question,
            options: contentData.checkQuestion.options,
            correctAnswer: contentData.checkQuestion.correctAnswer,
            explanation: contentData.checkQuestion.explanation
          }
        }]
      },
      metadata: {
        isExtension: true,
        gradeLevel: contentData.gradeLevel,
        concept: contentData.concept
      }
    };
  }

  private createApplicationActivity(applicationData: any, activityCount: number): LessonActivity {
    return {
      id: `dynamic_application_${Date.now()}_${activityCount}`,
      title: `Real-World Application ${activityCount}`,
      type: 'application',
      phase: 'application',
      duration: this.calculateDynamicDuration(),
      phaseDescription: `Dynamic application activity ${activityCount}`,
      content: {
        scenario: applicationData.scenario,
        task: applicationData.task,
        guidance: applicationData.guidance
      },
      metadata: {
        isExtension: true,
        gradeLevel: applicationData.gradeLevel
      }
    };
  }
}

export const dynamicLessonExtender = new DynamicLessonExtender();
