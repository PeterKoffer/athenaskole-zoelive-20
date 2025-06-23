
import { useState, useEffect } from 'react';
import { LessonActivity } from '../types/LessonTypes';
import { UniversalContentGenerator } from '../utils/universalContentGenerator';
import { createWelcomeActivity } from '../utils/welcomeActivityGenerator';

interface UseUniversalLessonContentProps {
  subject: string;
  skillArea?: string;
  gradeLevel?: number;
}

export const useUniversalLessonContent = ({
  subject,
  skillArea = 'general',
  gradeLevel = 6
}: UseUniversalLessonContentProps) => {
  const [lessonActivities, setLessonActivities] = useState<LessonActivity[]>([]);
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    const generateUniversalLesson = async () => {
      console.log(`🌟 Generating universal ${subject} lesson with enhanced content...`);
      setIsGenerating(true);

      try {
        // Generate welcome activity
        const welcomeActivity = createWelcomeActivity(subject);

        // Generate all other engaging activities
        const mainActivities = UniversalContentGenerator.generateEngagingLesson(
          subject,
          skillArea,
          gradeLevel
        );

        // Combine welcome with main activities
        const allActivities = [welcomeActivity, ...mainActivities];

        console.log(`✅ Generated ${allActivities.length} universal activities for ${subject}:`,
          allActivities.map(a => a.title));

        setLessonActivities(allActivities);
      } catch (error) {
        console.error('❌ Error generating universal lesson:', error);

        // Fallback to basic welcome activity
        const fallbackActivity = createWelcomeActivity(subject);
        setLessonActivities([fallbackActivity]);
      } finally {
        setIsGenerating(false);
      }
    };

    if (subject) {
      generateUniversalLesson();
    }
  }, [subject, skillArea, gradeLevel]);

  const regenerateLesson = () => {
    console.log(`🔄 Regenerating universal ${subject} lesson...`);
    setLessonActivities([]);
    setIsGenerating(true);

    // Trigger regeneration by updating a dependency
    setTimeout(() => {
      const welcomeActivity = createWelcomeActivity(subject);
      const mainActivities = UniversalContentGenerator.generateEngagingLesson(
        subject,
        skillArea,
        gradeLevel
      );
      const allActivities = [welcomeActivity, ...mainActivities];

      setLessonActivities(allActivities);
      setIsGenerating(false);
    }, 1000);
  };

  return {
    lessonActivities,
    isGenerating,
    regenerateLesson,
    totalEstimatedTime: lessonActivities.reduce((total, activity) => total + activity.duration, 0)
  };
};
