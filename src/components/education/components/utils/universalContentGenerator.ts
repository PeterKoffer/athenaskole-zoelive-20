
import { LessonActivity } from '../types/LessonTypes';

export class UniversalContentGenerator {
  static generateEngagingLesson(subject: string, skillArea: string, gradeLevel: number): LessonActivity[] {
    const lessonId = `${subject}-universal-${Date.now()}`;
    
    return [
      {
        id: `${lessonId}-welcome`,
        type: 'introduction',
        phase: 'introduction',
        title: `Welcome to ${subject.charAt(0).toUpperCase() + subject.slice(1)}`,
        duration: 120,
        phaseDescription: 'Your learning adventure begins!',
        metadata: {
          subject: subject,
          skillArea: skillArea
        },
        content: {
          hook: `Welcome to an exciting ${subject} lesson exploring ${skillArea}!`,
          text: `Today we'll discover amazing things about ${skillArea} through interactive activities and fun challenges!`
        }
      },
      
      {
        id: `${lessonId}-concept`,
        type: 'content-delivery',
        phase: 'content-delivery',
        title: `Exploring ${skillArea}`,
        duration: 180,
        phaseDescription: 'Learning core concepts',
        metadata: {
          subject: subject,
          skillArea: skillArea
        },
        content: {
          text: `Let's explore the fascinating world of ${skillArea}!`,
          segments: [{
            title: `Understanding ${skillArea}`,
            concept: skillArea,
            explanation: `${skillArea} is an important area of ${subject} that helps us understand the world around us.`,
            checkQuestion: {
              question: `What did you learn about ${skillArea}?`,
              options: ["It's interesting!", "It's useful!", "It's everywhere!", "All of the above!"],
              correctAnswer: 3,
              explanation: "Great! You're understanding the importance of this topic!"
            }
          }]
        }
      },
      
      {
        id: `${lessonId}-summary`,
        type: 'summary',
        phase: 'summary',
        title: 'Lesson Complete!',
        duration: 90,
        phaseDescription: 'Celebrating your learning achievements',
        metadata: {
          subject: subject,
          skillArea: skillArea
        },
        content: {
          keyTakeaways: [
            `You learned about ${skillArea}`,
            `You completed interactive activities`,
            `You're ready for more learning adventures!`
          ],
          nextTopicSuggestion: `Next, we could explore more about ${subject}!`
        }
      }
    ];
  }
}
