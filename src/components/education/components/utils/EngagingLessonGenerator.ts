
// @ts-nocheck
import { LessonActivity } from '../types/LessonTypes';

export interface EngagingLessonConfig {
  id: string;
  title: string;
  overview: string;
  gradeLevel: number;
  subject: string;
  skillArea: string;
  difficulty: number;
  estimatedDuration: number;
  activities: LessonActivity[];
}

export const generateEngagingLesson = async (
  subject: string,
  skillArea: string,
  gradeLevel: number = 3
): Promise<EngagingLessonConfig> => {
  const lessonId = `engaging_${subject}_${skillArea}_${Date.now()}`;
  
  const activities: LessonActivity[] = [];

  // Story-driven introduction
  activities.push({
    id: `${lessonId}_intro`,
    title: `${subject} Adventure Begins!`,
    type: 'introduction',
    phase: 'introduction',
    duration: 180,
    phaseDescription: 'Engaging story-driven introduction',
    metadata: {
      subject,
      skillArea
    },
    content: {
      storyHook: `Welcome to an amazing ${subject} adventure! Today you'll discover exciting ${skillArea} concepts through fun stories and challenges.`,
      text: `Get ready for an exciting journey into ${subject}!`
    }
  });

  // Interactive content delivery
  activities.push({
    id: `${lessonId}_content`,
    title: `Exploring ${skillArea}`,
    type: 'content-delivery',
    phase: 'content-delivery',
    duration: 300,
    phaseDescription: 'Interactive content exploration',
    metadata: {
      subject,
      skillArea
    },
    content: {
      text: `Let's dive deep into ${skillArea} concepts and discover how they work in the real world.`,
      segments: [{
        title: `Understanding ${skillArea}`,
        explanation: `${skillArea} is an important concept that helps us understand the world around us.`
      }]
    }
  });

  // Celebration and summary
  activities.push({
    id: `${lessonId}_celebration`,
    title: 'Achievement Unlocked!',
    type: 'summary',
    phase: 'summary',
    duration: 120,
    phaseDescription: 'Celebration and achievement recognition',
    metadata: {
      subject,
      skillArea
    },
    content: {
      achievementCelebration: `Congratulations! You've mastered ${skillArea} concepts!`,
      celebration: `Amazing work completing this ${subject} adventure!`,
      keyTakeaways: [`You learned about ${skillArea}`, `You solved challenging problems`, `You're ready for the next adventure!`]
    }
  });

  return {
    id: lessonId,
    title: `Engaging ${subject} - ${skillArea}`,
    overview: `An engaging, story-driven lesson about ${skillArea}`,
    gradeLevel,
    subject,
    skillArea,
    difficulty: gradeLevel,
    estimatedDuration: activities.reduce((total, activity) => total + activity.duration, 0),
    activities
  };
};

export const renderEngagingContent = (activity: LessonActivity): string => {
  switch (activity.type) {
    case 'introduction':
      return activity.content.storyHook || activity.content.text || 'Welcome to the lesson!';
    
    case 'summary':
      return activity.content.celebration || activity.content.achievementCelebration || 'Great job!';
    
    default:
      return activity.content.text || 'Lesson content';
  }
};
