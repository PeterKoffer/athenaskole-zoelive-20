
import { useState } from 'react';
import { useEnhancedTeachingEngine } from './useEnhancedTeachingEngine';
import { 
  createMathematicsLesson
} from '../lessons/MathematicsLessons';
import { createEnglishLesson } from '../lessons/EnglishLessons';
import { createScienceLesson } from '../lessons/ScienceLessons';
import { createMusicLesson } from '../lessons/MusicLessons';
import { createComputerScienceLesson } from '../lessons/ComputerScienceLessons';
import { createCreativeArtsLesson } from '../lessons/CreativeArtsLessons';
import { LessonActivity } from '../types/LessonTypes';

interface UseLessonContentGenerationProps {
  subject: string;
}

export const useLessonContentGeneration = ({ subject }: UseLessonContentGenerationProps) => {
  // Enhanced teaching engine configuration
  const teachingEngine = useEnhancedTeachingEngine({
    subject,
    difficulty: 3,
    studentEngagement: 75,
    learningSpeed: 'adaptive'
  });

  // Generate initial lesson activities
  const [baseLessonActivities] = useState<LessonActivity[]>(() => {
    console.log('🚀 Creating extended 18+ minute lesson for subject:', subject);
    
    let activities: LessonActivity[] = [];
    
    switch (subject.toLowerCase()) {
      case 'mathematics':
        activities = createMathematicsLesson();
        break;
      case 'english':
        activities = createEnglishLesson();
        break;
      case 'science':
        activities = createScienceLesson();
        break;
      case 'music':
        activities = createMusicLesson();
        break;
      case 'computer-science':
        activities = createComputerScienceLesson();
        break;
      case 'creative-arts':
        activities = createCreativeArtsLesson();
        break;
      default:
        activities = createEnglishLesson();
    }

    return activities.map(activity => ({
      ...teachingEngine.enhanceActivityContent(activity),
      duration: Math.max(activity.duration * 1.2, 180) // Minimum 3 minutes per activity
    }));
  });

  return {
    baseLessonActivities
  };
};
