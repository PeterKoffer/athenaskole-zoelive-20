// @ts-nocheck
import { LessonActivity } from '@/components/education/components/types/LessonTypes';
import { StudentProgressData } from './types';

export class ActivityContentGenerator {
  static async generateActivityContent(
    subject: string,
    focusArea: string,
    activityType: string,
    difficulty: number,
    gradeLevel: number
  ): Promise<any> {
    if (activityType === 'interactive-game') {
      return this.createInteractiveGameContent(subject, focusArea, difficulty, gradeLevel);
    } else if (activityType === 'content-delivery') {
      return this.createContentDeliveryContent(subject, focusArea, gradeLevel);
    } else {
      return this.createApplicationContent(subject, focusArea, difficulty, gradeLevel);
    }
  }

  static async createCurriculumActivity(
    lessonId: string,
    index: number,
    subject: string,
    skillArea: string,
    focusArea: string,
    gradeLevel: number,
    studentProgress: StudentProgressData,
    activityType: string
  ): Promise<LessonActivity> {
    const activityId = `${lessonId}-activity-${index}`;
    const difficulty = this.calculateDifficulty(studentProgress, gradeLevel);

    const content = await this.generateActivityContent(
      subject,
      focusArea,
      activityType,
      difficulty,
      gradeLevel
    );

    return {
      id: activityId,
      title: `${focusArea.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Challenge`,
      type: this.mapActivityTypeToPhase(activityType),
      phase: this.mapActivityTypeToPhase(activityType),
      duration: 180,
      phaseDescription: `Learn about ${focusArea.replace(/_/g, ' ')}`,
      metadata: {
        subject,
        skillArea,
        gradeLevel,
        difficultyLevel: difficulty
      },
      content
    };
  }

  private static createInteractiveGameContent(subject: string, focusArea: string, difficulty: number, gradeLevel: number) {
    const timestamp = Date.now();
    const uniqueNumbers = [
      Math.floor(Math.random() * 50) + (difficulty * 10),
      Math.floor(Math.random() * 30) + (difficulty * 5)
    ];

    if (subject.toLowerCase() === 'mathematics') {
      return {
        question: `Emma has ${uniqueNumbers[0]} stickers and gives away ${uniqueNumbers[1]} to her friends. How many stickers does Emma have left?`,
        options: [
          (uniqueNumbers[0] - uniqueNumbers[1]).toString(),
          (uniqueNumbers[0] - uniqueNumbers[1] + 5).toString(),
          (uniqueNumbers[0] - uniqueNumbers[1] - 3).toString(),
          (uniqueNumbers[0] + uniqueNumbers[1]).toString()
        ],
        correct: 0,
        explanation: `Emma started with ${uniqueNumbers[0]} stickers and gave away ${uniqueNumbers[1]}, so she has ${uniqueNumbers[0]} - ${uniqueNumbers[1]} = ${uniqueNumbers[0] - uniqueNumbers[1]} stickers left.`,
        uniqueId: `math-${timestamp}-${uniqueNumbers.join('-')}`
      };
    }

    return {
      question: `New question for ${focusArea} - ${timestamp}`,
      options: ["Option A", "Option B", "Option C", "Option D"],
      correct: 0,
      explanation: "Explanation for the answer",
      uniqueId: `${subject}-${timestamp}`
    };
  }

  private static createContentDeliveryContent(subject: string, focusArea: string, gradeLevel: number) {
    return {
      text: `Today we're exploring ${focusArea.replace(/_/g, ' ')} concepts designed for your current learning level. Let's discover something new together!`,
      segments: [{
        title: focusArea.replace(/_/g, ' '),
        explanation: `Understanding ${focusArea.replace(/_/g, ' ')} is an important skill that builds your knowledge step by step.`,
        examples: [`Example for ${focusArea}`, `Another way to think about ${focusArea}`]
      }]
    };
  }

  private static createApplicationContent(subject: string, focusArea: string, difficulty: number, gradeLevel: number) {
    return {
      scenario: `Let's apply what we've learned about ${focusArea.replace(/_/g, ' ')} in a real-world situation!`,
      task: `Your challenge is to use ${focusArea.replace(/_/g, ' ')} skills to solve this problem.`,
      guidance: "Take your time and think through each step carefully."
    };
  }

  private static calculateDifficulty(studentProgress: StudentProgressData, gradeLevel: number): number {
    let baseDifficulty = Math.min(gradeLevel, 5);
    
    if (studentProgress.overallAccuracy > 85) {
      baseDifficulty = Math.min(baseDifficulty + 1, 10);
    } else if (studentProgress.overallAccuracy < 60) {
      baseDifficulty = Math.max(baseDifficulty - 1, 1);
    }

    return baseDifficulty;
  }

  private static getActivityTypeForIndex(index: number): string {
    const types = ['content-delivery', 'interactive-game', 'application', 'interactive-game', 'content-delivery', 'interactive-game', 'application'];
    return types[index % types.length];
  }

  private static mapActivityTypeToPhase(activityType: string): 'content-delivery' | 'interactive-game' | 'application' | 'introduction' | 'creative-exploration' | 'summary' {
    const phaseMap: Record<string, any> = {
      'content-delivery': 'content-delivery',
      'interactive-game': 'interactive-game',
      'application': 'application'
    };
    return phaseMap[activityType] || 'content-delivery';
  }
}
