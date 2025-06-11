
import { useMemo } from 'react';
import { createWelcomeActivity } from '../utils/welcomeActivityGenerator';
import { createMathematicsLesson } from '../lessons/MathematicsLessons';
import { createEnglishLesson } from '../lessons/EnglishLessons';
import { createScienceLesson } from '../lessons/ScienceLessons';
import { createMusicLesson } from '../lessons/MusicLessons';
import { createComputerScienceLesson } from '../lessons/ComputerScienceLessons';
import { createCreativeArtsLesson } from '../lessons/CreativeArtsLessons';

interface UseLessonContentGenerationProps {
  subject: string;
}

export const useLessonContentGeneration = ({ subject }: UseLessonContentGenerationProps) => {
  const baseLessonActivities = useMemo(() => {
    console.log(`🎯 Generating base lesson activities for ${subject}`);
    
    const welcomeActivity = createWelcomeActivity(subject);
    
    let subjectActivities = [];
    
    switch (subject.toLowerCase()) {
      case 'mathematics':
        subjectActivities = createMathematicsLesson();
        break;
      case 'english':
        subjectActivities = createEnglishLesson();
        break;
      case 'science':
        subjectActivities = createScienceLesson();
        break;
      case 'music':
        subjectActivities = createMusicLesson();
        break;
      case 'computer-science':
        subjectActivities = createComputerScienceLesson();
        break;
      case 'creative-arts':
        subjectActivities = createCreativeArtsLesson();
        break;
      default:
        console.warn(`No specific lesson content for subject: ${subject}`);
        subjectActivities = [];
    }
    
    return [welcomeActivity, ...subjectActivities];
  }, [subject]);

  return { baseLessonActivities };
};
